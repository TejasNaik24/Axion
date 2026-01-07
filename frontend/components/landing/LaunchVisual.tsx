/**
 * LaunchVisual Component
 *
 * Dev: this section is lazy-loaded and respects prefers-reduced-motion.
 * Read app/ components/ styles/ before editing.
 *
 * Purpose: Left-side animated "Momentum Clock" visual for LaunchSection
 * - CSS-based clock dial with numbers, rotating hands with glowing trails
 * - Pointer-reactive specular highlight
 * - Click triggers demo pulse animation
 * - Static fallback for reduced-motion
 *
 * TODO: Upgrade to @react-three/fiber version for enhanced 3D effect
 * TODO: trigger demo visual pulse from actual RAG events
 *
 * SSR: Must be dynamically imported with ssr: false
 */

"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "@/styles/launch.module.css";

interface LaunchVisualProps {
    className?: string;
}

export default function LaunchVisual({ className = "" }: LaunchVisualProps) {
    const shouldReduceMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);
    const [isPulsing, setIsPulsing] = useState(false);

    // Handle pointer move for specular highlight
    const handlePointerMove = (e: React.PointerEvent) => {
        if (shouldReduceMotion || !highlightRef.current || !containerRef.current)
            return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 40;
        const y = e.clientY - rect.top - 40;

        highlightRef.current.style.transform = `translate(${x}px, ${y}px)`;
        highlightRef.current.style.opacity = "1";
    };

    const handlePointerLeave = () => {
        if (highlightRef.current) {
            highlightRef.current.style.opacity = "0";
        }
    };

    // Handle click for demo pulse
    const handleClick = () => {
        if (shouldReduceMotion || isPulsing) return;
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 2000);
    };

    // Clock numbers positioned around the dial
    const clockNumbers = [
        { num: "12", style: { top: "8%", left: "50%", transform: "translateX(-50%)" } },
        { num: "3", style: { top: "50%", right: "10%", transform: "translateY(-50%)" } },
        { num: "6", style: { bottom: "8%", left: "50%", transform: "translateX(-50%)" } },
        { num: "9", style: { top: "50%", left: "10%", transform: "translateY(-50%)" } },
    ];

    // If reduced motion, show static fallback
    if (shouldReduceMotion) {
        return (
            <div
                className={`${styles.staticFallback} ${className}`}
                role="img"
                aria-label="Momentum clock visual representing retrieved signals and trajectory"
            >
                <div className={styles.staticRing} />
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
            onPointerMove={handlePointerMove}
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
            {/* Outer ring with subtle border */}
            <div className={styles.outerRing} />

            {/* Tick marks around the dial */}
            <div className={styles.tickRing} />

            {/* Clock numbers */}
            {clockNumbers.map(({ num, style }) => (
                <div
                    key={num}
                    className={styles.clockNumber}
                    style={style as React.CSSProperties}
                >
                    {num}
                </div>
            ))}

            {/* Hour hand with trail */}
            <div className={`${styles.hourHand} ${isPulsing ? styles.handPulse : ""}`}>
                <div className={styles.handTrail} />
            </div>

            {/* Minute hand with trail */}
            <div className={`${styles.minuteHand} ${isPulsing ? styles.handPulse : ""}`}>
                <div className={styles.handTrail} />
            </div>

            {/* Rotating arc - sweeps with cyan → violet gradient */}
            <div
                className={`${styles.arcSweep} ${isPulsing ? styles.arcSweepPulse : ""}`}
            />

            {/* Arc glow overlay */}
            <div
                className={`${styles.arcGlow} ${isPulsing ? styles.arcSweepPulse : ""}`}
            />

            {/* Inner pulsing orb (center cap) */}
            <motion.div
                className={styles.innerOrb}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className={styles.orbCore} />
            </motion.div>

            {/* Specular highlight - follows cursor */}
            <div
                ref={highlightRef}
                className={styles.specularHighlight}
                style={{ opacity: 0 }}
            />

            {/* Accessibility: hidden text for screen readers */}
            <span className="sr-only">
                Interactive momentum clock showing career trajectory signals
            </span>
        </motion.div>
    );
}
