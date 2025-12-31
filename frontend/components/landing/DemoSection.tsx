"use client";
import React, { Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";

/**
 * DemoSection - Simplified demo section for the Axion landing page
 * 
 * Layout:
 * - Centered "Demo" title
 * - Centered description text
 * - Large centered video player below
 */

// Lazy load DemoVideo for performance
const DemoVideo = dynamic(() => import("./DemoVideo"), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-4xl mx-auto aspect-video rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/10 animate-pulse flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/5" />
        </div>
    ),
});

export default function DemoSection() {
    const prefersReducedMotion = useReducedMotion();

    const transition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const };

    return (
        <motion.section
            id="demo"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={transition}
            className="py-24 relative z-10"
        >
            <div className="container mx-auto px-6">
                {/* Centered text content */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ ...transition, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                    >
                        Demo
                    </motion.h2>

                    {/* Accent bar */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ ...transition, delay: 0.2 }}
                        className="h-1 w-20 bg-accent1 rounded-full mx-auto mb-8"
                    />

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ ...transition, delay: 0.3 }}
                        className="text-white/60 text-lg md:text-xl leading-relaxed"
                    >
                        Watch a short walkthrough of how Axion analyzes a profile, asks
                        targeted questions, and delivers a prioritized action plan.
                    </motion.p>
                </div>

                {/* Large centered video */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...transition, delay: 0.4 }}
                    className="max-w-4xl mx-auto"
                >
                    <Suspense
                        fallback={
                            <div className="w-full aspect-video rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/10 animate-pulse flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-white/5" />
                            </div>
                        }
                    >
                        <DemoVideo />
                    </Suspense>
                </motion.div>
            </div>

            {/* Subtle background gradient */}
            <div
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(0, 240, 216, 0.03) 0%, transparent 60%)",
                }}
            />
        </motion.section>
    );
}
