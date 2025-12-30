"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax movement for background elements
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 10]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#05060a]"
    >
      {/* 1. Cyber Grid Pattern - Adds "Future Design" feel */}
      <div
        className="absolute inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black 40%, transparent 100%)", // Fade out edges
        }}
      />

      {/* 2. Deep Atmosphere Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-linear-to-t from-accent2/10 to-transparent opacity-50" />

      {/* 3. Base noise texture for texture */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E")',
        }}
      />

      {/* 4. Vibrant Moving Gradients */}
      {/* Top Left - Cyan/Teal */}
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-linear-to-br from-accent1/20 to-blue-500/10 blur-[100px] opacity-40 mix-blend-screen"
      />

      {/* mid Right - Violet/Purple */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-linear-to-bl from-accent2/20 to-purple-600/10 blur-[120px] opacity-40 mix-blend-screen"
      />

      {/* 5. Central Beam - Subtle highlighter */}
      <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[40vw] h-[80vw] bg-accent1/5 blur-[100px] rotate-12 pointer-events-none" />
    </div>
  );
};

export default ParallaxBackground;
