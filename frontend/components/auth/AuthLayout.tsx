/**
 * AuthLayout Component
 *
 * Purpose: Provides a full-page layout for authentication screens with:
 * - Dark background with subtle radial gradients (cyan → violet)
 * - Volumetric glow effects behind the modal
 * - Lazy-loaded AxionOrbMini for visual branding
 * - Centered modal positioning with proper spacing
 *
 * SSR: Safe - contains dynamic import with ssr:false for the 3D orb
 */

"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";

// Lazy-load the 3D orb to avoid SSR issues and improve initial load
const AxionOrbMini = dynamic(
  () => import("@/components/landing/AxionOrbMini"),
  { ssr: false }
);

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      {/* Back/Home link - top-left of page */}
      <Link
        href="/"
        className="fixed top-4 left-32 z-50 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 rounded-md"
        aria-label="Go back to home"
      >
        <IoArrowBack className="w-4 h-4" />
        <span>Home</span>
      </Link>

      {/* Background gradient layers */}
      <div className="fixed inset-0 pointer-events-none">
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

        {/* Dynamic Neon Glows - Positioned to frame the modal card with maximum separation and intensity */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full flex items-center justify-center pointer-events-none"
          style={{ zIndex: -1 }}
        >
          {/* Top-right Purple Glow - Maximum intensity */}
          <div
            className="absolute -top-20 -right-20 w-[650px] h-[650px] bg-[#7c4cff] blur-[120px] opacity-85 mix-blend-screen"
            style={{ transform: "translateZ(0)" }}
          />
          {/* Bottom-left Cyan Glow - Maximum intensity */}
          <div
            className="absolute -bottom-20 -left-20 w-[700px] h-[700px] bg-[#00f0d8] blur-[120px] opacity-65 mix-blend-screen"
            style={{ transform: "translateZ(0)" }}
          />
        </div>
      </div>



      {/* Content container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
