// Dev: Presentational card for RAG blocks — used in both physics and static grid
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiBox } from "react-icons/fi";

interface RagBlockCardProps {
  id: string;
  title: string;
  brief: string;
  detail: string;
  tag: string;
  isPhysics?: boolean;
  style?: React.CSSProperties;
  onExpand?: (id: string) => void;
}

export default function RagBlockCard({
  id,
  title,
  brief,
  detail,
  tag,
  isPhysics = false,
  style,
  onExpand,
}: RagBlockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    // Don't allow expansion in physics mode to avoid crowding
    if (isPhysics) return;
    setIsExpanded(!isExpanded);
    if (onExpand) onExpand(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isPhysics) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const accentColor =
    tag === "projects" || tag === "interview"
      ? "rgba(0, 240, 216, 0.6)"
      : "rgba(124, 76, 255, 0.6)";

  return (
    <>
      <div
        role={isPhysics ? undefined : "button"}
        tabIndex={isPhysics ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`detail-${id}`}
        className={`rounded-lg bg-[rgba(255,255,255,0.03)] border border-white/8 backdrop-blur-lg p-4 ${
          isPhysics
            ? "select-none pointer-events-auto"
            : "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent1"
        } transition-all`}
        style={{
          ...style,
          boxShadow: `0 0 15px ${accentColor}`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: accentColor,
              opacity: 0.2,
            }}
          >
            <FiBox className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
            <p className="text-white/60 text-xs leading-relaxed">{brief}</p>
          </div>
        </div>
      </div>

      {/* Expanded detail modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClick}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              id={`detail-${id}`}
              className="bg-[rgba(20,20,30,0.95)] border border-white/10 rounded-2xl p-6 max-w-md w-full backdrop-blur-xl"
              style={{
                boxShadow: `0 0 40px ${accentColor}`,
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`title-${id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: accentColor,
                      opacity: 0.3,
                    }}
                  >
                    <FiBox className="w-5 h-5 text-white" />
                  </div>
                  <h3
                    id={`title-${id}`}
                    className="text-xl font-bold text-white"
                  >
                    {title}
                  </h3>
                </div>
                <button
                  onClick={handleClick}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Close details"
                >
                  <FiX className="w-4 h-4 text-white/70" />
                </button>
              </div>
              <p className="text-white/80 text-base leading-relaxed mb-4">
                {detail}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all"
                style={{
                  color: accentColor,
                  borderColor: accentColor,
                  border: "1px solid",
                }}
              >
                Learn more →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
