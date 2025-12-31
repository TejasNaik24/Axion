"use client";
import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useAnimation } from "framer-motion";
import GlowingButton from "@/components/landing/GlowingButton";

const AxionOrb = dynamic(() => import("@/components/landing/AxionOrb"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 rounded-full bg-linear-to-br from-accent1/10 to-accent2/10 backdrop-blur-3xl animate-pulse flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-white/5 animate-ping" />
    </div>
  ),
});

// Typing animation component for "Axion"
const TypedText: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setShowCursor(false), 300);
        }
      }, 80); // Faster typing speed

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="relative">
      {displayedText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block w-1 h-[0.9em] bg-accent1 ml-1 align-middle"
        />
      )}
    </span>
  );
};

export const HeroLayout: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    // Start the animation sequence
    controls.start("visible");
  }, [controls]);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Scan line effect */}
      <motion.div
        initial={{ top: "-100%" }}
        animate={{ top: "200%" }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0 }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent1 to-transparent opacity-30 pointer-events-none z-20"
      />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col space-y-8 z-10">
          {/* Hero Headline: Typed effect with glitch */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] relative"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="block text-white relative"
            >
              <TypedText text="Axion" delay={800} />

              {/* Glitch effect overlay */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.8, 0, 0.6, 0],
                  x: [-2, 2, -1, 1, 0],
                }}
                transition={{
                  delay: 1.2,
                  duration: 0.3,
                  times: [0, 0.2, 0.4, 0.6, 1],
                }}
                className="absolute inset-0 text-accent1 mix-blend-screen"
                aria-hidden="true"
              >
                Axion
              </motion.span>
            </motion.span>
          </motion.h1>

          {/* Subhead: slide in from right with blur */}
          <motion.h2
            initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: 0.4,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            className="text-2xl md:text-3xl text-white/80 font-light max-w-xl leading-snug"
          >
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, delay: 0.4, repeat: 1 }}
              className="bg-gradient-to-r from-white/80 via-accent1/80 to-white/80 bg-clip-text text-transparent bg-[length:200%_100%]"
            >
              I identify the weakest signals in your profile and give you a step-by-step
              plan to fix them.
            </motion.span>
          </motion.h2>

          {/* CTA Buttons - staggered with glow pulse */}
          <div className="flex flex-wrap gap-4 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
            >
              <GlowingButton variant="primary" size="md">
                Get Started
              </GlowingButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
            >
              <GlowingButton variant="secondary" size="md">
                See Demo
              </GlowingButton>
            </motion.div>
          </div>

          {/* Trust line: fade in with data stream effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="pt-6 text-sm text-white/50 max-w-lg leading-relaxed relative"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
              className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-accent1/50 to-transparent"
            />
            Opinionated, engineer-first guidance — projects,
            resume fixes, curated resources.
          </motion.div>
        </div>

        {/* Right Visual (Orb) - delayed entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{
            delay: 0.5,
            duration: 1.2,
            type: "spring",
            stiffness: 80,
          }}
          className="relative w-full flex justify-center lg:justify-center z-10 lg:mt-0"
        >
          <div className="relative w-full max-w-lg">
            {/* Background Glow behind Orb - pulse in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 1.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-accent2/20 blur-[100px] rounded-full pointer-events-none"
            />
            <Suspense fallback={null}>
              <AxionOrb />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroLayout;
