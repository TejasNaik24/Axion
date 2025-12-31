"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import GlowingButton from "./GlowingButton";

/**
 * DemoHero - Sub-hero at the top of the Demo section
 * 
 * Features:
 * - H2 headline with fade-in-left animation
 * - Subtext with responsive mobile version
 * - Primary CTA button
 * - Respects reduced motion preferences
 */

interface DemoHeroProps {
    onWatchDemo?: () => void;
}

export default function DemoHero({ onWatchDemo }: DemoHeroProps) {
    const prefersReducedMotion = useReducedMotion();

    // Animation variants - fade in from left
    const fadeInLeft = {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
    };

    // Respect reduced motion: instant transition if enabled
    const transition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }; // easeOut cubic bezier

    return (
        <div className="space-y-6">
            {/* Headline */}
            <motion.h2
                initial={fadeInLeft.initial}
                whileInView={fadeInLeft.animate}
                viewport={{ once: true, amount: 0.5 }}
                transition={transition}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
            >
                See how it works
            </motion.h2>

            {/* Accent bar */}
            <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.2 }}
                className="h-1 w-20 bg-accent1 rounded-full"
            />

            {/* Subtext - Desktop version */}
            <motion.p
                initial={fadeInLeft.initial}
                whileInView={fadeInLeft.animate}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.1 }}
                className="hidden md:block text-white/60 leading-relaxed max-w-lg text-lg"
            >
                Watch a short walkthrough of how Axion analyzes a profile, asks targeted
                questions, and delivers a prioritized action plan.
            </motion.p>

            {/* Subtext - Mobile version (shorter) */}
            <motion.p
                initial={fadeInLeft.initial}
                whileInView={fadeInLeft.animate}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.1 }}
                className="md:hidden text-white/60 leading-relaxed text-base"
            >
                See what Axion does in 90s
            </motion.p>

            {/* Primary CTA */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.3 }}
            >
                <GlowingButton
                    variant="primary"
                    size="md"
                    onClick={onWatchDemo}
                    aria-label="Watch the demo video"
                >
                    Watch Demo
                </GlowingButton>
            </motion.div>
        </div>
    );
}
