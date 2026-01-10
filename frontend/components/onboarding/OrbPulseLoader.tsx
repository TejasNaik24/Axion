/**
 * OrbPulseLoader Component
 *
 * Purpose: Light wrapper around the heavy AxionOrb that adds a "pulse" animation capability.
 * used specifically for the onboarding sequence to sync visual pops with text.
 *
 * Features:
 * - Dynamically imports AxionOrb (no SSR)
 * - Exposes a `pulse()` method via ref to trigger a scale/glow effect
 * - Renders a background glow overlay that intensifies on pulse
 */

"use client";

import React, {
    useRef,
    useState,
    useImperativeHandle,
    forwardRef,
} from "react";
import dynamic from "next/dynamic";
import { motion, useAnimation } from "framer-motion";

// Dynamic import with no SSR to avoid window/canvas issues
const AxionOrb = dynamic(() => import("../landing/AxionOrb"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse" />
        </div>
    ),
});

export interface OrbPulseHandle {
    pulse: () => Promise<void>;
}

const OrbPulseLoader = forwardRef<OrbPulseHandle, {}>((props, ref) => {
    const controls = useAnimation();
    const [glowIntensity, setGlowIntensity] = useState(0.4);

    useImperativeHandle(ref, () => ({
        pulse: async () => {
            // 1. (Removed scale hop per feedback)
            // Just glow flash

            // 2. Glow flash
            setGlowIntensity(1.2);
            setTimeout(() => setGlowIntensity(0.4), 350);
        },
    }));

    return (
        <div className="relative flex items-center justify-center">
            {/* Background Pulse Glow - Adjusted Size for Small Orb */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 will-change-opacity transform-gpu"
                style={{
                    background:
                        "radial-gradient(circle at center, rgba(124, 76, 255, 0.4) 0%, transparent 60%)",
                    opacity: glowIntensity,
                    filter: "blur(48px)",
                    transform: "scale(1.2)",
                    zIndex: 0,
                    width: "100%",
                    height: "100%",
                }}
            />

            {/* Orb Container with Motion - Adjusted Size (~144px) */}
            <motion.div
                animate={controls}
                initial={{ opacity: 0 }}
                whileInView={{
                    opacity: 1,
                    transition: { duration: 0.8, ease: "easeOut" },
                }}
                className="relative z-10 w-36 h-36 flex items-center justify-center"
            >
                <AxionOrb className="w-full h-full" />
            </motion.div>
        </div>
    );
});

OrbPulseLoader.displayName = "OrbPulseLoader";

export default OrbPulseLoader;
