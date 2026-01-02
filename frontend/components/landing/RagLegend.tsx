// Legend explaining the RAG physics demo
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function RagLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-8 text-center max-w-2xl mx-auto"
    >
      <p className="text-white/50 text-sm leading-relaxed">
        These falling blocks are retrieved signals — projects, GitHub tips,
        resume fixes, interview advice. Click to inspect and drag to experiment.
      </p>
    </motion.div>
  );
}
