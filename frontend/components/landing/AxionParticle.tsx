"use client";
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Torus, Sphere, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

/**
 * AXION PARTICLE
 * 
 * Elements:
 * 1. Field Shell: Subtle glass boundary
 * 2. Phase Bands: Thick, visible Violet rings (Gyroscopic)
 * 3. Decision Core: Neon Green Active pulsing element
 */

export type ParticleState = 'idle' | 'retrieving' | 'deciding' | 'output';

// --- Constants ---
const BASELINE_SPIN = 0.002;
const POINTER_BIAS_LERP = 0.05;
const RING_BASE_SPEED = 0.005;

function ParticleScene({
  state,
  interactive,
  mouseRef,
}: {
  state: ParticleState;
  interactive: boolean;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const tiltRef = useRef<THREE.Group>(null); // Interactive Tilt Layer
  const spinRef = useRef<THREE.Group>(null); // Constant Spin Layer

  // Refs for individual rings
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const coreRef = useRef<THREE.Mesh>(null);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Targets
  const targetEmissive = useRef(1.0);
  const pulseScale = useRef(1);

  // Burst State (Hero Only)
  const burstState = useRef({
    active: false,
    endTime: 0,
    nextTime: 2.0, // First burst happens soon
    speedFactor: 1.0
  });

  useFrame((stateThree) => {
    if (!tiltRef.current || !spinRef.current || !coreRef.current || !coreMatRef.current) return;

    const { clock } = stateThree;
    const t = clock.getElapsedTime();
    const mouse = mouseRef.current;

    // --- Random Speed Bursts (Interactive/Hero Only) ---
    if (interactive) {
      if (!burstState.current.active && t > burstState.current.nextTime) {
        // Start Burst
        burstState.current.active = true;
        burstState.current.endTime = t + 1.5 + Math.random() * 1.0; // Burst duration: 1.5s - 2.5s
        burstState.current.nextTime = burstState.current.endTime + 5 + Math.random() * 5; // Cooldown: 5-10s
      } else if (burstState.current.active && t > burstState.current.endTime) {
        // End Burst
        burstState.current.active = false;
      }
    }

    // Smoothly lerp speed factor
    const targetSpeed = burstState.current.active ? 50.0 : 1.0;
    burstState.current.speedFactor = THREE.MathUtils.lerp(burstState.current.speedFactor, targetSpeed, 0.08);

    const SP = burstState.current.speedFactor;

    // --- State Mapping ---
    if (state === 'idle') {
      targetEmissive.current = 1.0;
      pulseScale.current = 1 + Math.sin(t * 2) * 0.05;

    } else if (state === 'retrieving') {
      targetEmissive.current = 2.0;
      pulseScale.current = 1 + Math.sin(t * 15) * 0.05;

    } else if (state === 'deciding') {
      targetEmissive.current = 1.5;
      const pulse = (Math.sin(t * 8) + 1) * 0.5;
      pulseScale.current = 1 + pulse * 0.2;

    } else if (state === 'output') {
      targetEmissive.current = 2.5;
      pulseScale.current = 1;
    }

    // --- Animations ---

    // 1. Constant Spin (Inner Layer) - Affected by Burst
    spinRef.current.rotation.y += BASELINE_SPIN * SP;

    // 2. Interactive Tilt (Outer Layer) - NOT affected by burst speed, handles mouse
    if (interactive) {
      // Tilt
      tiltRef.current.rotation.x = THREE.MathUtils.lerp(tiltRef.current.rotation.x, -mouse.y * 0.5, POINTER_BIAS_LERP);
      tiltRef.current.rotation.y = THREE.MathUtils.lerp(tiltRef.current.rotation.y, mouse.x * 0.5, POINTER_BIAS_LERP);

      // Move
      const targetX = mouse.x * 0.5;
      const targetY = mouse.y * 0.5;
      tiltRef.current.position.x = THREE.MathUtils.lerp(tiltRef.current.position.x, targetX, POINTER_BIAS_LERP);
      tiltRef.current.position.y = THREE.MathUtils.lerp(tiltRef.current.position.y, targetY, POINTER_BIAS_LERP);
    }

    // 3. Ring Gyroscopics - Affected by Burst
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += RING_BASE_SPEED * SP;
      ring1Ref.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= RING_BASE_SPEED * 0.8 * SP;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += RING_BASE_SPEED * 0.5 * SP;
      ring3Ref.current.rotation.y += RING_BASE_SPEED * 0.5 * SP;
    }

    // Core Pulse - Brighten during burst
    if (coreMatRef.current) {
      const burstGlow = burstState.current.active ? 1.0 : 0.0;
      coreMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(coreMatRef.current.emissiveIntensity, targetEmissive.current + burstGlow, 0.1);
    }
    coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, pulseScale.current, 0.1));
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        {/* 1. Field Shell - Glassy */}
        <Sphere args={[1.3, 32, 32]}>
          <meshPhysicalMaterial
            color="#0a1020"
            roughness={0}
            metalness={0.1}
            transmission={0.9}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </Sphere>

        {/* 2. Phase Bands - VIOLET #7c4cff */}
        <group>
          {/* Ring 1 */}
          <Torus ref={ring1Ref} args={[1.0, 0.04, 32, 100]} rotation={[Math.PI / 3, 0, 0]}>
            <meshStandardMaterial
              color="#7C4CFF"
              emissiveIntensity={1.5}
              toneMapped={false}
              transparent={false}
              roughness={0.2}
            />
          </Torus>

          {/* Ring 2 */}
          <Torus ref={ring2Ref} args={[0.9, 0.035, 32, 100]} rotation={[0, Math.PI / 4, 0]}>
            <meshStandardMaterial
              color="#7C4CFF"
              emissiveIntensity={1.2}
              toneMapped={false}
              transparent={false}
              roughness={0.2}
            />
          </Torus>

          {/* Ring 3 */}
          <Torus ref={ring3Ref} args={[1.15, 0.03, 32, 100]} rotation={[Math.PI / 2, Math.PI / 6, 0]}>
            <meshStandardMaterial
              color="#7C4CFF"
              emissiveIntensity={0.8}
              toneMapped={false}
              transparent={false}
              roughness={0.2}
            />
          </Torus>
        </group>

        {/* 3. Decision Core - NEON GREEN #00f0d8 */}
        <Sphere ref={coreRef} args={[0.28, 32, 32]}>
          <meshStandardMaterial
            ref={coreMatRef}
            color="#00f0d8"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </Sphere>
      </group>

      {/* Lights */}
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={2} color="#7C4CFF" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#00f0d8" distance={4} />
      <ambientLight intensity={0.5} />
    </group>
  );
}

