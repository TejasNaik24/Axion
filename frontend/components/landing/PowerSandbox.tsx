// NOTE: respects prefers-reduced-motion
/**
 * PowerSandbox - Interactive sandbox showing example signals
 * Blocks can be hovered and clicked to expand details
 */
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// TODO: Replace mock blocks with retriever.getRelevantDocs(state, topK=4)
const MOCK_BLOCKS = [
  {
    id: "b1",
    title: "Missing Projects",
    brief: "You have few public projects.",
    detail:
      "Build 2–3 end-to-end projects that show ownership, architecture, and deployment. Include READMEs and project demos.",
    cta: "Learn more →",
    glowColor: "accent1",
  },
  {
    id: "b2",
    title: "Weak GitHub",
    brief: "Add READMEs and tests.",
    detail:
      "Polish repos: add clear READMEs, CI badges, and focused commits to showcase depth.",
    cta: "Learn more →",
    glowColor: "accent2",
  },
  {
    id: "b3",
    title: "Resume Format",
    brief: "Use a clear CS resume template.",
    detail:
      "Use LaTeX/Overleaf or concise Google Docs with bolded project metrics and a visible GitHub link.",
    cta: "See template →",
    glowColor: "accent2",
  },
  {
    id: "b4",
    title: "Interview Prep",
    brief: "Practice system design & timed coding.",
    detail:
      "Prioritize system design for roles targeting backend/opportunity systems; practice timed problems weekly.",
    cta: "Start practice →",
    glowColor: "accent1",
  },
];

export default function PowerSandbox() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const blockVariants = {
    hidden: { y: -40, opacity: 0, rotate: -6 },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 15,
      },
    },
  };

  const hoverVariants = prefersReducedMotion
    ? {}
    : {
      y: -6,
      rotate: 1,
    };

  const handleToggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle(id);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-white mb-2">
          Interactive Sandbox (signals you'll see)
        </h3>
        <p className="text-white/60 text-sm leading-relaxed">
          These blocks show example signals Axion retrieves.
        </p>
      </div>

      {/* Blocks Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
      >
        {MOCK_BLOCKS.map((block) => (
          <div key={block.id} className="relative">
            <motion.div
              variants={blockVariants}
              whileHover={hoverVariants}
              whileTap={{ scale: 0.98 }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleToggle(block.id)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                aria-expanded={expandedIds.has(block.id)}
                aria-controls={`detail-${block.id}`}
                className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-white/8 backdrop-blur-lg p-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent2 transition-all flex flex-col"
                style={{
                  boxShadow:
                    block.glowColor === "accent1"
                      ? "0 0 20px rgba(0,240,216,0.3), 0 0 40px rgba(0,240,216,0.15)"
                      : "0 0 20px rgba(124,76,255,0.3), 0 0 40px rgba(124,76,255,0.15)",
                  animation: `borderGlow${block.glowColor === "accent1" ? "Green" : "Purple"
                    } 3s ease-in-out infinite`,
                }}
              >
                <style jsx>{`
                  @keyframes borderGlowGreen {
                    0%,
                    100% {
                      box-shadow: 0 0 20px rgba(0, 240, 216, 0.4),
                        0 0 40px rgba(0, 240, 216, 0.2);
                    }
                    50% {
                      box-shadow: 0 0 30px rgba(0, 240, 216, 0.6),
                        0 0 60px rgba(0, 240, 216, 0.3);
                    }
                  }
                  @keyframes borderGlowPurple {
                    0%,
                    100% {
                      box-shadow: 0 0 20px rgba(124, 76, 255, 0.4),
                        0 0 40px rgba(124, 76, 255, 0.2);
                    }
                    50% {
                      box-shadow: 0 0 30px rgba(124, 76, 255, 0.6),
                        0 0 60px rgba(124, 76, 255, 0.3);
                    }
                  }
                `}</style>
                {/* Title & Brief */}
                <h4 className="text-lg font-semibold text-white mb-2">
                  {block.title}
                </h4>
                <p className="text-white/70 text-sm flex-grow">{block.brief}</p>

                {/* Expand indicator */}
                <div className={`mt-4 text-xs font-medium ${(block.id === 'b2' || block.id === 'b3')
                  ? (expandedIds.has(block.id) ? 'text-accent1' : 'text-accent2')
                  : (expandedIds.has(block.id) ? 'text-accent2' : 'text-accent1')
                  }`}>
                  {expandedIds.has(block.id) ? "Collapse ↑" : "Expand ↓"}
                </div>

                {/* Expanded Detail - Inside the card */}
                <AnimatePresence>
                  {expandedIds.has(block.id) && (
                    <motion.div
                      id={`detail-${block.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                      aria-live="polite"
                    >
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-white/80 text-sm leading-relaxed">
                          {block.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
