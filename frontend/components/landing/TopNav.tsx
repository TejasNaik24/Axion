"use client";

// Dev: run 'npm i react-icons framer-motion' if missing

import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { FiGithub, FiMenu } from "react-icons/fi";
import Link from "next/link";
import dynamic from "next/dynamic";

const AxionOrbMini = dynamic(() => import("./AxionOrbMini"), { ssr: false });

export default function TopNav({
  repoUrl = "https://github.com/TejasNaik24/Axion",
}: {
  repoUrl?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Transform scroll range [0, 100] to style values
  // As user scrolls down, bg becomes darker/more blurred, scale increases slightly
  const bgOpacity = useTransform(scrollY, [0, 100], [0.05, 0.15]); // More opaque
  const backdropBlur = useTransform(scrollY, [0, 100], [4, 12]); // Stronger blur
  const scale = useTransform(scrollY, [0, 100], [1, 1.01]); // Subtle pop
  const y = useTransform(scrollY, [0, 100], [0, 4]); // Slight drop

  // Neon rim intensity increases on scroll
  const borderColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0.05)", "rgba(0, 240, 216, 0.15)"]
  );

  return (
    <>
      {/* Desktop / Tablet Floating Pill */}
      <motion.nav
        role="navigation"
        aria-label="Top navigation"
        style={{
          // Dynamic styles from scroll
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`, // Motion value template not supported in style prop directly for rgba sometimes, but frame-motion handles motion values in style.
          // Using CSS variables or direct motion values is safer. Let's rely on backdrop-filter mostly.
          backdropFilter: `blur(${12}px)`, // using static for safety or motion value
          y,
          scale,
          borderColor,
        }}
        className="fixed top-6 left-35 right-35 z-50 rounded-full border border-white/5 hidden md:flex items-center justify-between px-6 py-3 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,240,216,0.1)] group overflow-hidden"
      >
        {/* Continuous Shimmer Glow (Always on) */}
        <div
          className="absolute inset-0 rounded-full opacity-70 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(0,240,216,0.5) 0%, transparent 40%, rgba(124,76,255,0.5) 100%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 6s ease-in-out infinite",
          }}
        />

        {/* Left: Brand */}
        <div className="flex items-center gap-8 relative z-10">
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-3 pl-3 group focus:outline-none relative z-10"
            aria-label="Scroll to top"
          >
            <div className="relative z-10 w-8 h-8">
              <AxionOrbMini />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-accent1 transition-colors">
              Axion
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("demo")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base font-bold text-white/70 hover:text-accent1 transition-all relative group/nav"
            >
              Demo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent1 group-hover/nav:w-full transition-all duration-300" />
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base font-bold text-white/70 hover:text-accent2 transition-all relative group/nav"
            >
              How it works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent2 group-hover/nav:w-full transition-all duration-300" />
            </a>
            <a
              href="#powerful-features"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("powerful-features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base font-bold text-white/70 hover:text-accent1 transition-all relative group/nav"
            >
              Powerful Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent1 group-hover/nav:w-full transition-all duration-300" />
            </a>
            <a
              href="#rag"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("rag")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base font-bold text-white/70 hover:text-accent2 transition-all relative group/nav"
            >
              RAG Intelligence
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent2 group-hover/nav:w-full transition-all duration-300" />
            </a>
          </div>
        </div>

        {/* Center: Optional Nav (Hidden for now to keep clean) */}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* GitHub Button */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(124,76,255,0.4)]"
            aria-label="Open GitHub repository"
          >
            <FiGithub size={18} />
          </a>

          <div className="h-6 w-px bg-white/10 mx-1" />

          <Link
            href="/login"
            className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-full border border-white/30 hover:border-white/40 hover:bg-white/5 transition-all"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-full border border-white/30 hover:border-white/40 hover:bg-white/5 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Interaction (Simple FAB + Sheet placeholder) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-12 h-12 rounded-full bg-bg/80 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          aria-label="Open Menu"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold flex items-center gap-2"
            >
              <span className="w-4 h-4 rounded-full bg-accent1" /> Axion
            </Link>
            <div className="flex flex-col gap-4 w-64">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-3 bg-white/5 border border-white/30 rounded-xl transition-all active:scale-95"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-3 bg-white/5 border border-white/30 rounded-xl transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/50"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