// Fallback for Reduced Motion
function ParticleFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 1. Field Shell (Subtle Glass) */}
        <circle cx="100" cy="100" r="90" fill="#0a1020" fillOpacity="0.3" stroke="#7C4CFF" strokeOpacity="0.1" strokeWidth="2" />

        {/* 2. Core (Neon Green #00f0d8) */}
        <circle cx="100" cy="100" r="25" fill="#00f0d8" />

        {/* 3. Phase Bands (Multiple Tilted Rings - Violet #7c4cff) */}
        <ellipse cx="100" cy="100" rx="75" ry="30" transform="rotate(-30 100 100)" stroke="#7C4CFF" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="100" cy="100" rx="65" ry="20" transform="rotate(45 100 100)" stroke="#7C4CFF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function AxionOrb({
  className = "w-full h-[600px]",
  style,
  state = 'idle',
  interactive = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  state?: ParticleState;
  interactive?: boolean;
}) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
  };

  if (shouldReduceMotion || !mounted) {
    return (
      <div className={`${className} relative`} style={style}>
        <ParticleFallback />
      </div>
    );
  }

  return (
    <div
      className={`${className} relative transition-all duration-700`}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { mouseRef.current = { x: 0, y: 0 }; }}
      role="img"
      aria-label={`Axion particle visualization — currently ${state}`}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full opacity-30 pointer-events-none mix-blend-screen"
        style={{
          background: "radial-gradient(circle at center, var(--accent1) 0%, transparent 60%)",
          filter: "blur(70px)",
          transform: "scale(0.8)",
        }}
      />

      <Canvas camera={{ position: [0, 0, 6], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <Environment preset="city" />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <ParticleScene state={state} interactive={interactive} mouseRef={mouseRef} />
        </Float>
      </Canvas>
    </div>
  );
}
