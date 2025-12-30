/**
 * GlowingButton Component
 *
 * A production-grade button with cursor-tracking radial glow effect.
 * Inspired by Huly.io's interactive buttons.
 *
 * Features:
 * - Smooth cursor tracking with GPU-accelerated CSS variables
 * - requestAnimationFrame smoothing for buttery motion
 * - Keyboard focus support (glow centers automatically)
 * - Touch device fallback (pulse animation)
 * - Respects prefers-reduced-motion
 * - Fully accessible with ARIA support
 *
 * Performance notes:
 * - Uses direct DOM writes (setProperty) to avoid React re-renders on mousemove
 * - CSS variables (--mx, --my) are GPU-resident, no layout thrashing
 * - requestAnimationFrame ensures 60fps updates
 *
 * Setup:
 * 1. Add CSS variables to globals.css (see comment below)
 * 2. No additional npm packages required
 * 3. Optional: npm i framer-motion for enhanced micro-interactions
 */

"use client";
import React, { useRef, useEffect, forwardRef, useState } from "react";
import styles from "./GlowingButton.module.css";

/**
 * CSS Variables to add to app/globals.css:
 *
 * :root {
 *   --bg: #05060a;
 *   --accent1: #00f0d8;
 *   --accent2: #7c4cff;
 *   --glass: rgba(255,255,255,0.03);
 *   --neon-shadow: 0 20px 60px rgba(0,240,216,0.08);
 * }
 */

interface GlowingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  pressed?: boolean; // For toggle buttons (aria-pressed)
  className?: string;
}

/**
 * Linear interpolation for smooth cursor tracking
 * Gradually moves current value toward target to avoid jitter
 *
 * @param current - Current position value
 * @param target - Target position value
 * @param factor - Smoothing factor (0-1), lower = smoother but slower
 */
const lerp = (current: number, target: number, factor: number = 0.15) => {
  return current + (target - current) * factor;
};

const GlowingButton = forwardRef<HTMLButtonElement, GlowingButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      pressed,
      className = "",
      onPointerMove,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Track current and target positions for smooth lerping
    const positionRef = useRef({
      currentX: 50,
      currentY: 50,
      targetX: 50,
      targetY: 50,
    });

    const rafRef = useRef<number | undefined>(undefined);
    const isHoveringRef = useRef(false);

    /**
     * requestAnimationFrame loop for smooth cursor tracking
     * Uses lerp to interpolate between current and target positions
     * This avoids jittery movement and ensures GPU-friendly 60fps updates
     *
     * Why RAF instead of state updates?
     * - setState on every mousemove would cause React re-renders (expensive)
     * - Direct DOM writes (transform) are much faster
     * - Transform is GPU-accelerated, no layout recalc
     */
    const updateGlowPosition = () => {
      const button = buttonRef.current;
      if (!button || !isHoveringRef.current) return;

      const pos = positionRef.current;

      // Smoothly interpolate toward target position
      pos.currentX = lerp(pos.currentX, pos.targetX);
      pos.currentY = lerp(pos.currentY, pos.targetY);

      // Move glow container using transform (GPU-accelerated)
      // Offset by half container width (102px) to center glow on cursor
      const glowContainer = button.querySelector(
        `.${styles.glowContainer}`
      ) as HTMLElement;
      if (glowContainer) {
        glowContainer.style.transform = `translateX(${
          pos.currentX - 102
        }px) translateZ(0)`;
      }

      // Continue loop while hovering
      rafRef.current = requestAnimationFrame(updateGlowPosition);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      // Calculate pointer position relative to button's left edge (in pixels)
      const rect = button.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;

      // Update target position (lerp will smooth it)
      positionRef.current.targetX = offsetX;

      // Forward event to parent if provided
      onPointerMove?.(e);
    };

    const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
      isHoveringRef.current = true;

      // Initialize position to entry point for natural glow origin
      const button = buttonRef.current;
      if (button) {
        const rect = button.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;

        positionRef.current = {
          currentX: offsetX,
          currentY: 0,
          targetX: offsetX,
          targetY: 0,
        };
      }

      // Start animation loop
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateGlowPosition);
      }

      onPointerEnter?.(e);
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      isHoveringRef.current = false;

      // Cancel animation loop
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }

      onPointerLeave?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(true);

      // Center glow for keyboard navigation
      const button = buttonRef.current;
      if (button) {
        const glowContainer = button.querySelector(
          `.${styles.glowContainer}`
        ) as HTMLElement;
        if (glowContainer) {
          glowContainer.style.transform = `translateX(0px) translateZ(0)`;
        }
      }

      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Cleanup animation loop on unmount
    useEffect(() => {
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }, []);

    // Merge refs if external ref provided
    useEffect(() => {
      if (typeof ref === "function") {
        ref(buttonRef.current);
      } else if (ref) {
        ref.current = buttonRef.current;
      }
    }, [ref]);

    const buttonClasses = [
      styles.btn,
      styles[variant],
      styles[size],
      isFocused ? styles.focused : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={buttonRef}
        className={buttonClasses}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-pressed={pressed !== undefined ? pressed : undefined}
        {...props}
      >
        {/* Glow container that moves with cursor - Huly.io style */}
        <div className={styles.glowContainer} aria-hidden="true">
          {/* Primary glow - intense center circle */}
          <div className={styles.glow} />

          {/* Secondary glow - soft blurred ellipse */}
          <div className={styles.rim} />
        </div>

        {/* Content layer */}
        <span className={styles.content}>{children}</span>
      </button>
    );
  }
);

GlowingButton.displayName = "GlowingButton";

export default GlowingButton;
