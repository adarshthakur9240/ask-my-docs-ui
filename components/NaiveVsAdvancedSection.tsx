"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, Zap, Database, Layers, ShieldCheck } from "lucide-react";

export default function NaiveVsAdvancedSection() {
  const [activeTab, setActiveTab] = useState<"naive" | "advanced">("advanced");

  const naiveFeatures = [
    {
      title: "Raw Vector Cosine Similarity",
      desc: "Queries search embeddings directly, missing exact keyword matches and API method names.",
      bad: true,
    },
    {
      title: "Lost-in-the-Middle Context",
      desc: "Dumps raw chunks into the prompt context window without relevance scoring or filtering.",
      bad: true,
    },
    {
      title: "Silent Hallucinations & Fabricated APIs",
      desc: "LLMs invent non-existent LangChain methods when context is ambiguous or partial.",
      bad: true,
    },
    {
      title: "Zero Grounding Verification",
      desc: "Returns output immediately without checking whether claims match retrieved documentation source code.",
      bad: true,
    },
  ];

  const advancedFeatures = [
    {
      title: "Hybrid Vector + Keyword Search",
      desc: "Combines dense vector embeddings with sparse BM25 keyword matching across code ASTs.",
      good: true,
    },
    {
      title: "Cross-Encoder Reranking (BGE)",
      desc: "Passes top-20 retrieved candidates through bge-reranker-large to score true semantic relevance.",
      good: true,
    },
    {
      title: "AST-Aware Code Chunking",
      desc: "Preserves whole Python/TypeScript classes, interfaces, and function signatures intact.",
      good: true,
    },
    {
      title: "LangGraph Grounding Self-Check",
      desc: "Executes an automated verification pass. Unbacked claims are automatically flagged and re-routed.",
      good: true,
    },
  ];

  return (
    <section id="comparison" className="relative py-24 px-6 z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Architectural Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Standard RAG Fails for Technical Docs
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            LangChain and LangGraph evolve rapidly. Naive vector lookup yields outdated imports, missing methods, and hallucinated code examples.
          </p>
        </div>

        {/* Interactive Toggle Switch */}
        <div className="flex justify-center">
          <div className="neu-input-bar p-1.5 rounded-2xl inline-flex items-center gap-2 border border-white/5 shadow-inner">
            <button
              onClick={() => setActiveTab("naive")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "naive"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_16px_rgba(244,63,94,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Naive RAG Approach</span>
            </button>

            <button
              onClick={() => setActiveTab("advanced")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "advanced"
                  ? "neu-button-primary shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Ask My Docs (Production RAG)</span>
            </button>
          </div>
        </div>

        {/* Comparison Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Side: Comparison Feature Cards */}
          <div className="lg:col-span-7 space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === "naive" ? (
                <motion.div
                  key="naive-list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {naiveFeatures.map((item, i) => (
                    <div
                      key={i}
                      className="neu-panel p-5 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-950/20 via-transparent to-transparent flex items-start gap-4"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle className="w-5 h-5 text-rose-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-rose-200">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="advanced-list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {advancedFeatures.map((item, i) => (
                    <div
                      key={i}
                      className="neu-card-interactive p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/20 via-transparent to-transparent flex items-start gap-4"
                      data-cursor="card"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Interactive Response Code Visualizer */}
          <div className="lg:col-span-5 neu-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden bg-[#181a26]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${activeTab === "naive" ? "bg-rose-500" : "bg-emerald-400 animate-pulse"}`} />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  {activeTab === "naive" ? "Output: Naive RAG" : "Output: Ask My Docs"}
                </span>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                activeTab === "naive" 
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                {activeTab === "naive" ? "Unverified" : "Grounding Verified"}
              </span>
            </div>

            {/* Code Box */}
            <div className="font-mono text-xs space-y-3 bg-[#131520] p-4 rounded-xl border border-white/5 text-slate-300 leading-relaxed overflow-x-auto">
              {activeTab === "naive" ? (
                <>
                  <div className="text-rose-400 font-semibold">// ❌ Outdated import & invalid parameter hallucinated</div>
                  <div>
                    <span className="text-purple-400">from</span> langchain.agents <span className="text-purple-400">import</span> InitializeAgent <span className="text-slate-500"># Deprecated!</span>
                  </div>
                  <div>
                    agent = InitializeAgent(tools, llm, <span className="text-rose-400">use_legacy_executor=True</span>)
                  </div>
                  <div className="text-slate-500 text-[11px] pt-2 border-t border-rose-500/20">
                    ⚠ Result: Fails at runtime with AttributeError: 'InitializeAgent' not found. Zero doc citations attached.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-emerald-400 font-semibold">// ✅ Grounded in LangGraph v0.2.x official docs</div>
                  <div>
                    <span className="text-purple-400">from</span> langgraph.graph <span className="text-purple-400">import</span> StateGraph, START, END
                  </div>
                  <div>
                    builder = StateGraph(State)
                  </div>
                  <div>
                    builder.add_node(<span className="text-emerald-300">"agent"</span>, call_model)
                  </div>
                  <div className="text-blue-400 text-[11px] pt-2 border-t border-blue-500/20 flex items-center justify-between">
                    <span>Citation: python.langchain.com/docs/graph</span>
                    <span className="text-emerald-400 font-bold">100% Grounded</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Summary */}
            <div className="pt-4 text-xs font-semibold text-slate-400 flex items-center justify-between border-t border-white/5 mt-4">
              <span>Reranker Score</span>
              <span className="font-mono text-white">
                {activeTab === "naive" ? "N/A (Skipped)" : "0.9842 (High Confidence)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
