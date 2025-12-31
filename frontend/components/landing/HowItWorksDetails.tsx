/**
 * HowItWorksDetails - Expandable developer accordion
 * Shows technical implementation details, code snippets, and examples
 */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionPanel {
  id: string;
  title: string;
  explanation: string;
  code: string;
  language: string;
}

const panels: AccordionPanel[] = [
  {
    id: "userstate",
    title: "UserState schema",
    explanation:
      "The canonical user profile object that Axion builds and updates throughout the conversation. All agent decisions are made based on this state.",
    code: `interface UserState {
  sessionId: string;
  field?: 'CS' | 'CompE' | 'EE' | string;
  level?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Grad';
  focus?: 'AI' | 'Frontend' | 'Backend' | 'Systems' | 'Undecided';
  projects?: boolean;
  internships?: boolean;
  githubUrl?: string | null;
  blocker?: string | null;
  timePerWeek?: number | null;
  // internal metadata
  lastUpdated: string;
  provenance?: string[];
}`,
    language: "typescript",
  },
  {
    id: "profiler",
    title: "Profiler prompt (example)",
    explanation:
      "A short prompt template used to extract structured fields from resume text or freeform user input. The LLM outputs valid JSON.",
    code: `System: You are an expert CS career advisor. Extract key fields from the provided resume text in JSON. Only output valid JSON.

User: <resume text>

Output fields: field, level, focus, projects(boolean), internships(boolean), githubUrl, blocker`,
    language: "text",
  },
  {
    id: "question-selection",
    title: "Question-Selection logic",
    explanation:
      "The agent selects the next-best question by checking for missing signals in the user state. It prioritizes high-impact fields and avoids redundant questions.",
    code: `function nextQuestion(state) {
  if (!state.focus) return ask("What are you focusing on now?");
  if (state.projects === false) return ask("Do you have public projects or a GitHub?");
  if (!state.githubUrl) return ask("Do you have a GitHub link to include?");
  // else ask blocker-focused question
  return ask("What's your biggest blocker right now?");
}`,
    language: "javascript",
  },
  {
    id: "rag-flow",
    title: "RAG / retrieval flow",
    explanation:
      "Axion retrieves the top K most relevant documents from a vector database based on the user's profile. These docs are injected into the prompt to provide context-specific advice.",
    code: `const docs = retriever.getRelevantDocs(state, topK=5);
const prompt = template.replace("{profile}", JSON.stringify(state)).replace("{context}", docs.join("\\n\\n"));
const answer = llm.call(prompt);`,
    language: "javascript",
  },
  {
    id: "tool-gating",
    title: "Tool gating & web search fallback",
    explanation:
      "The curated corpus is the primary source of truth. Web search is only triggered when the retrieval confidence score falls below a threshold or when the query requires real-time data (e.g., job postings, recent frameworks).",
    code: `if (retrievalScore < CONFIDENCE_THRESHOLD) {
  // Fallback to web search
  results = await webSearch(query, filters);
} else {
  // Use curated corpus
  results = vectorDB.search(query, topK=5);
}`,
    language: "javascript",
  },
  {
    id: "explainability",
    title: "Explainability & user-facing justification",
    explanation:
      'Axion generates a short, explainable rationale for each recommendation. The "because" statement connects the user\'s profile to the prescribed action, making the advice transparent and trustworthy.',
    code: `// Example output:
{
  "action": "Build a full-stack project with Next.js + PostgreSQL",
  "rationale": "Because you have no public projects, this will demonstrate both frontend and backend skills to recruiters.",
  "resources": [
    { "title": "Next.js tutorial", "url": "..." },
    { "title": "PostgreSQL for beginners", "url": "..." }
  ]
}`,
    language: "javascript",
  },
];

interface HowItWorksDetailsProps {
  openPanelId?: string | null;
}

export default function HowItWorksDetails({
  openPanelId,
}: HowItWorksDetailsProps) {
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState(false);
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Auto-expand panel if openPanelId is provided
  useEffect(() => {
    if (openPanelId && !showDetails) {
      setShowDetails(true);
      setTimeout(() => {
        setExpandedPanels(new Set([openPanelId]));
        panelRefs.current[openPanelId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [openPanelId, showDetails]);

  const togglePanel = (panelId: string) => {
    setExpandedPanels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(panelId)) {
        newSet.delete(panelId);
      } else {
        newSet.add(panelId);
      }
      return newSet;
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent, panelId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePanel(panelId);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="mt-12">
      {/* Toggle button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="group px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-accent1/30 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-sm font-medium">
            <span className="text-accent1">For engineers</span> —{" "}
            {showDetails ? "Hide" : "Show"} technical details
          </span>
          <motion.svg
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>
      </div>

      {/* Accordion panels */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="space-y-4 overflow-hidden"
          >
            {panels.map((panel) => {
              const isExpanded = expandedPanels.has(panel.id);
              return (
                <div
                  key={panel.id}
                  ref={(el) => {
                    panelRefs.current[panel.id] = el;
                  }}
                  className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/6 backdrop-blur-lg overflow-hidden"
                >
                  {/* Panel header */}
                  <button
                    onClick={() => togglePanel(panel.id)}
                    onKeyDown={(e) => handleKeyPress(e, panel.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`panel-${panel.id}`}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent1/40 focus:ring-inset"
                  >
                    <h4 className="text-lg font-semibold text-white">
                      {panel.title}
                    </h4>
                    <motion.svg
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-5 h-5 text-white/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </button>

                  {/* Panel content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id={`panel-${panel.id}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 space-y-4">
                          {/* Explanation */}
                          <p className="text-white/70 leading-relaxed">
                            {panel.explanation}
                          </p>

                          {/* Code block */}
                          <div className="relative group/code">
                            <pre className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
                              <code className="text-white/90 font-mono">
                                {panel.code}
                              </code>
                            </pre>

                            {/* Copy button */}
                            <button
                              onClick={() => copyCode(panel.code)}
                              className="absolute top-3 right-3 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white/70 text-xs opacity-0 group-hover/code:opacity-100 hover:bg-white/20 hover:text-white transition-all duration-200"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
