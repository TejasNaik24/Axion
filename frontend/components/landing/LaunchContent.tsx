/**
 * LaunchContent Component
 *
 * Dev: this section is lazy-loaded and respects prefers-reduced-motion.
 * Read app/ components/ styles/ before editing.
 *
 * Purpose: Right-side content for the LaunchSection
 * - Large headline with slide-in animation
 * - Subhead with responsive text (shorter on mobile)
 * - Primary CTA (GlowingButton) and secondary CTA
 * - Trust line and micro footer text
 *
 * SSR: Safe - client component for animations
 */

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import GlowingButton from "./GlowingButton";

interface LaunchContentProps {
    onGetStarted?: () => void;
    onSeeDemo?: () => void;
}

export default function LaunchContent({
    onGetStarted,
    onSeeDemo,
}: LaunchContentProps) {
    const shouldReduceMotion = useReducedMotion();

    // Animation variants - using tuples for ease to satisfy TypeScript
    const headlineVariants = {
        hidden: { x: -32, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
        },
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const },
        },
    };

    const buttonStagger = {
        hidden: { opacity: 0, y: 12 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
        }),
    };

    return (
        <div className="flex flex-col items-start justify-center text-left lg:pl-8">
            {/* Headline - compact size like Huly */}
            <motion.h2
                variants={shouldReduceMotion ? {} : headlineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-4"
            >
                Take control of
                <br />
                your trajectory
            </motion.h2>

            {/* Subhead - compact */}
            <motion.p
                variants={shouldReduceMotion ? {} : contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="text-white/50 text-sm md:text-base max-w-sm mb-6"
            >
                {/* Full text on md+ */}
                <span className="hidden md:inline">
                    Smart, grounded advice — the next step is clearer than you think.
                </span>
                {/* Short text on mobile */}
                <span className="md:hidden">Smart advice. Real action.</span>
            </motion.p>

            {/* CTAs - both use GlowingButton */}
            <div className="flex flex-wrap gap-3 mb-6">
                {/* Primary CTA */}
                <motion.div
                    custom={0}
                    variants={shouldReduceMotion ? {} : buttonStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <GlowingButton
                        variant="primary"
                        size="md"
                        onClick={onGetStarted}
                        aria-label="Get started with Axion"
                    >
                        Get Started
                    </GlowingButton>
                </motion.div>

                {/* Secondary CTA - same style as hero */}
                <motion.div
                    custom={1}
                    variants={shouldReduceMotion ? {} : buttonStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <GlowingButton
                        variant="secondary"
                        size="md"
                        onClick={onSeeDemo}
                        aria-label="See Axion demo"
                    >
                        See Demo
                    </GlowingButton>
                </motion.div>
            </div>

            {/* Trust line */}
            <motion.p
                variants={shouldReduceMotion ? {} : contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="text-white/30 text-xs max-w-sm mb-6"
            >
                Backed by signal-driven retrieval and explainable recommendations.
            </motion.p>

            {/* Micro footer */}
            <motion.p
                variants={shouldReduceMotion ? {} : contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="text-white/20 text-[10px] uppercase tracking-widest"
            >
                Axion · Built for engineers.
            </motion.p>
        </div>
    );
}
