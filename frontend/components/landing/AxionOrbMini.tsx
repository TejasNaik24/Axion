"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, Environment, Sphere } from "@react-three/drei";
import * as THREE from "three";

const MiniPrismaticOrb = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.01;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* 1. Outer Aura Sphere (Violet) */}
            <Sphere args={[1.6, 32, 32]}>
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
            <Sphere args={[1.3, 32, 32]}>
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
            <Sphere args={[0.7, 16, 16]}>
                <MeshWobbleMaterial
                    speed={2}
                    factor={0.2}
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.9}
                />
            </Sphere>
        </group>
    );
};

export default function AxionOrbMini() {
    return (
        <div className="w-8 h-8 relative cursor-pointer group" aria-hidden="true">
            {/* Subtle Aura Shadow for UI depth */}
            <div className="absolute -inset-1 bg-accent1/20 blur-md rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
                <Environment preset="studio" />
                <ambientLight intensity={0.5} />
                <pointLight position={[2, 3, 4]} intensity={2} color="#ffffff" />
                <pointLight position={[-2, -3, -4]} intensity={1} color="#00f0d8" />
                <MiniPrismaticOrb />
            </Canvas>
        </div>
    );
}
