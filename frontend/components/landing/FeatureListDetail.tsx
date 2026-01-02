// NOTE: respects prefers-reduced-motion
/**
 * FeatureListDetail - Technical bullets sidebar
 * Shows short technical highlights for engineers
 */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const TECHNICAL_BULLETS = [
  "Stateful agent with compact user state",
  "RAG pipeline with vector retrieval",
  "Question selection via entropy reduction",
  "Prescriptive action plan generator",
  "Explainable recommendation engine",
  "Curated resource library (10k+ examples)",
];

export default function FeatureListDetail() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: "easeOut" as const,
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/6 backdrop-blur-lg p-6 lg:sticky lg:top-24"
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        Technical Highlights
      </h3>
      <ul className="space-y-3">
        {TECHNICAL_BULLETS.map((bullet, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className="flex items-start gap-3 text-white/70 text-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent1 mt-1.5 flex-shrink-0" />
            <span>{bullet}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Panel */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <button
          className="w-full px-5 py-3 rounded-xl bg-white text-bg font-semibold text-sm hover:scale-105 transition-transform mb-3"
          onClick={() => {
            // TODO: Connect 'Try it' CTA to actual resume upload Flow
            console.log("Try it clicked");
          }}
        >
          Try it (Upload Resume)
        </button>
        <a
          href="#how-it-works"
          className="block text-center text-accent1 text-sm hover:underline"
        >
          See full features
        </a>
      </div>
    </motion.div>
  );
}
