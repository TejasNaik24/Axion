/**
 * LaunchSection Component
 *
 * Dev: this section is lazy-loaded and respects prefers-reduced-motion.
 * Read app/ components/ styles/ before editing.
 *
 * Purpose: High-impact "Launch / Get Started" section at the bottom of the landing page
 * - Two-column desktop layout (visual left, content right)
 * - Stacked layout on mobile (visual above, content below)
 * - Lazy-loaded visual for performance
 * - Scroll-triggered entrance animations
 *
 * TODO: wire Get Started CTA to onboarding flow
 *
 * SSR: Client component for animations
 */

"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import LaunchContent from "./LaunchContent";
import LaunchVisualPlaceholder from "./LaunchVisualPlaceholder";

// Lazy-load the visual component to avoid heavy bundle
const LaunchVisual = dynamic<any>(() => import("./LaunchVisual"), {
    ssr: false,
    loading: () => <LaunchVisualPlaceholder />,
});

interface LaunchSectionProps {
    onGetStarted?: () => void;
    onSeeDemo?: () => void;
}

export default function LaunchSection({
    onGetStarted,
    onSeeDemo,
}: LaunchSectionProps) {
    const shouldReduceMotion = useReducedMotion();
    const router = useRouter();

    // Section entrance animation - using tuple for ease
    const sectionVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
        },
    };

    const handleGetStarted = () => {
        router.push("/signup");
        onGetStarted?.();
    };

    const handleSeeDemo = () => {
        // Scroll to demo section or open modal
        const demoSection = document.getElementById("demo");
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: "smooth" });
        }
        onSeeDemo?.();
    };

    return (
        <motion.section
            id="launch"
            variants={shouldReduceMotion ? {} : sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative w-full pt-16 md:pt-20 lg:pt-24 overflow-hidden"
            aria-labelledby="launch-heading"
        >
            {/* Background glow effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Left cyan glow */}
                <div
                    className="absolute -left-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(0,240,216,0.4) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                {/* Right violet glow */}
                <div
                    className="absolute -right-32 top-1/3 w-[500px] h-[500px] rounded-full opacity-15"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(124,76,255,0.4) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            {/* Content container - compact layout */}
            <div className="container mx-auto px-6 lg:px-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Visual - centered, no negative margins */}
                    <div className="flex items-center justify-center order-2 lg:order-1">
                        <LaunchVisual className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px]" />
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 lg:order-2">
                        <h2 id="launch-heading" className="sr-only">
                            Take control of your trajectory
                        </h2>
                        <LaunchContent
                            onGetStarted={handleGetStarted}
                            onSeeDemo={handleSeeDemo}
                        />
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
