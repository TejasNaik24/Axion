"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, Environment, Sphere } from "@react-three/drei";
import * as THREE from "three";

const MiniPrismaticOrb = () => {
    const groupRef = useRef<THREE.Group>(null);

    return (
        <group ref={groupRef}>
            {/* 1. Outer Aura Sphere (Violet) */}
            <Sphere args={[1.6, 32, 32]}>
                <MeshWobbleMaterial
                    speed={0}
                    factor={0}
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
                    speed={0}
                    factor={0}
                    color="#00f0d8"
                    roughness={0.1}
                    metalness={0.8}
                    transparent
                    opacity={0.5}
                    envMapIntensity={4}
                />
            </Sphere>

            {/* 3. Core Brand Sphere (White) */}
            <Sphere args={[0.7, 16, 16]}>
                <MeshWobbleMaterial
                    speed={0}
                    factor={0}
                    color="#ffffff"
                    transparent
                    opacity={0.9}
                />
            </Sphere>
        </group>
    );
};

export default function AxionOrbMini({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <div className={`${className} relative`} aria-hidden="true">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
                <Environment preset="studio" />
                <ambientLight intensity={0.5} />
                <pointLight position={[2, 3, 4]} intensity={4} color="#ffffff" />
                <pointLight position={[-2, -3, -4]} intensity={1} color="#00f0d8" />
                <MiniPrismaticOrb />
            </Canvas>
        </div>
    );
}
