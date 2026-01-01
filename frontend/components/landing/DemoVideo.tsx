"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * DemoVideo - Lazy-loaded video player with custom play overlay
 *
 * Features:
 * - 16:9 responsive container
 * - Orb-themed gradient poster placeholder
 * - Custom play button styled like GlowingButton
 * - Native <video> player for performance
 * - Accessible: keyboard Enter to play, aria-label
 * - Respects reduced motion (no hover animations)
 *
 * Note: This component should be dynamically imported with ssr: false
 */

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Animation variants - fade in from right
  const fadeInRight = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.2 }; // easeOut cubic bezier

  // Hover animation for the container
  const hoverAnimation = prefersReducedMotion
    ? {}
    : {
        scale: 1.01,
        boxShadow: "0 0 60px rgba(0, 240, 216, 0.15)",
      };

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If video fails to play, show error state
        setHasError(true);
      });
      setIsPlaying(true);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
      }
    },
    [isPlaying, handlePlay, handlePause]
  );

  return (
    <motion.div
      initial={fadeInRight.initial}
      whileInView={fadeInRight.animate}
      viewport={{ once: true, amount: 0.3 }}
      transition={transition}
      whileHover={hoverAnimation}
      className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[rgba(255,255,255,0.02)] backdrop-blur-lg group"
      style={{
        boxShadow:
          "0 0 20px rgba(0,240,216,0.3), 0 0 40px rgba(124,76,255,0.2)",
        animation: "borderGlow 3s ease-in-out infinite",
      }}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={isPlaying ? "Pause demo video" : "Play demo video"}
    >
      <style jsx>{`
        @keyframes borderGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(0, 240, 216, 0.4),
              0 0 40px rgba(124, 76, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(124, 76, 255, 0.4),
              0 0 40px rgba(0, 240, 216, 0.2);
          }
        }
      `}</style>
      {/* Orb-themed gradient poster/placeholder */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(0, 240, 216, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(124, 76, 255, 0.15) 0%, transparent 50%), linear-gradient(135deg, rgba(5, 6, 10, 0.9) 0%, rgba(10, 12, 16, 0.95) 100%)",
        }}
      >
        {/* Decorative orb shape */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent1/30 to-accent2/30 blur-2xl animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent1/20 to-accent2/20 backdrop-blur-sm border border-white/10" />
          <div className="absolute inset-8 rounded-full bg-white/10 backdrop-blur-md" />
        </div>
      </div>

      {/* Play button overlay */}
      {!isPlaying && !hasError && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent1 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          aria-label="Play demo video"
        >
          <div className="relative group/play">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-accent1/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 group-hover/play:opacity-100 transition-opacity duration-300" />

            {/* Play circle */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/play:bg-white/20 group-hover/play:border-accent1/50 group-hover/play:scale-110 transition-all duration-300">
              {/* Play icon */}
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/80 z-10">
          <div className="text-center p-6">
            <p className="text-white/60 mb-2">Video unavailable</p>
            <button
              onClick={() => {
                setHasError(false);
                handlePlay();
              }}
              className="text-accent1 hover:underline text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Native video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
        controls={isPlaying}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        playsInline
        preload="metadata"
      >
        {/* Placeholder video source - replace with actual demo video */}
        <source src="/demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Neon rim glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(0, 240, 216, 0.3), 0 0 30px rgba(0, 240, 216, 0.1)",
        }}
      />
    </motion.div>
  );
}
