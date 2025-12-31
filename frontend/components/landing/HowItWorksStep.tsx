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

  const cardVariants = {
    hidden: { y: 18, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 160,
        damping: 18,
        delay: prefersReducedMotion ? 0 : index * 0.15,
      },
    },
  };

  const hoverVariants = prefersReducedMotion
    ? {}
    : {
        y: -4,
        scale: 1.02,
        borderColor: "rgba(0, 240, 216, 0.3)",
        boxShadow:
          "0 8px 30px rgba(0, 240, 216, 0.12), 0 0 0 1px rgba(0, 240, 216, 0.2)",
      };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hoverVariants}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="group rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/6 backdrop-blur-lg p-6 md:p-8 cursor-default"
    >
      {/* Icon container */}
      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/8 group-hover:border-accent1/30 transition-all duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white group-hover:text-accent1 transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-white/60 leading-relaxed">{description}</p>
    </motion.div>
  );
}
