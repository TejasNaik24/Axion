// NOTE: respects prefers-reduced-motion
/**
 * HowItWorksStep - Reusable step card component
 * Shows an icon, title, and description with hover animations
 */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface HowItWorksStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

export default function HowItWorksStep({
  icon,
  title,
  description,
  index,
}: HowItWorksStepProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Alternate colors: index 1 and 3 use purple (accent2), others use teal (accent1)
  const usePurple = index === 1 || index === 3;
  const accentColor = usePurple
    ? "rgba(124, 76, 255, 0.3)"
    : "rgba(0, 240, 216, 0.3)";
  const accentColorFull = usePurple ? "var(--accent2)" : "var(--accent1)";

  const cardVariants = {
    hidden: { y: 18, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 160,
        damping: 18,
        delay: prefersReducedMotion ? 0 : index * 0.6,
      },
    },
  };

  const lineVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "3rem", // h-12
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        delay: prefersReducedMotion ? 0 : index * 0.6 + 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  const hoverVariants = prefersReducedMotion
    ? {}
    : {
        y: -4,
        scale: 1.02,
        borderColor: accentColor,
        boxShadow: usePurple
          ? "0 8px 30px rgba(124, 76, 255, 0.12), 0 0 0 1px rgba(124, 76, 255, 0.2)"
          : "0 8px 30px rgba(0, 240, 216, 0.12), 0 0 0 1px rgba(0, 240, 216, 0.2)",
      };

  return (
    <div className="relative">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        whileHover={hoverVariants}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        className="group rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/6 backdrop-blur-lg p-4 md:p-5 cursor-default"
      >
        {/* Icon container */}
        <div
          className={`w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/8 transition-all duration-300 ${
            usePurple
              ? "group-hover:border-accent2/30"
              : "group-hover:border-accent1/30"
          }`}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          className={`text-lg md:text-xl font-semibold mb-2 text-white transition-colors duration-300 ${
            usePurple ? "group-hover:text-accent2" : "group-hover:text-accent1"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      </motion.div>

      {/* Connecting line - shown for all steps except the last (index 3) */}
      {index < 3 && (
        <motion.div
          variants={lineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-1 bg-accent1/30 origin-top"
        />
      )}
    </div>
  );
}
