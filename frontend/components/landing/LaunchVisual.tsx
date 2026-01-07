/**
 * LaunchVisual Component
 *
 * Dev: this section is lazy-loaded and respects prefers-reduced-motion.
 * Read app/ components/ styles/ before editing.
 *
 * Purpose: Left-side animated "Momentum Clock" visual for LaunchSection
 * - CSS-based clock dial with numbers positioned inside the circle
 * - Rotating hands with drawn/painted trail effects (like Huly)
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
import dynamic from "next/dynamic";
import styles from "@/styles/launch.module.css";

// Use dynamic import for Three.js component to ensure stability
const AxionOrbMini = dynamic(() => import("@/components/landing/AxionOrbMini"), { ssr: false });

interface LaunchVisualProps {
    className?: string;
}

export default function LaunchVisual({ className = "" }: LaunchVisualProps) {
    const shouldReduceMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);
    const [isPulsing, setIsPulsing] = useState(false);

    const handlePointerLeave = () => {
    };

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
            {/* Fixed-size clock face wrapper - 320x320 */}
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

                {/* Hour hand with drawn purple trail */}
                <div className={`${styles.hourHandContainer} ${isPulsing ? styles.handPulse : ""}`}>
                    <div className={styles.hourTrail} />
                    <div className={styles.hourHand} />
                </div>

                {/* Minute hand with drawn cyan trail */}
                <div className={`${styles.minuteHandContainer} ${isPulsing ? styles.handPulse : ""}`}>
                    <div className={styles.minuteTrail} />
                    <div className={styles.minuteHand} />
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
