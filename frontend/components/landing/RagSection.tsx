// Dev: run 'npm i matter-js uuid'
// NOTE: respects prefers-reduced-motion
/**
 * RagSection - RAG Intelligence showcase
 * Interactive physics-based demo with fallback to static grid
 */
"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import RagLegend from "./RagLegend";
import RagBlockCard from "./RagBlockCard";

// Lazy-load physics canvas to avoid SSR issues
const RagPhysicsCanvas = dynamic(() => import("./RagPhysicsCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex items-center justify-center bg-[rgba(0,0,0,0.2)]">
      <div className="text-white/50 text-sm">Loading interactive demo...</div>
    </div>
  ),
});

// Static fallback blocks for reduced motion
const STATIC_BLOCKS = [
  {
    id: "r1",
    title: "Missing Projects",
    brief: "You have few public projects.",
    detail:
      "Build 2–3 end-to-end projects that show ownership, architecture, and deployment. Include READMEs and demos.",
    tag: "projects",
  },
  {
    id: "r2",
    title: "Weak GitHub",
    brief: "Polish repos & READMEs.",
    detail:
      "Add tests, CI, and focused repos that demonstrate depth instead of breadth.",
    tag: "github",
  },
  {
    id: "r3",
    title: "Resume Format",
    brief: "Make GitHub visible & highlight impact.",
    detail:
      "Use concise bullets, metrics, and a visible GitHub link near top of resume.",
    tag: "resume",
  },
  {
    id: "r4",
    title: "Interview Prep",
    brief: "Timed practice & system design.",
    detail:
      "Combine timed LeetCode practice with weekly system design sketches for 30–60 minutes.",
    tag: "interview",
  },
  {
    id: "r5",
    title: "Project Documentation",
    brief: "Add comprehensive README files.",
    detail:
      "Include setup instructions, architecture diagrams, and demo screenshots in your project READMEs.",
    tag: "projects",
  },
  {
    id: "r6",
    title: "Code Quality",
    brief: "Add linting and tests.",
    detail:
      "Show code quality through automated tests, linting, and consistent coding standards.",
    tag: "github",
  },
  {
    id: "r7",
    title: "Resume Metrics",
    brief: "Quantify your impact.",
    detail:
      "Use numbers to show scale: users served, performance improvements, cost savings.",
    tag: "resume",
  },
  {
    id: "r8",
    title: "Behavioral Practice",
    brief: "Prepare STAR stories.",
    detail:
      "Prepare 5-7 stories using the STAR method for common behavioral questions.",
    tag: "interview",
  },
];

export default function RagSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [typedText, setTypedText] = useState("");
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const fullText = "Not Just Another LLM.";

  // Typing animation effect - starts when title is in view
  useEffect(() => {
    if (!titleRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedTyping) {
          setHasStartedTyping(true);
          // Add delay before starting typing
          setTimeout(() => {
            let index = 0;
            const timer = setInterval(() => {
              if (index <= fullText.length) {
                setTypedText(fullText.slice(0, index));
                index++;
              } else {
                clearInterval(timer);
              }
            }, 80);
          }, 600); // 600ms delay before typing starts
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(titleRef.current);

    return () => observer.disconnect();
  }, [hasStartedTyping]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
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
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="rag" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        {/* Centered Title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            RAG Intelligence
          </h2>
          <div className="h-1 w-20 bg-accent2 rounded-full mx-auto mb-6" />
          <p
            className="text-2xl md:text-3xl font-bold tracking-wide min-h-[3rem]"
          >
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={
                typedText === fullText
                  ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                  : { backgroundPosition: "0% 50%" }
              }
              transition={{ duration: 3, delay: 0.2, repeat: Infinity, repeatDelay: 4 }}
              className="bg-gradient-to-r from-white/90 via-accent2 to-white/90 bg-clip-text text-transparent bg-[length:200%_100%] transition-all duration-1000"
              style={{
                filter:
                  typedText.length > 0
                    ? "drop-shadow(0 0 20px rgba(124,76,255,0.3))"
                    : "none",
              }}
            >
              {typedText}
            </motion.span>
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 items-start">
          {/* Left: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4 text-white/70 text-base leading-relaxed">
              <p>
                Axion is{" "}
                <span className="text-accent1 font-semibold">
                  retrieval-augmented
                </span>
                : we ground every recommendation in real data. This reduces
                hallucination and gives you actionable, explainable next steps.
              </p>

              <p>
                Unlike generic LLMs that generate advice from thin air, our RAG
                architecture queries a curated knowledge base stored in{" "}
                <span className="text-accent2 font-semibold">Supabase</span> —
                containing 20,000+ verified career signals, project templates,
                resume patterns, and interview strategies.
              </p>

              <p>Every time you interact with Axion, we:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Retrieve the most relevant signals from our vector database
                </li>
                <li>Combine your profile context with proven patterns</li>
                <li>Generate personalized, evidence-backed recommendations</li>
                <li>
                  Cite sources so you know exactly why we suggest each action
                </li>
              </ul>

              <p className="text-white/90 font-medium pt-4">
                The result? Advice you can trust, backed by real data from
                thousands of successful engineers.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent1/10 border border-accent1/50 shadow-[0_0_20px_rgba(0,240,216,0.2)] transition-all duration-300 hover:bg-accent2/10 hover:border-accent2/50 hover:shadow-[0_0_20px_rgba(124,76,255,0.3)] cursor-pointer group">
              <span className="text-accent1 font-bold text-sm group-hover:text-accent2 transition-colors duration-300">
                Backed by 20,000+ curated signal entries in Supabase
              </span>
            </div>
          </motion.div>

          {/* Right: Interactive Physics Canvas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            {prefersReducedMotion ? (
              // Static grid fallback for reduced motion
              <div className="p-6 h-[800px] overflow-y-auto">
                <motion.div
                  variants={gridVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 gap-4"
                >
                  {STATIC_BLOCKS.map((block) => (
                    <motion.div key={block.id} variants={itemVariants}>
                      <RagBlockCard
                        id={block.id}
                        title={block.title}
                        brief={block.brief}
                        detail={block.detail}
                        tag={block.tag}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              // Physics canvas for standard motion
              <RagPhysicsCanvas />
            )}
          </motion.div>
        </div>
      </div>

      {/* Legend */}
      <div className="container mx-auto px-6 py-8">
        <RagLegend />
      </div>
    </section>
  );
}
