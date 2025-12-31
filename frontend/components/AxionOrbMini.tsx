"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

const MiniOrb = () => {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.02;
            mesh.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <mesh ref={mesh} scale={1.2}>
            <sphereGeometry args={[1, 16, 16]} />
            <MeshWobbleMaterial
                color="#00f0d8"
                factor={0.4}
                speed={2}
                roughness={0.2}
                metalness={0.6}
                emissive="#00f0d8"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
};

export default function AxionOrbMini() {
    return (
        <div className="w-8 h-8 relative cursor-pointer group" aria-hidden="true">
            <div className="absolute inset-0 bg-accent1/20 blur-lg rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={1} />
                <MiniOrb />
            </Canvas>
        </div>
    );
}
