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
import HeroLayout from "@/components/landing/HeroLayout";
import FloatingCard from "@/components/landing/FloatingCard";
import HowItWorks from "@/components/landing/HowItWorks";
import ParallaxBackground from "@/components/landing/ParallaxBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg overflow-x-hidden selection:bg-accent1/30 selection:text-white">
      {/* Fixed Background Layers */}
      <ParallaxBackground />

      <div className="relative z-10 flex flex-col gap-20 pb-20">
        {/* Section 1: Hero */}
        <HeroLayout />

        {/* Section 2: Capabilities Cards */}
        <section className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FloatingCard title="Adaptive Analysis" subtitle="Intelligence">
              Our neural engine maps your skills against 50,000+ career paths to
              find your optimal trajectory.
            </FloatingCard>
            <FloatingCard title="Signal Driven" subtitle="Real-time">
              Axion parses millions of market signals daily to ensure your
              advice is relevant to the current zeitgeist.
            </FloatingCard>
            <FloatingCard title="Curated Resources" subtitle="Growth">
              Don't waste time searching. Get a hyper-personalized feed of
              repos, papers, and courses.
            </FloatingCard>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <HowItWorks />

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-white/5 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="text-xs text-white/40 max-w-md text-center">
              Opinionated, engineer-first guidance — curated resources &
              signal-driven advice.
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
