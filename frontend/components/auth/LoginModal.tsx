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
import { FaGoogle, FaMicrosoft } from "react-icons/fa6";

import AxionOrbMini from "@/components/landing/AxionOrbMini";
import GlowingButton from "@/components/landing/GlowingButton";
import SocialButton from "./SocialButton";
import styles from "@/styles/auth.module.css";

export default function LoginModal() {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "verification">("email");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-focus first OTP box when entering verification step
  useEffect(() => {
    if (step === "verification") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value && element.value !== "") return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Advance to next box if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous box on backspace if current box is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .substring(0, 6);
    if (!data) return;

    const newOtp = [...otp];
    data.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled box or next empty one
    const nextIndex = Math.min(data.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Enter email address");
      return;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter valid email address");
      return;
    }

    setError(null);
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
        initial={
          shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 10 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`${styles.modalContainer} relative rounded-2xl bg-[#08090f]/95 border border-white/12 backdrop-blur-2xl px-8 pt-8 pb-24 w-full shadow-2xl overflow-hidden`}
        style={{
          boxShadow:
            "0 20px 80px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          background:
            "radial-gradient(circle at 100% 0%, rgba(124, 76, 255, 0.35), transparent 50%), radial-gradient(circle at 0% 100%, rgba(0, 240, 216, 0.25), transparent 40%), #08090f",
        }}
      >
        {/* Corner Light Bleeds - Top-right Purple & Bottom-left Cyan (High intensity) */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#7c4cff] blur-[70px] opacity-55 pointer-events-none mix-blend-plus-lighter" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00f0d8] blur-[70px] opacity-45 pointer-events-none mix-blend-plus-lighter" />
        {/* Project Icon - Brand Orb */}
        <div className="flex justify-start mb-1 relative z-20">
          <AxionOrbMini className="w-12 h-12" />
        </div>

        {/* Modal header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Sign in to Axion
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="relative z-10 w-full">
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
                    if (e.target.value) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="name@school-or-work.com"
                  className={`${styles.authInput
                    } w-full px-4 py-3 rounded-lg text-base transition-colors duration-200 ${error ? "border-accent2 ring-1 ring-accent2/50" : ""
                    }`}
                  aria-label="Email address"
                  autoComplete="email"
                  autoFocus
                />
                {error && (
                  <p className="absolute bottom-0 left-0 text-xs text-accent2 font-medium">
                    {error}
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
                  className={`grow border-t transition-colors duration-300 ${isLoginHovered
                    ? "border-white/30 shadow-[0_1px_8px_rgba(255,255,255,0.1)]"
                    : "border-white/10"
                    }`}
                ></div>
                <span
                  className={`shrink-0 mx-4 text-xs uppercase tracking-wider transition-colors duration-300 ${isLoginHovered ? "text-white/60" : "text-white/30"
                    }`}
                >
                  Or
                </span>
                <div
                  className={`grow border-t transition-colors duration-300 ${isLoginHovered
                    ? "border-white/30 shadow-[0_1px_8px_rgba(255,255,255,0.1)]"
                    : "border-white/10"
                    }`}
                ></div>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-4">
                <SocialButton
                  provider="google"
                  icon={FaGoogle}
                  isReflected={isLoginHovered}
                />
                <SocialButton
                  provider="microsoft"
                  icon={FaMicrosoft}
                  isReflected={isLoginHovered}
                />
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
                  const glowColor = isCyan
                    ? "rgba(0, 240, 216, 1.0)"
                    : "rgba(124, 76, 255, 1.0)";
                  const shadowColor = isCyan
                    ? "rgba(0, 240, 216, 0.6)"
                    : "rgba(124, 76, 255, 0.6)";

                  return (
                    <React.Fragment key={i}>
                      {i === 3 && (
                        <div className="text-white/20 text-2xl font-light shrink-0">
                          –
                        </div>
                      )}
                      <motion.input
                        ref={(el) => {
                          inputRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={otp[i]}
                        onChange={(e) => handleOtpChange(e.target, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        initial={{
                          borderColor: "rgba(255, 255, 255, 0.08)",
                          boxShadow: "0 0 0 rgba(0,0,0,0)",
                        }}
                        animate={{
                          borderColor: [
                            "rgba(255, 255, 255, 0.08)",
                            glowColor,
                            "rgba(255, 255, 255, 0.08)",
                            "rgba(255, 255, 255, 0.08)",
                          ],
                          boxShadow: [
                            "0 0 0 rgba(0,0,0,0)",
                            `0 0 20px ${shadowColor}`,
                            "0 0 0 rgba(0,0,0,0)",
                            "0 0 0 rgba(0,0,0,0)",
                          ],
                        }}
                        transition={{
                          duration: 5.5,
                          times: [0, 0.2, 0.4, 1], // Pulse localized within its window
                          delay: i * 0.4, // Slower staggered start but still overlapping
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`${styles.authInput} flex-none rounded-md text-center text-2xl font-bold bg-white/5 border-white/10 outline-none focus:border-white/20 transition-colors`}
                        style={{ width: "54px", height: "72px" }}
                      />
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Help Text Footer */}
              <div className="text-xs text-white/40">
                <p>
                  Haven't received the code?{" "}
                  <button
                    type="button"
                    className="text-accent2 hover:text-accent1 transition-colors cursor-pointer font-medium"
                  >
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
      {step === "email" && (
        <p className="text-white/60 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-white hover:text-accent1 transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
}
