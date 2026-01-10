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

            // 2. Orb Appears in Center (Fades in)
            if (!shouldReduceMotion) {
                containerControls.start({ opacity: 1 });
            }

            // 3. Orb hovers alone (Balanced 0.8s)
            await new Promise((r) => setTimeout(r, 800));

            // 4. Orb Moves Right & Text Appears (Smoother transition)
            if (!shouldReduceMotion) {
                // Move orb to the right to clear centered text
                // Using 240px shift
                orbMoveControls.start({ x: 280, transition: { duration: 0.8, ease: "easeInOut" } });

                // Show words instantly
                wordControls.start("visible");
            } else {
                wordControls.start("visible");
            }

            // 5. Wait for sequence to complete & Fade Out
            // Stagger is 0.12s.
            const totalAnimationTime = words.length * 120 + 2000;

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
        <motion.div
            initial={{ opacity: 0 }} // Start hidden for fade-in effect
            animate={containerControls}
            className="relative flex items-center justify-center min-h-screen w-full overflow-hidden"
        >
            {/* Live Region for Screen Readers */}
            <div className="sr-only" role="status" aria-live="polite">
                {`Welcome to Axion — session ready.`}
            </div>

            {/* Main Stage Container */}
            <div className="relative w-full h-full flex items-center justify-center">

                {/* Ghost Words - ABSOLUTE CENTERED */}
                {/* translate-x-1/2 ensures it is truly centered on the point */}
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
    );
}
