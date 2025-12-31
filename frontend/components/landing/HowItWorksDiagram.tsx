// NOTE: respects prefers-reduced-motion
// NOTE: Lazy-loaded via dynamic import in HowItWorksSection
/**
 * HowItWorksDiagram - Interactive architecture diagram
 * Shows system components with hover tooltips and animated flow
 */
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface HowItWorksDiagramProps {
  onRegionClick?: (region: string) => void;
}

interface TooltipState {
  region: string | null;
  x: number;
  y: number;
}

export default function HowItWorksDiagram({
  onRegionClick,
}: HowItWorksDiagramProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({
    region: null,
    x: 0,
    y: 0,
  });

  const regions = {
    intake: {
      name: "Intake",
      desc: "Resume parsing & signal extraction",
      color: "var(--accent1)",
    },
    parser: {
      name: "Parser",
      desc: "Structured data extraction",
      color: "var(--accent2)",
    },
    retriever: {
      name: "Retriever",
      desc: "Vector DB + RAG pipeline",
      color: "var(--accent1)",
    },
    agents: {
      name: "Agents",
      desc: "Stateful reasoning & question selection",
      color: "var(--accent2)",
    },
    guidance: {
      name: "Guidance",
      desc: "Prescriptive action plan output",
      color: "var(--accent1)",
    },
  };

  const handleRegionHover = (
    region: string | null,
    event?: React.MouseEvent
  ) => {
    setHoveredRegion(region);
    if (region && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        region,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    } else {
      setTooltip({ region: null, x: 0, y: 0 });
    }
  };

  const handleRegionClick = (region: string) => {
    onRegionClick?.(region);
  };

  const handleKeyPress = (event: React.KeyboardEvent, region: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleRegionClick(region);
    }
  };

  const playFlow = () => {
    if (prefersReducedMotion) return;
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="relative w-full">
      {/* Play Flow Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={playFlow}
          disabled={isPlaying || prefersReducedMotion}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 hover:border-accent1/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? "Playing..." : "Play flow"}
        </button>
      </div>

      {/* SVG Diagram */}
      <svg
        viewBox="0 0 800 400"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="rgba(255, 255, 255, 0.3)" />
          </marker>

          {/* Glow filters for hover effects */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines (arrows) */}
        <g stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" fill="none">
          <path
            id="path1"
            d="M 140 200 L 240 200"
            markerEnd="url(#arrowhead)"
          />
          <path
            id="path2"
            d="M 340 200 L 440 200"
            markerEnd="url(#arrowhead)"
          />
          <path
            id="path3"
            d="M 540 200 L 640 200"
            markerEnd="url(#arrowhead)"
          />
          <path
            id="path4"
            d="M 460 240 Q 460 300, 340 300 Q 220 300, 220 240"
            markerEnd="url(#arrowhead)"
            strokeDasharray="4 4"
          />
        </g>

        {/* Animated flow dot */}
        <AnimatePresence>
          {isPlaying && !prefersReducedMotion && (
            <motion.circle
              r="6"
              cy="200"
              fill="var(--accent1)"
              filter="url(#glow)"
              initial={{ cx: 140, opacity: 0 }}
              animate={{
                cx: [140, 240, 340, 440, 540, 640, 700],
                opacity: [0, 1, 1, 1, 1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 3,
                times: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1],
                ease: "linear",
              }}
            />
          )}
        </AnimatePresence>

        {/* Region: Intake */}
        <g
          onMouseEnter={(e) => handleRegionHover("intake", e)}
          onMouseLeave={() => handleRegionHover(null)}
          onClick={() => handleRegionClick("intake")}
          onKeyDown={(e) => handleKeyPress(e, "intake")}
          tabIndex={0}
          role="button"
          aria-label="Intake component - click for details"
          className="cursor-pointer focus:outline-none"
        >
          <rect
            x="50"
            y="160"
            width="90"
            height="80"
            rx="12"
            fill={
              hoveredRegion === "intake"
                ? "rgba(0, 240, 216, 0.15)"
                : "rgba(255, 255, 255, 0.05)"
            }
            stroke={
              hoveredRegion === "intake"
                ? "var(--accent1)"
                : "rgba(255, 255, 255, 0.2)"
            }
            strokeWidth="2"
            filter={hoveredRegion === "intake" ? "url(#glow)" : ""}
            className="transition-all duration-300"
          />
          <text
            x="95"
            y="205"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="600"
          >
            Intake
          </text>
        </g>

        {/* Region: Parser */}
        <g
          onMouseEnter={(e) => handleRegionHover("parser", e)}
          onMouseLeave={() => handleRegionHover(null)}
          onClick={() => handleRegionClick("parser")}
          onKeyDown={(e) => handleKeyPress(e, "parser")}
          tabIndex={0}
          role="button"
          aria-label="Parser component - click for details"
          className="cursor-pointer focus:outline-none"
        >
          <rect
            x="250"
            y="160"
            width="90"
            height="80"
            rx="12"
            fill={
              hoveredRegion === "parser"
                ? "rgba(124, 76, 255, 0.15)"
                : "rgba(255, 255, 255, 0.05)"
            }
            stroke={
              hoveredRegion === "parser"
                ? "var(--accent2)"
                : "rgba(255, 255, 255, 0.2)"
            }
            strokeWidth="2"
            filter={hoveredRegion === "parser" ? "url(#glow)" : ""}
            className="transition-all duration-300"
          />
          <text
            x="295"
            y="205"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="600"
          >
            Parser
          </text>
        </g>

        {/* Region: Retriever */}
        <g
          onMouseEnter={(e) => handleRegionHover("retriever", e)}
          onMouseLeave={() => handleRegionHover(null)}
          onClick={() => handleRegionClick("retriever")}
          onKeyDown={(e) => handleKeyPress(e, "retriever")}
          tabIndex={0}
          role="button"
          aria-label="Retriever component - click for details"
          className="cursor-pointer focus:outline-none"
        >
          <rect
            x="450"
            y="160"
            width="90"
            height="80"
            rx="12"
            fill={
              hoveredRegion === "retriever"
                ? "rgba(0, 240, 216, 0.15)"
                : "rgba(255, 255, 255, 0.05)"
            }
            stroke={
              hoveredRegion === "retriever"
                ? "var(--accent1)"
                : "rgba(255, 255, 255, 0.2)"
            }
            strokeWidth="2"
            filter={hoveredRegion === "retriever" ? "url(#glow)" : ""}
            className="transition-all duration-300"
          />
          <text
            x="495"
            y="198"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="600"
          >
            Retriever
          </text>
          <text
            x="495"
            y="218"
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.5)"
            fontSize="11"
          >
            Vector DB
          </text>
        </g>

        {/* Region: Agents */}
        <g
          onMouseEnter={(e) => handleRegionHover("agents", e)}
          onMouseLeave={() => handleRegionHover(null)}
          onClick={() => handleRegionClick("agents")}
          onKeyDown={(e) => handleKeyPress(e, "agents")}
          tabIndex={0}
          role="button"
          aria-label="Agents component - click for details"
          className="cursor-pointer focus:outline-none"
        >
          <rect
            x="350"
            y="80"
            width="100"
            height="60"
            rx="12"
            fill={
              hoveredRegion === "agents"
                ? "rgba(124, 76, 255, 0.15)"
                : "rgba(255, 255, 255, 0.05)"
            }
            stroke={
              hoveredRegion === "agents"
                ? "var(--accent2)"
                : "rgba(255, 255, 255, 0.2)"
            }
            strokeWidth="2"
            filter={hoveredRegion === "agents" ? "url(#glow)" : ""}
            className="transition-all duration-300"
          />
          <text
            x="400"
            y="115"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="600"
          >
            Agents
          </text>
        </g>

        {/* Region: Guidance */}
        <g
          onMouseEnter={(e) => handleRegionHover("guidance", e)}
          onMouseLeave={() => handleRegionHover(null)}
          onClick={() => handleRegionClick("guidance")}
          onKeyDown={(e) => handleKeyPress(e, "guidance")}
          tabIndex={0}
          role="button"
          aria-label="Guidance output - click for details"
          className="cursor-pointer focus:outline-none"
        >
          <rect
            x="650"
            y="160"
            width="100"
            height="80"
            rx="12"
            fill={
              hoveredRegion === "guidance"
                ? "rgba(0, 240, 216, 0.15)"
                : "rgba(255, 255, 255, 0.05)"
            }
            stroke={
              hoveredRegion === "guidance"
                ? "var(--accent1)"
                : "rgba(255, 255, 255, 0.2)"
            }
            strokeWidth="2"
            filter={hoveredRegion === "guidance" ? "url(#glow)" : ""}
            className="transition-all duration-300"
          />
          <text
            x="700"
            y="205"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="600"
          >
            Guidance
          </text>
        </g>

        {/* Connection from Retriever to Agents */}
        <path
          d="M 495 160 L 400 140"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          fill="none"
        />
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip.region && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-bg/95 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 shadow-lg">
              <p className="text-white text-sm font-semibold mb-1">
                {regions[tooltip.region as keyof typeof regions]?.name}
              </p>
              <p className="text-white/60 text-xs">
                {regions[tooltip.region as keyof typeof regions]?.desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Caption */}
      <p className="text-center text-white/50 text-sm mt-6 italic">
        Stateful agent → retrieve → reason → prescribe.
      </p>
    </div>
  );
}
