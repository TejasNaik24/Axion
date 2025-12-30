import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

type Props = HTMLMotionProps<"button"> & {
  ariaLabel?: string;
  children?: React.ReactNode;
};

export const GlowButton: React.FC<Props> = ({
  children,
  className = "",
  ariaLabel,
  ...rest
}) => {
  // Enhanced hover: lift + slight scale + layered glow
  // Purpose: communicates affordance; makes button feel reactive and premium
  const hover = {
    y: -6,
    scale: 1.03,
    boxShadow:
      "0 12px 50px rgba(0,240,216,0.25), 0 0 0 1px rgba(0,240,216,0.3)",
  };

  // Tap animation: press down effect for tactile feedback
  const tap = {
    scale: 0.97,
    y: -2,
  };

  return (
    <motion.button
      aria-label={ariaLabel}
      whileHover={hover}
      whileTap={tap}
      // Spring transition: natural, organic movement
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
                relative inline-flex items-center justify-center px-8 py-3.5 
                rounded-xl text-white font-medium text-sm md:text-base
                bg-white/5 border border-white/10
                backdrop-blur-md overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-accent1/60 focus:ring-offset-2 focus:ring-offset-bg
                transition-colors
                ${className}
            `}
      {...rest}
    >
      {/* Base glow layer: subtle always-on glow */}
      <div className="absolute inset-0 bg-linear-to-r from-accent1/5 to-accent2/5 opacity-50" />

      {/* Hover glow layer: appears on hover for emphasis */}
      <div className="absolute inset-0 bg-linear-to-r from-accent1/20 to-accent2/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Edge rim highlight: creates depth */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,240,216,0.3) 0%, transparent 50%, rgba(124,76,255,0.3) 100%)",
          backgroundSize: "200% 200%",
          animation: "shimmer 3s ease infinite",
        }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GlowButton;
