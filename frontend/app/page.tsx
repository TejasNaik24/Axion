/**
 * Axion Landing Page
 *
 * Setup:
 * 1. Ensure dependencies are installed: framer-motion, three, @react-three/fiber, @react-three/drei
 * 2. Run: npm run dev
 *
 * Features:
 * - Interactive 3D orb with parallax tracking
 * - Scroll-triggered card animations
 * - Parallax background layers
 * - Respects prefers-reduced-motion
 *
 * Commit: feat(landing): interactive hero + reactive orb + scroll animations
 */

"use client";
import React from "react";
import TopNav from "@/components/landing/TopNav";
import HeroLayout from "@/components/landing/HeroLayout";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ParallaxBackground from "@/components/landing/ParallaxBackground";
import DemoSection from "@/components/landing/DemoSection";
import PowerfulFeaturesSection from "@/components/landing/PowerfulFeaturesSection";
import RagSection from "@/components/landing/RagSection";
import LaunchSection from "@/components/landing/LaunchSection";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg overflow-x-hidden selection:bg-accent1/30 selection:text-white">
      <TopNav />
      {/* Fixed Background Layers */}
      <ParallaxBackground />

      <div className="relative z-10 flex flex-col gap-20 pb-20">
        {/* Section 1: Hero */}
        <HeroLayout />

        {/* Section 2: Demo (immediately after hero) */}
        <DemoSection />

        {/* Section 3: How It Works */}
        <HowItWorksSection />

        {/* Section 4: Powerful Features */}
        <PowerfulFeaturesSection />

        {/* Section 5: RAG Intelligence */}
        <RagSection />

        {/* Section 6: Launch / Get Started */}
        <LaunchSection />
        <footer className="container mx-auto px-6 py-12 border-t border-white/5 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="text-xs text-white/40 text-center">
              Opinionated, engineer-first guidance — curated resources &
              signal-driven advice.
            </div>
            <div className="hidden md:block h-4 w-px bg-white/20" />
            <a
              href="https://github.com/TejasNaik24/Axion"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(0,240,216,0.4)]"
              aria-label="GitHub repository"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <div className="hidden md:block h-4 w-px bg-white/20" />
            <div className="text-xs text-white/30 text-center">
              Copyright © 2025 Axion. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
