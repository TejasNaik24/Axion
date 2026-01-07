/**
 * LaunchVisualPlaceholder Component
 *
 * Purpose: Lightweight placeholder shown while LaunchVisual is loading
 * - Static gradient + orb image
 * - Minimal bundle size
 *
 * SSR: Safe - static content only
 */

import React from "react";

export default function LaunchVisualPlaceholder() {
    return (
        <div
            className="relative w-[420px] h-[420px] flex items-center justify-center"
            aria-hidden="true"
        >
            {/* Static ring placeholder */}
            <div
                className="absolute inset-0 rounded-full border-2 border-white/10"
                style={{
                    background:
                        "radial-gradient(circle at 30% 30%, rgba(0,240,216,0.08), rgba(124,76,255,0.08) 70%, transparent 100%)",
                }}
            />

            {/* Static orb placeholder */}
            <div
                className="w-32 h-32 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2), rgba(0,240,216,0.15) 50%, rgba(124,76,255,0.15) 100%)",
                    boxShadow:
                        "0 0 40px rgba(0,240,216,0.2), 0 0 80px rgba(124,76,255,0.15)",
                }}
            />
        </div>
    );
}
