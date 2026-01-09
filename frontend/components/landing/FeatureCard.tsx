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

  const glowColor = isPurple ? "rgba(124, 76, 255, 0.6)" : "rgba(0, 240, 216, 0.6)";
  const shadowPulse = isPurple
    ? "0 0 25px rgba(124, 76, 255, 0.3), inset 0 0 10px rgba(124, 76, 255, 0.2)"
    : "0 0 25px rgba(0, 240, 216, 0.3), inset 0 0 10px rgba(0, 240, 216, 0.2)";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hoverVariants}
      animate={
        prefersReducedMotion
          ? {}
          : {
            borderColor: [
              "rgba(255, 255, 255, 0.06)",
              glowColor,
              "rgba(255, 255, 255, 0.06)",
              "rgba(255, 255, 255, 0.06)",
            ],
            boxShadow: [
              "0 0 0 rgba(0,0,0,0)",
              shadowPulse,
              "0 0 0 rgba(0,0,0,0)",
              "0 0 0 rgba(0,0,0,0)",
            ],
            backgroundColor: [
              "rgba(255, 255, 255, 0.02)",
              isPurple ? "rgba(124, 76, 255, 0.04)" : "rgba(0, 240, 216, 0.04)",
              "rgba(255, 255, 255, 0.02)",
              "rgba(255, 255, 255, 0.02)",
            ],
          }
      }
      transition={{
        // Default spring for entrance
        type: "spring",
        stiffness: 140,
        damping: 18,
        // Specific settings for the breathing pulse loop
        borderColor: {
          duration: 6,
          times: [0, 0.15, 0.3, 1],
          delay: index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        boxShadow: {
          duration: 6,
          times: [0, 0.15, 0.3, 1],
          delay: index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        backgroundColor: {
          duration: 6,
          times: [0, 0.15, 0.3, 1],
          delay: index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className="group rounded-2xl bg-[rgba(255,255,255,0.02)] border border-white/6 backdrop-blur-lg p-6 cursor-default relative overflow-hidden"
    >
      {/* Icon container */}
      <div
        className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/8 transition-all duration-300 ${isPurple
            ? "group-hover:border-accent2/30"
            : "group-hover:border-accent1/30"
          }`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={`text-lg font-semibold mb-2 text-white transition-colors duration-300 ${isPurple ? "group-hover:text-accent2" : "group-hover:text-accent1"
          }`}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
