/**
 * LaunchVisual Component
 *
 * Dev: this section is lazy-loaded and respects prefers-reduced-motion.
 * Read app/ components/ styles/ before editing.
 *
 * Purpose: Left-side animated "Momentum Clock" visual for LaunchSection
 * - HTML clock dial with numbers positioned inside the circle
 * - R3F/Three.js rotating hands with tip-based trail effects
 * - Trails rendered behind hands using BufferGeometry + custom shader
 * - Click triggers demo pulse animation
 * - SVG fallback for reduced-motion
 *
 * Implementation: Hybrid approach with HTML clock face overlay + R3F Canvas for hands/trails
 *
 * SSR: Must be dynamically imported with ssr: false
 */

"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import * as THREE from "three";
import styles from "@/styles/launch.module.css";
import ClockTrail from "./ClockTrail";
import ClockFallbackTrail from "./ClockFallbackTrail";

// Use dynamic import for Three.js component to ensure stability
const AxionOrbMini = dynamic(
  () => import("@/components/landing/AxionOrbMini"),
  { ssr: false }
);

// Clock hand lengths (in Three.js units, scaled to match 420px clock face)
const HOUR_HAND_LENGTH = 0.52; // ~110px at scale
const MINUTE_HAND_LENGTH = 0.75; // ~158px at scale
const HAND_WIDTH = 0.03;

/**
 * ClockHands Component
 *
 * Renders hour and minute hands as Three.js meshes with proper rotation
 * Exposes refs for trail components to track tip positions
 */
function ClockHands({ isPulsing }: { isPulsing: boolean }) {
  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);

  // Rotate hands continuously
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (hourHandRef.current) {
      // Hour hand: full rotation in 40 seconds (slightly faster)
      hourHandRef.current.rotation.z = -t * (Math.PI / 20);
    }

    if (minuteHandRef.current) {
      // Minute hand: full rotation in 12 seconds
      minuteHandRef.current.rotation.z = -t * (Math.PI / 6);
    }
  });

  // Hand geometry: rectangle from origin to tip
  const hourHandGeometry = new THREE.BoxGeometry(
    HOUR_HAND_LENGTH,
    HAND_WIDTH,
    0.01
  );
  const minuteHandGeometry = new THREE.BoxGeometry(
    MINUTE_HAND_LENGTH,
    HAND_WIDTH * 0.8,
    0.01
  );

  // Shift geometry so origin is at base (not center)
  hourHandGeometry.translate(HOUR_HAND_LENGTH / 2, 0, 0);
  minuteHandGeometry.translate(MINUTE_HAND_LENGTH / 2, 0, 0);

  return (
    <group>
      {/* Hour hand trails - rendered behind hands */}
      <ClockTrail
        handRef={hourHandRef}
        handLength={HOUR_HAND_LENGTH}
        color="#a080ff"
        thickness={0.1}
        maxSamples={300}
      />

      {/* Minute hand trails - rendered behind hands */}
      <ClockTrail
        handRef={minuteHandRef}
        handLength={MINUTE_HAND_LENGTH}
        color="#00f0d8"
        thickness={0.08}
        maxSamples={60}
      />

      {/* Hour hand mesh */}
      <mesh ref={hourHandRef} renderOrder={1}>
        <primitive object={hourHandGeometry} />
        <meshBasicMaterial
          color="#a080ff"
          toneMapped={false}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Minute hand mesh */}
      <mesh ref={minuteHandRef} renderOrder={1}>
        <primitive object={minuteHandGeometry} />
        <meshBasicMaterial
          color="#32ffeb"
          toneMapped={false}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

interface LaunchVisualProps {
  className?: string;
}

export default function LaunchVisual({ className = "" }: LaunchVisualProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  const handlePointerLeave = () => { };

  // Handle click for demo pulse
  const handleClick = () => {
    if (shouldReduceMotion || isPulsing) return;
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 2000);
  };

  // Clock numbers positioned in a circle - spread out towards the edge
  const clockNumbers = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = (num * 30 - 90) * (Math.PI / 180);
    const radius = 42; // Perfectly balanced position

    return {
      num,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });

  // If reduced motion, show static fallback
  if (shouldReduceMotion) {
    return (
      <div
        className={`${styles.staticFallback} ${className}`}
        role="img"
        aria-label="Momentum clock visual representing retrieved signals and trajectory"
      >
        <div className={styles.staticRing} />
        <ClockFallbackTrail />
        <div className={styles.staticOrb} />
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className={`${styles.dialContainer} ${className} cursor-pointer`}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      role="img"
      aria-label="Momentum clock visual representing retrieved signals and trajectory. Click for demo animation."
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Fixed-size clock face wrapper - 420x420 */}
      <div className={styles.clockFace}>
        {/* Outer ring with subtle border */}
        <div className={styles.outerRing} />

        {/* Tick marks around the dial */}
        <div className={styles.tickRing} />

        {/* Clock numbers - all 12 numbers positioned in a circle */}
        {clockNumbers.map(({ num, x, y }) => (
          <div
            key={num}
            className={styles.clockNumber}
            style={{
              top: `${y}%`,
              left: `${x}%`,
            }}
          >
            {num}
          </div>
        ))}

        {/* R3F Canvas for hands and trails */}
        <div className={styles.canvasContainer}>
          <Canvas
            camera={{
              position: [0, 0, 2],
              fov: 50,
            }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            }}
          >
            <ClockHands isPulsing={isPulsing} />
          </Canvas>
        </div>

        {/* Center cap for hand connection */}
        <div className={styles.handCap} />

        {/* Center interactive orb - forced size for stability */}
        <div className={styles.miniOrbWrapper}>
          <AxionOrbMini className={styles.miniOrb} />
        </div>
      </div>

      {/* Accessibility: hidden text for screen readers */}
      <span className="sr-only">
        Interactive momentum clock showing career trajectory signals
      </span>
    </motion.div>
  );
}
