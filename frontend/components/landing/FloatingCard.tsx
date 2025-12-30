import { motion } from "framer-motion";
import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export const FloatingCard: React.FC<Props> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <motion.article
      // Animate in on scroll: starts below and faded
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      // Hover lift + tilt: communicates interactivity; neon rim adds premium feel
      whileHover={{
        y: -10,
        rotateX: 2,
        rotateY: 2,
        boxShadow:
          "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,240,216,0.4), inset 0 1px 0 0 rgba(255,255,255,0.1)",
      }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="group relative p-8 rounded-2xl bg-[#0a0c10] border border-white/5 backdrop-blur-xl overflow-hidden"
    >
      {/* Right edge accent line */}
      <div className="absolute right-0 top-10 bottom-10 w-0.5 bg-white/10 group-hover:bg-accent1/80 transition-colors duration-500" />

      {/* Subtitle */}
      {subtitle && (
        <div className="mb-3 text-xs uppercase tracking-widest text-accent1/80 font-mono">
          {subtitle}
        </div>
      )}

      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent1 transition-colors">
        {title}
      </h3>
      <p className="text-white/60 leading-relaxed text-sm md:text-base">
        {children}
      </p>

      {/* Glossy sheen overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.article>
  );
};

export default FloatingCard;
