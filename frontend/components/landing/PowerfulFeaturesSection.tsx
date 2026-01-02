// NOTE: respects prefers-reduced-motion
/**
 * PowerfulFeaturesSection - Showcases Axion's capabilities
 * Includes feature grid and interactive sandbox
 */
"use client";
import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import PowerSandbox from "./PowerSandbox";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const FEATURES = [
  {
    title: "Adaptive Questioning",
    description:
      "Axion asks the next-best question to fill information gaps — no redundant prompts.",
    icon: (
      <svg
        className="w-6 h-6 text-accent1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Signal-Driven Diagnosis",
    description:
      "We identify missing signals (projects, GitHub, resume proof) and rank them by impact.",
    icon: (
      <svg
        className="w-6 h-6 text-accent2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "RAG-Powered Retrieval",
    description:
      "A retrieval-augmented layer pulls curated examples, tutorials, and repos relevant to your profile.",
    icon: (
      <svg
        className="w-6 h-6 text-accent1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    title: "Actionable Roadmaps",
    description:
      "Prioritized, step-by-step plans — projects to build, resume edits to make, resources to follow.",
    icon: (
      <svg
        className="w-6 h-6 text-accent2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    title: "Portfolio & Resume Triage",
    description:
      "Concrete changes to make your portfolio and resume recruiter-ready.",
    icon: (
      <svg
        className="w-6 h-6 text-accent1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Interview Readiness",
    description:
      "Targeted practice suggestions (timed coding, system design focus) matched to roles you want.",
    icon: (
      <svg
        className="w-6 h-6 text-accent2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Explainable Decisions",
    description:
      "Every recommendation includes a short rationale: why this matters for your profile.",
    icon: (
      <svg
        className="w-6 h-6 text-accent1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Curated Learning Paths",
    description:
      "Project templates and walkthroughs tailored to the skills recruiters value.",
    icon: (
      <svg
        className="w-6 h-6 text-accent2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
];

export default function PowerfulFeaturesSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
      },
    },
  };

  return (
    <section id="powerful-features" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Powerful features
          </h2>
          <div className="h-1 w-20 bg-accent1 rounded-full mx-auto mb-8" />
          <p className="text-white/60 text-lg md:text-xl leading-relaxed">
            What Axion can do — fast, actionable, and evidence-driven.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="space-y-12">
          {/* Feature cards grid */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
                accentColor={
                  feature.title === "Signal-Driven Diagnosis" ||
                  feature.title === "Actionable Roadmaps" ||
                  feature.title === "Interview Readiness" ||
                  feature.title === "Curated Learning Paths"
                    ? "accent2"
                    : "accent1"
                }
              />
            ))}
          </motion.div>

          {/* Interactive Sandbox */}
          <PowerSandbox />
        </div>
      </div>

      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(0, 240, 216, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(124, 76, 255, 0.05) 0%, transparent 50%)",
        }}
      />
    </section>
  );
}
