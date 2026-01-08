/**
 * ClockFallbackTrail Component
 *
 * Purpose: SVG-based static trail for reduced-motion fallback
 * - Static SVG arcs representing hour and minute hand trails
 * - Gradient strokes that fade along the arc
 * - No animation, accessible for users who prefer reduced motion
 *
 * SSR: Safe - static SVG content only
 */

import React from "react";

export default function ClockFallbackTrail() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 420 420"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Hour hand trail gradient (violet) */}
        <linearGradient
          id="hourTrailGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#7c4cff" stopOpacity="0" />
          <stop offset="30%" stopColor="#7c4cff" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#a080ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c8b4ff" stopOpacity="0.9" />
        </linearGradient>

        {/* Minute hand trail gradient (cyan) */}
        <linearGradient
          id="minuteTrailGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#00f0d8" stopOpacity="0" />
          <stop offset="30%" stopColor="#00f0d8" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#32ffeb" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#96fff5" stopOpacity="1" />
        </linearGradient>

        {/* Subtle blur for glow effect */}
        <filter id="trailGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      {/* Hour hand trail - arc at ~110px radius */}
      <path
        d="M 210,100 A 110,110 0 0,1 310,210"
        fill="none"
        stroke="url(#hourTrailGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#trailGlow)"
        opacity="0.7"
      />

      {/* Minute hand trail - arc at ~158px radius */}
      <path
        d="M 210,52 A 158,158 0 0,1 368,210"
        fill="none"
        stroke="url(#minuteTrailGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#trailGlow)"
        opacity="0.8"
      />
    </svg>
  );
}
