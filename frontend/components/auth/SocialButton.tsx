/**
 * SocialButton Component
 *
 * Purpose: Reusable button for social sign-in providers (Google, Microsoft, etc.)
 * Features:
 * - Pill-shaped dark button with icon on left
 * - Hover glow that matches provider (accent1 for Google, accent2 for Microsoft)
 * - Keyboard accessible with visible focus rings
 * - Respects reduced motion preferences
 *
 * SSR: Safe - uses CSS-based animations
 */

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";

interface SocialButtonProps {
  provider: "google" | "microsoft";
  icon: IconType;
  onClick?: () => void;
  isReflected?: boolean;
  action?: "sign-in" | "sign-up";
}

export default function SocialButton({
  provider,
  icon: Icon,
  onClick,
  isReflected,
  action = "sign-in",
}: SocialButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  // Choose accent color based on provider - Swapped as per user preference
  const accentColor = provider === "google" ? "#7c4cff" : "#00f0d8";
  const hoverShadow =
    provider === "google"
      ? "0 4px 20px rgba(124, 76, 255, 0.2)"
      : "0 4px 20px rgba(0, 240, 216, 0.2)";

  const actionText = action === "sign-up" ? "Sign up" : "Sign in";
  const providerName = provider === "google" ? "Google" : "Microsoft";
  const label = `${actionText} with ${providerName}`;

  return (
    <motion.button
      type="button"
      onClick={onClick || (() => console.log(`${provider} sign-in clicked`))}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
            scale: 1.01,
            transition: { duration: 0.2 },
          }
      }
      whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
      className="relative w-full h-10 rounded-md bg-white/3 border border-white/5 flex items-center justify-center gap-2 text-white font-medium text-[13px] transition-all duration-200 hover:bg-white/6 hover:border-white/15 focus:outline-none focus:ring-1 focus:ring-white/20 group overflow-hidden cursor-pointer"
      style={{
        ["--accent-color" as string]: accentColor,
      }}
      onMouseEnter={(e) => {
        if (!shouldReduceMotion) {
          e.currentTarget.style.boxShadow = hoverShadow;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
      aria-label={label}
    >
      {/* Icon */}
      <Icon className="w-5 h-5 shrink-0" />

      {/* Label */}
      <span className="whitespace-nowrap leading-none">{label}</span>

      {/* Reflection from main button (top edge glow) */}
      {isReflected && (
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent transition-opacity duration-300 opacity-100" />
      )}

      {/* Subtle rim glow on hover (pseudo-element approach) */}
      <div
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 12px ${accentColor}44, 0 0 16px ${accentColor}33`,
        }}
      />
    </motion.button>
  );
}
