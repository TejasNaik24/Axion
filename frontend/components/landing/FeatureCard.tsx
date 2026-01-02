// NOTE: respects prefers-reduced-motion
/**
 * FeatureCard - Reusable feature card component
 * Shows icon, title, and description with hover effects
 */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  accentColor?: "accent1" | "accent2";
}

export default function FeatureCard({
  icon,
  title,
  description,
  index,
  accentColor = "accent1",
}: FeatureCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const isPurple = accentColor === "accent2";

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 140,
        damping: 18,
      },
    },
  };

  const hoverVariants = prefersReducedMotion
    ? {}
    : {
        scale: 1.02,
        boxShadow: isPurple
          ? "0 8px 30px rgba(124, 76, 255, 0.15), 0 0 0 1px rgba(124, 76, 255, 0.25)"
          : "0 8px 30px rgba(0, 240, 216, 0.15), 0 0 0 1px rgba(0, 240, 216, 0.25)",
      };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hoverVariants}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="group rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/6 backdrop-blur-lg p-6 cursor-default"
    >
      {/* Icon container */}
      <div
        className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/8 transition-all duration-300 ${
          isPurple
            ? "group-hover:border-accent2/30"
            : "group-hover:border-accent1/30"
        }`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={`text-lg font-semibold mb-2 text-white transition-colors duration-300 ${
          isPurple ? "group-hover:text-accent2" : "group-hover:text-accent1"
        }`}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
