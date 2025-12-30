"use client";
import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Intake",
    desc: "Connect your GitHub and Linear. We build a high-fidelity graph of your skills and velocity.",
    icon: (
      <svg
        className="w-6 h-6 text-accent1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Question Loop",
    desc: "Axion challenges your assumptions with adaptive prompts that reveal your blind spots.",
    icon: (
      <svg
        className="w-6 h-6 text-accent2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Action Plan",
    desc: "Receive a prioritized roadmap of what to build and learn next to accelerate your career.",
    icon: (
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <div className="h-1 w-20 bg-accent1 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-9 left-[10%] right-[10%] h-px bg-white/10 -z-10" />

          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              // Staggered entrance: each step appears sequentially
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
              className="group relative"
            >
              <div className="flex flex-col items-center text-center">
                {/* Step Connector Dot: expands on hover */}
                <div className="w-4 h-4 rounded-full bg-bg border-2 border-white/20 z-10 mb-6 group-hover:border-accent1 group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(0,240,216,0.6)] transition-all duration-300" />

                {/* Visual Icon Container: glows on hover */}
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:shadow-[0_0_30px_rgba(0,240,216,0.2)] group-hover:border-accent1/50 transition-all duration-300">
                  {step.icon}
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent1 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed max-w-sm">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
