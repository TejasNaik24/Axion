/**
 * GhostWords Component
 *
 * Purpose: Renders a list of words with a cinematic ghost/blur animation.
 * Words slide up, fade in, and unblur in sequence.
 *
 * Features:
 * - Uses Framer Motion for opacity/transform
 * - Animates a CSS custom property --blur for high-performance blur effect
 * - Triggers `onWord` callback when each word animation starts/completes
 */

"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

interface GhostWordsProps {
    words: string[];
    onWord?: (index: number) => void;
    /** Global controls passed from parent orchestrator to sync exit animations */
    animate?: any;
}

export default function GhostWords({
    words,
    onWord,
    animate,
}: GhostWordsProps) {
    const shouldReduceMotion = useReducedMotion();

    // Animation variants for each word
    // Hidden: Blurred, transparent, slightly offset down
    // Visible: Sharp, opaque, in position
    const wordVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 18,
            filter: "blur(12px)",
        },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.5, // Even more elegant unblur
                ease: [0.25, 1, 0.5, 1],
                delay: i * 0.18, // Slightly slower ripple
            },
        }),
        exit: {
            opacity: 0,
            filter: "blur(14px)",
            y: -8,
            transition: { duration: 0.42, ease: "easeIn" },
        },
    };

    return (
        <div
            className="flex flex-nowrap items-center justify-center gap-[0.35em] sm:gap-[0.4em] pointer-events-none"
            aria-label={words.join(" ")}
        >
            {words.map((word, i) => (
                <motion.span
                    key={`${word}-${i}`}
                    custom={i}
                    variants={wordVariants}
                    initial={shouldReduceMotion ? "visible" : "hidden"}
                    animate={animate || "visible"}
                    exit="exit"
                    onAnimationComplete={(definition) => {
                        // Trigger callback when entry animation completes (mapped to "visible" state)
                        if (definition === "visible") {
                            if (onWord) onWord(i);
                        } else if (typeof definition === "object" && 'opacity' in definition && definition.opacity === 1) {
                            if (onWord) onWord(i);
                        }
                    }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/95 whitespace-nowrap"
                    style={{
                        // Use hardware acceleration for smoother filter application
                        transform: "translateZ(0)",
                        willChange: "opacity, filter, transform",
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
}
