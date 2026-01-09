"use client";
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshWobbleMaterial,
  Float,
  Environment,
  Sphere,
} from "@react-three/drei";
import * as THREE from "three";

function PrismaticCore({
  mouseRef,
  isHovered,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  isHovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const mouse = mouseRef.current;

    // Smooth movement
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.3,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.y * 0.3,
      0.05
    );

    // Position parallax
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      mouse.x * 0.2,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      mouse.y * 0.2,
      0.05
    );

    // Subtle breathing
    const scale = 1 + Math.sin(t * 1.5) * 0.03;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      {/* 1. Outer Aura Sphere (Violet) */}
      <Sphere args={[1.6, 64, 64]}>
        <MeshWobbleMaterial
          speed={1}
          factor={0.4}
          color="#7c4cff"
          roughness={0}
          metalness={0.9}
          transparent
          opacity={0.3}
          envMapIntensity={2}
        />
      </Sphere>

      {/* 2. Middle Energy Sphere (Cyan) */}
      <Sphere args={[1.3, 64, 64]}>
        <MeshWobbleMaterial
          speed={1.5}
          factor={0.5}
          color="#00f0d8"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.5}
          envMapIntensity={4}
        />
      </Sphere>

      {/* 3. Core Brand Sphere (White/Glow) */}
      <Sphere args={[0.7, 32, 32]}>
        <MeshWobbleMaterial
          speed={2}
          factor={0.2}
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
          transparent
          opacity={0.9}
        />
      </Sphere>

      <pointLight position={[2, 3, 4]} intensity={2} color="#ffffff" />
      <pointLight position={[-2, -3, -4]} intensity={1} color="#00f0d8" />
    </group>
  );
}

export default function AxionOrb() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isHovered, setHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
  };

  return (
    <div
      className="w-full h-[600px] relative transition-all duration-700"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        mouseRef.current = { x: 0, y: 0 };
      }}
    >
      {/* Clean Gradient Aura */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000 ${isHovered ? "opacity-15" : "opacity-5"
          }`}
        style={{
          background:
            "radial-gradient(circle at center, var(--accent1) 0%, var(--accent2) 35%, transparent 45%)",
          filter: "blur(40px)",
        }}
      />

      <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <Environment preset="night" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <PrismaticCore mouseRef={mouseRef} isHovered={isHovered} />
        </Float>
      </Canvas>
    </div>
  );
}
