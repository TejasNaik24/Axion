"use client";
import React, { useState, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

/**
 * DemoSandbox - Animated signal blocks demonstrating Axion's insights
 * 
 * Features:
 * - 4 signal blocks with staggered "falling" entrance animation
 * - Spring-based physics: stiffness 140, damping 20, stagger 0.08s
 * - Hover: scale 1.02 + neon glow
 * - Click/Enter: expand inline panel with extra context
 * - Full keyboard accessibility: Enter/Space toggles, aria-expanded
 * - Respects reduced motion preferences
 */

// Mock data representing example signals Axion retrieves
const blocks = [
    {
        id: "b1",
        title: "Missing Projects",
        text: "You have few public projects — build 2 end-to-end projects that show ownership.",
        icon: "📁",
        color: "accent1",
    },
    {
        id: "b2",
        title: "Weak GitHub",
        text: "Add READMEs and polished repos; show tests & CI.",
        icon: "🐙",
        color: "accent2",
    },
    {
        id: "b3",
        title: "Resume Format",
        text: "Use a clear CS resume template and show GitHub link high.",
        icon: "📄",
        color: "accent1",
    },
    {
        id: "b4",
        title: "Interview Prep",
        text: "Practice system design + timed coding to improve interview outcomes.",
        icon: "🎯",
        color: "accent2",
    },
];

interface SignalBlockProps {
    block: (typeof blocks)[0];
    index: number;
    prefersReducedMotion: boolean | null;
}

function SignalBlock({ block, index, prefersReducedMotion }: SignalBlockProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const panelId = `panel-${block.id}`;

    const handleToggle = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggle();
            }
        },
        [handleToggle]
    );

    // Staggered entrance animation - "falling" effect
    const cardVariants = {
        initial: prefersReducedMotion
            ? { opacity: 0 }
            : { y: -40, opacity: 0, rotate: -6 },
        animate: prefersReducedMotion
            ? { opacity: 1 }
            : { y: 0, opacity: 1, rotate: 0 },
    };

    const transition = prefersReducedMotion
        ? { duration: 0 }
        : {
            type: "spring" as const,
            stiffness: 140,
            damping: 20,
            delay: index * 0.08,
        };

    // Hover animation
    const hoverAnimation = prefersReducedMotion
        ? {}
        : {
            scale: 1.02,
            boxShadow:
                block.color === "accent1"
                    ? "0 8px 40px rgba(0, 240, 216, 0.15), inset 0 0 0 1px rgba(0, 240, 216, 0.3)"
                    : "0 8px 40px rgba(124, 76, 255, 0.15), inset 0 0 0 1px rgba(124, 76, 255, 0.3)",
        };

    const tapAnimation = prefersReducedMotion ? {} : { scale: 0.98 };

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
            whileHover={hoverAnimation}
            whileTap={tapAnimation}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls={panelId}
            className="relative p-5 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/[0.06] backdrop-blur-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent1 focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors group"
        >
            {/* Header row */}
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${block.color === "accent1"
                        ? "bg-accent1/10 border border-accent1/20"
                        : "bg-accent2/10 border border-accent2/20"
                        } group-hover:scale-110 transition-transform`}
                >
                    {block.icon}
                </div>

                {/* Title and preview */}
                <div className="flex-1 min-w-0">
                    <h4
                        className={`font-semibold text-white group-hover:${block.color === "accent1" ? "text-accent1" : "text-accent2"
                            } transition-colors mb-1`}
                    >
                        {block.title}
                    </h4>
                    <p className="text-white/50 text-sm line-clamp-1">{block.text}</p>
                </div>

                {/* Expand indicator */}
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/40 group-hover:text-white/60 transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </motion.div>
            </div>

            {/* Expandable panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 mt-4 border-t border-white/5">
                            <p className="text-white/70 text-sm leading-relaxed mb-3">
                                {block.text}
                            </p>
                            <a
                                href="#"
                                className={`text-sm font-medium ${block.color === "accent1" ? "text-accent1" : "text-accent2"
                                    } hover:underline focus:outline-none focus-visible:underline`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Learn more →
                            </a>
                            {/* Screen reader announcement */}
                            <span className="sr-only" aria-live="polite">
                                Block expanded
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle neon rim */}
            <div
                className={`absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                style={{
                    boxShadow:
                        block.color === "accent1"
                            ? "inset 0 0 0 1px rgba(0, 240, 216, 0.2)"
                            : "inset 0 0 0 1px rgba(124, 76, 255, 0.2)",
                }}
            />
        </motion.div>
    );
}

export default function DemoSandbox() {
    const prefersReducedMotion = useReducedMotion();

    // Animation for the header
    const fadeIn = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
    };

    const transition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }; // easeOut cubic bezier

    return (
        <div className="space-y-6">
            {/* Sandbox header */}
            <motion.div
                initial={fadeIn.initial}
                whileInView={fadeIn.animate}
                viewport={{ once: true }}
                transition={transition}
            >
                <h3 className="text-lg font-semibold text-white mb-2">
                    Interactive Sandbox{" "}
                    <span className="text-white/40 font-normal text-sm">(v1: visual demo)</span>
                </h3>
                <p className="text-white/50 text-sm">
                    These blocks represent example signals Axion retrieves — hover to
                    inspect, click to expand for context.
                </p>
            </motion.div>

            {/* Signal blocks grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blocks.map((block, index) => (
                    <SignalBlock
                        key={block.id}
                        block={block}
                        index={index}
                        prefersReducedMotion={prefersReducedMotion}
                    />
                ))}
            </div>
        </div>
    );
}
