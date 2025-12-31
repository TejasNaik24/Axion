"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import GlowingButton from "./GlowingButton";

/**
 * DemoFooterCtas - CTA row at the bottom of the Demo section
 * 
 * Features:
 * - Primary CTA: "Try your resume"
 * - Secondary CTA: "See full walkthrough"
 * - Staggered entrance animation
 * - Respects reduced motion
 */

interface DemoFooterCtasProps {
    onTryResume?: () => void;
    onWalkthrough?: () => void;
}

export default function DemoFooterCtas({
    onTryResume,
    onWalkthrough,
}: DemoFooterCtasProps) {
    const prefersReducedMotion = useReducedMotion();

    const transition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }; // easeOut cubic bezier

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="flex flex-wrap items-center gap-4 pt-8 border-t border-white/5"
        >
            {/* Primary CTA */}
            <GlowingButton
                variant="primary"
                size="md"
                onClick={onTryResume}
                aria-label="Upload your resume for analysis"
            >
                Try your resume
            </GlowingButton>

            {/* Secondary CTA */}
            <GlowingButton
                variant="secondary"
                size="md"
                onClick={onWalkthrough}
                aria-label="See the full product walkthrough"
            >
                See full walkthrough
            </GlowingButton>
        </motion.div>
    );
}
