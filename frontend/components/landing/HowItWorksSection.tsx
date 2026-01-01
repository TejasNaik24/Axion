// NOTE: respects prefers-reduced-motion
// NOTE: HowItWorksDiagram is lazy-loaded
/**
 * HowItWorksSection - Main section for the "How it works" landing content
 *
 * Layout:
 * - Desktop: Two columns (steps left, diagram right)
 * - Mobile: Stacked (steps, then diagram)
 *
 * Components:
 * - HowItWorksStep: User-facing flow cards
 * - HowItWorksDiagram: Interactive architecture diagram (lazy-loaded)
 * - HowItWorksDetails: Developer accordion with code snippets
 *
 * Commit: feat(landing): add How It Works section + architecture diagram + dev details
 */
"use client";
import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import HowItWorksStep from "./HowItWorksStep";
import HowItWorksDetails from "./HowItWorksDetails";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Lazy-load diagram to reduce initial bundle size
const HowItWorksDiagram = dynamic(() => import("./HowItWorksDiagram"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[2/1] rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/10 animate-pulse flex items-center justify-center">
      <div className="text-white/40 text-sm">Loading diagram...</div>
    </div>
  ),
});

const steps = [
  {
    title: "Intake",
    description:
      "Upload a resume or describe your background; Axion extracts signals and builds your profile.",
    icon: (
      <svg
        className="w-7 h-7 text-accent1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
  },
  {
    title: "Question Loop",
    description:
      "Adaptive follow-ups fill gaps — the agent asks only the next-best question.",
    icon: (
      <svg
        className="w-7 h-7 text-accent2"
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
    title: "Diagnosis",
    description:
      "Axion identifies missing signals (projects, GitHub, resume structure) and ranks issues by impact.",
    icon: (
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Action Plan",
    description:
      "Prioritized, concrete steps: projects to build, resume edits, and curated resources.",
    icon: (
      <svg
        className="w-7 h-7 text-accent1"
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
];

export default function HowItWorksSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);

  const handleDiagramClick = (region: string) => {
    // Map diagram regions to accordion panel IDs
    const regionToPanelMap: { [key: string]: string } = {
      intake: "profiler",
      parser: "userstate",
      retriever: "rag-flow",
      agents: "question-selection",
      guidance: "explainability",
    };
    const panelId = regionToPanelMap[region];
    if (panelId) {
      setOpenPanelId(panelId);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  return (
    <section id="how-it-works" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            How it works
          </h2>
          <div className="h-1 w-20 bg-accent1 rounded-full mx-auto mb-8" />
          <p className="text-white/60 text-lg md:text-xl leading-relaxed">
            Axion turns noisy backgrounds into clear next steps. Here's how the
            system reasons, retrieves, and prescribes—at a glance and under the
            hood.
          </p>
        </motion.div>

        {/* Two-column layout: Steps + Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left column: Step cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <HowItWorksStep
                key={step.title}
                icon={step.icon}
                title={step.title}
                description={step.description}
                index={index}
              />
            ))}
          </motion.div>

          {/* Right column: Architecture diagram */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: prefersReducedMotion ? 0 : 0.3,
            }}
            className="flex flex-col justify-center"
          >
            <div className="rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/6 backdrop-blur-lg p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-white mb-2">
                Under the hood
              </h3>
              <p className="text-white/60 mb-6 text-sm leading-relaxed">
                A retrieval-augmented agent combines stateful questioning,
                vector retrieval, and targeted prompts to produce reproducible,
                explainable advice.
              </p>
              <Suspense
                fallback={
                  <div className="w-full aspect-[2/1] rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/10 animate-pulse flex items-center justify-center">
                    <div className="text-white/40 text-sm">
                      Loading diagram...
                    </div>
                  </div>
                }
              >
                <HowItWorksDiagram onRegionClick={handleDiagramClick} />
              </Suspense>
            </div>

            {/* Architecture caption */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: prefersReducedMotion ? 0 : 0.5,
              }}
              className="text-white/50 text-sm mt-6 leading-relaxed"
            >
              Axion keeps a compact, updateable user state. The agent composes
              high-quality prompts using retrieved evidence and the current
              state, then asks follow-ups until it has a confident diagnosis.
              RAG supplies relevant examples and resources, while web search is
              used only as a fallback and is gated by trust rules.
            </motion.p>
          </motion.div>
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
