/**
 * LoginModal Component
 *
 * Purpose: Main login modal UI with:
 * - Glass morphism card design
 * - Email input field
 * - Primary "LOG IN" button with animated travel glow on pointer move
 * - Social sign-in buttons (Google, Microsoft)
 * - Back/Home link at top
 * - Accessible form controls with proper labels
 *
 * SSR: Must be client component - uses pointer events, framer-motion, and DOM manipulation
 *
 * Why "use client":
 * - Uses onPointerMove for travel glow effect
 * - Uses Framer Motion for hover/tap animations
 * - Manipulates CSS custom properties via DOM
 */

"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

import AxionOrbMini from "@/components/landing/AxionOrbMini";
import GlowingButton from "@/components/landing/GlowingButton";
import SocialButton from "./SocialButton";
import styles from "@/styles/auth.module.css";

export default function LoginModal() {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "verification">("email");
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(true);
      return;
    }
    setError(false);
    // Transition to verification step
    setStep("verification");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit form on Enter
    if (e.key === "Enter") {
      // Handled by form onSubmit
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[480px]">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`${styles.modalContainer} relative rounded-2xl bg-[#12141c]/85 border border-white/6 backdrop-blur-xl px-8 pt-8 pb-24 w-full shadow-2xl`}
        style={{
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Project Icon - Brand Orb */}
        <div className="flex justify-start mb-1 relative z-20">
          <AxionOrbMini className="w-12 h-12" />
        </div>

        {/* Modal header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign in to Axion</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 w-full">
          {step === "email" ? (
            <>
              {/* Email field container - reserved space for error to prevent layout shift */}
              <div className="relative pb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value) setError(false);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="name@school-or-work.com"
                  className={`${styles.authInput} w-full px-4 py-3 rounded-lg text-base transition-colors duration-200 ${error ? "border-accent2 ring-1 ring-accent2/50" : ""
                    }`}
                  aria-label="Email address"
                  autoComplete="email"
                  autoFocus
                />
                {error && (
                  <p className="absolute bottom-0 left-0 text-xs text-accent2 font-medium">
                    Enter email address
                  </p>
                )}
              </div>

              {/* Primary button - GlowingButton with neon glow */}
              <GlowingButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full !rounded-full !h-11 font-bold tracking-wider text-[14px]"
                onMouseEnter={() => setIsLoginHovered(true)}
                onMouseLeave={() => setIsLoginHovered(false)}
              >
                LOG IN
              </GlowingButton>

              {/* Divider */}
              <div className="relative flex py-2 items-center mt-6">
                <div
                  className={`grow border-t transition-colors duration-300 ${isLoginHovered ? "border-white/30 shadow-[0_1px_8px_rgba(255,255,255,0.1)]" : "border-white/10"
                    }`}
                ></div>
                <span className={`shrink-0 mx-4 text-xs uppercase tracking-wider transition-colors duration-300 ${isLoginHovered ? "text-white/60" : "text-white/30"
                  }`}>
                  Or
                </span>
                <div
                  className={`grow border-t transition-colors duration-300 ${isLoginHovered ? "border-white/30 shadow-[0_1px_8px_rgba(255,255,255,0.1)]" : "border-white/10"
                    }`}
                ></div>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-4">
                <SocialButton provider="google" icon={FcGoogle} isReflected={isLoginHovered} />
                <SocialButton provider="microsoft" icon={FaMicrosoft} isReflected={isLoginHovered} />
              </div>
            </>
          ) : (
            /* Verification Step UI */
            <div className="flex flex-col w-full">
              <p className="text-white/60 text-sm mb-6">
                We've sent a code to <br />
                <span className="text-white font-medium">{email}</span>.
              </p>

              {/* 6-digit Input Grid (3-3 Split) */}
              <div className="flex items-center justify-center gap-4 mb-8 w-full">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const isCyan = i % 2 === 0;
                  const glowColor = isCyan ? "rgba(0, 240, 216, 0.8)" : "rgba(124, 76, 255, 0.8)";
                  const shadowColor = isCyan ? "rgba(0, 240, 216, 0.4)" : "rgba(124, 76, 255, 0.4)";

                  return (
                    <React.Fragment key={i}>
                      {i === 3 && (
                        <div className="text-white/20 text-2xl font-light shrink-0">–</div>
                      )}
                      <motion.input
                        type="text"
                        maxLength={1}
                        initial={{ borderColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                        animate={{
                          borderColor: ["rgba(255, 255, 255, 0.08)", glowColor, "rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                          boxShadow: ["0 0 0 rgba(0,0,0,0)", `0 0 20px ${shadowColor}`, "0 0 0 rgba(0,0,0,0)", "0 0 0 rgba(0,0,0,0)"]
                        }}
                        transition={{
                          duration: 5.5,
                          times: [0, 0.2, 0.4, 1], // Pulse localized within its window
                          delay: i * 0.4, // Slower staggered start but still overlapping
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`${styles.authInput} flex-none rounded-md text-center text-2xl font-bold bg-white/5 border-white/10 outline-none focus:border-white/20 transition-colors`}
                        style={{ width: '54px', height: '72px' }}
                      />
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Help Text Footer */}
              <div className="text-xs text-white/40">
                <p>
                  Haven't received the code?{" "}
                  <button type="button" className="text-white hover:underline">
                    Get a new code
                  </button>
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Aria live region */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      </motion.div>

      {/* Footer - Moved outside */}
      <div className="mt-12 text-center">
        <button
          disabled
          className="text-sm text-white/40 cursor-not-allowed hover:text-white/60 transition-colors"
          aria-label="Sign up - coming soon"
        >
          Don't have an account? <span className="text-white">Sign up</span>
        </button>
      </div>
    </div>
  );
}
