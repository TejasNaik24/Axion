/**
 * WelcomeIntro Orchestrator
 *
 * Purpose: Manages the cinematic "Welcome to Axion" onboarding sequence.
 * - Coordinates timing between GhostWords entries and OrbPulseLoader pulses.
 * - Handles the final fade-out and navigation to the main app.
 *
 * Timeline (approx):
 * 0ms: Mount
 * 350ms: Orb entry
 * 420ms: Word 1 "Welcome" + Pulse
 * 960ms: Word 2 "to" + Pulse
 * 1500ms: Word 3 "Axion" + Pulse
 * +900ms: Hold
 * +420ms: Fade out
 * -> Redirect
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAnimation, motion, useReducedMotion } from "framer-motion";
import GhostWords from "./GhostWords";
import OrbPulseLoader, { OrbPulseHandle } from "./OrbPulseLoader";

interface WelcomeIntroProps {
    nextRoute?: string;
    words?: string[];
}

export default function WelcomeIntro({
    nextRoute = "/chat", // Default to /chat as requested
    words = ["Welcome", "to", "Axion"],
}: WelcomeIntroProps) {
    const router = useRouter();
    const orbRef = useRef<OrbPulseHandle>(null);
    const shouldReduceMotion = useReducedMotion();
    const wordControls = useAnimation();
    const containerControls = useAnimation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const runSequence = async () => {
            // 1. Initial State: Orb hidden or just glow (handled by initial prop)
            // Wait for "Login UI fade away" simulation (1s delay)
            await new Promise((r) => setTimeout(r, 1000));

            // 2. Orb Appears in Center (Ghostly Blur Entrance)
            if (!shouldReduceMotion && orbRef.current) {
                orbRef.current.entranceControls.start({
                    opacity: 1,
                    filter: "blur(0px)",
                    scale: 1,
                    transition: { duration: 0.7, ease: "easeOut" } // Faster entrance
                });
            }

            // 3. Orb hovers alone (Extended to 1.2s for deliberate presence)
            await new Promise((r) => setTimeout(r, 1200));

            // 4. Orb Moves Right & Text Appears (Clear one-by-one flow)
            if (!shouldReduceMotion) {
                // Move orb to the right to clear centered text
                orbMoveControls.start({ x: 280, transition: { duration: 0.5, ease: "easeOut" } });

                // Show words slightly after move starts to create leading effect
                // Increased to 800ms per feedback
                setTimeout(() => wordControls.start("visible"), 800);
            } else {
                wordControls.start("visible");
            }

            // 5. Wait for sequence to complete & Fade Out
            // Stagger is 0.18s.
            const totalAnimationTime = words.length * 180 + 2800;

            await new Promise((r) => setTimeout(r, totalAnimationTime));

            // 6. Fade Out Sequence
            await containerControls.start({
                opacity: 0,
                filter: "blur(14px)",
                scale: 0.96,
                transition: { duration: 0.8, ease: "easeInOut" },
            });

            // 7. Navigate
            router.replace(nextRoute);
        };

        if (shouldReduceMotion) {
            setTimeout(() => router.replace(nextRoute), 2000);
        } else {
            runSequence();
        }
    }, [router, nextRoute, shouldReduceMotion, wordControls, containerControls, words.length]);

    const handleWordEntry = (index: number) => {
        // Pulse orb when each word STARTS appearing (or slightly after)
        // Adjust timing if needed to match the visual "pop"
        if (orbRef.current && !shouldReduceMotion) {
            orbRef.current.pulse();
        }
    };

    const orbMoveControls = useAnimation();

    if (!mounted) return null;

    return (
        <div
            className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-[#05060a]"
        >
            {/* Final Exit Transition Layer */}
            <motion.div
                animate={containerControls}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
                {/* Background gradient layers (Matched exactly to AuthLayout.tsx but static) */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    {/* Radial gradient: cyan → violet */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background:
                                "radial-gradient(circle at 30% 20%, rgba(0, 240, 216, 0.12), transparent 50%), radial-gradient(circle at 70% 80%, rgba(124, 76, 255, 0.12), transparent 50%)",
                        }}
                    />

                    {/* Noise overlay for texture */}
                    <div
                        className="absolute inset-0 opacity-[0.015]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Vignette */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(circle at center, transparent 20%, rgba(5, 6, 10, 0.8) 100%)",
                        }}
                    />

                    {/* Neon Glows (Exact positions and colors from AuthLayout, but static) */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full flex items-center justify-center pointer-events-none"
                        style={{ zIndex: -1 }}
                    >
                        {/* Top-right Purple Glow */}
                        <div
                            className="absolute -top-20 -right-20 w-[650px] h-[650px] bg-[#7c4cff] blur-[120px] opacity-85 mix-blend-screen"
                            style={{ transform: "translateZ(0)" }}
                        />
                        {/* Bottom-left Cyan Glow */}
                        <div
                            className="absolute -bottom-20 -left-20 w-[700px] h-[700px] bg-[#00f0d8] blur-[120px] opacity-65 mix-blend-screen"
                            style={{ transform: "translateZ(0)" }}
                        />
                    </div>
                </div>

                {/* Main Stage Content */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">

                    {/* Ghost Words - ABSOLUTE CENTERED */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-row flex-nowrap min-w-max pointer-events-none">
                        <GhostWords
                            words={words}
                            animate={wordControls}
                            onWord={handleWordEntry}
                        />
                    </div>

                    {/* Orb Container - Starts Absolute Center, Moves Right */}
                    <motion.div
                        animate={orbMoveControls}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                    >
                        <OrbPulseLoader ref={orbRef} />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
