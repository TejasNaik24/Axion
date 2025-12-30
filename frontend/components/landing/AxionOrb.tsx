"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// SVG Fallback for reduced motion or WebGL failure
const SVGFallback: React.FC = () => {
  return (
    <div className="w-full h-125 flex items-center justify-center relative">
      <svg
        className="w-full h-full max-w-md max-h-md"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Axion Intelligence Core"
      >
        {/* Outer ring - accent2 */}
        <circle
          cx="200"
          cy="200"
          r="140"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          className="opacity-40"
        />
        {/* Middle ring - accent1 */}
        <circle
          cx="200"
          cy="200"
          r="100"
          stroke="url(#gradient2)"
          strokeWidth="3"
          fill="none"
          className="opacity-60"
        />
        {/* Core sphere */}
        <circle
          cx="200"
          cy="200"
          r="70"
          fill="url(#radialGradient)"
          className="opacity-80"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c4cff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00f0d8" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0d8" stopOpacity="1" />
            <stop offset="100%" stopColor="#7c4cff" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="radialGradient">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00f0d8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7c4cff" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-accent1/10 blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

// Interactive inner sphere component
function OrbCore({
  mouseRef,
  isHovered,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Layer config: inner core, middle layer, outer glow
  const layers = useMemo(
    () => [
      { scale: 1.0, color: "#00f0d8", speed: 1.5, factor: 0.6 }, // Middle - cyan
      { scale: 1.18, color: "#7c4cff", speed: 1.2, factor: 0.4 }, // Outer - violet
      { scale: 0.82, color: "#ffffff", speed: 2.0, factor: 0.8 }, // Core - white
    ],
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const mouse = mouseRef.current;

    // 3D Tilt: orb rotates strongly based on cursor position for depth effect
    const tiltIntensity = isHovered ? 1.2 : 0.3;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouse.x * tiltIntensity,
      0.08
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -mouse.y * tiltIntensity,
      0.08
    );

    // 3D Position: orb physically moves toward cursor for parallax depth
    const positionIntensity = isHovered ? 0.5 : 0.2;
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mouse.x * positionIntensity,
      0.08
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      mouse.y * positionIntensity,
      0.08
    );

    // Idle rotation for liveliness
    meshRef.current.rotation.z += 0.002;

    // Subtle breathing pulse: gentle scale (no burst)
    const breathingScale = 1 + Math.sin(t * 0.8) * 0.02;
    meshRef.current.scale.setScalar(breathingScale);

    // Light intensity: increases on hover, driven by pointer proximity
    if (lightRef.current) {
      const dist = Math.sqrt(mouse.x ** 2 + mouse.y ** 2); // 0 at center, ~1.4 at corners
      const baseIntensity = isHovered ? 3.5 : 2.0;
      const targetIntensity = baseIntensity - dist * 0.5;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetIntensity,
        0.1
      );
    }
  });

  return (
    <group ref={meshRef}>
      {layers.map((layer, i) => (
        <mesh key={i} scale={layer.scale}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshWobbleMaterial
            attach="material"
            color={layer.color}
            factor={layer.factor}
            speed={layer.speed}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.65}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* Dynamic point light that reacts to hover and pointer position */}
      <pointLight
        ref={lightRef}
        position={[2, 3, 4]}
        color="#ffffff"
        distance={10}
        intensity={2}
      />
    </group>
  );
}

export const AxionOrb: React.FC = () => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isHovered, setHovered] = useState(false);
  const [shouldUseReducedMotion, setShouldUseReducedMotion] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(false);

  // Detect prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldUseReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldUseReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Track localized pointer for parallax (normalized to -1 to 1)
  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.current = { x, y };
  };

  const handlePointerEnter = () => setHovered(true);
  const handlePointerLeave = () => {
    setHovered(false);
    mouseRef.current = { x: 0, y: 0 };
  };

  // If reduced motion is preferred or WebGL failed, show SVG fallback
  if (shouldUseReducedMotion || webGLFailed) {
    return <SVGFallback />;
  }

  return (
    <div
      className="w-full h-125 cursor-pointer group"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      role="img"
      aria-label="Interactive Axion Intelligence Core with 3D tilt effect"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          // Detect WebGL failure
          try {
            gl.getContext();
          } catch (e) {
            setWebGLFailed(true);
          }
        }}
      >
        {/* Fallback environment lighting */}
        <Environment preset="city" />
        <ambientLight intensity={0.5} />

        {/* Float adds gentle bobbing motion */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <OrbCore mouseRef={mouseRef} isHovered={isHovered} />
        </Float>
      </Canvas>
    </div>
  );
};

export default AxionOrb;
