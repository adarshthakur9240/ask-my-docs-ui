"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Database, ShieldCheck, Cpu, Zap, Activity } from "lucide-react";

// Lazy load Three.js Canvas with ssr: false
const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border border-blue-500/20 flex items-center justify-center animate-pulse">
        <Database className="w-8 h-8 text-blue-400/50" />
      </div>
    </div>
  ),
});

export default function HeroSection() {
  const headlineText = "Ask your docs, actually get answers you can trust.";
  const words = headlineText.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -30 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 220,
        damping: 18,
      },
    },
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full neu-pill border border-white/[0.05]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
            <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
              Production RAG System for LangChain & LangGraph
            </span>
          </motion.div>

          {/* Staggered Word Reveal Headline */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={`inline-block mr-[0.28em] ${
                  word.includes("answers") || word.includes("trust.")
                    ? "text-gradient-cyan-blue"
                    : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl"
          >
            Eliminate hallucinations with cross-encoder reranking, graph-structured state verification, and precision AST chunking across official documentation.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/dashboard"
              className="neu-button-primary px-8 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 group active:scale-95 shadow-lg"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#pipeline"
              className="neu-card-interactive px-7 py-4 rounded-2xl text-sm font-bold text-slate-200 hover:text-white flex items-center gap-2"
            >
              <span>How It Works</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </a>
          </motion.div>

          {/* Key Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="pt-6 border-t border-white/[0.05] grid grid-cols-3 gap-4 max-w-xl"
          >
            <div>
              <div className="text-xl font-bold text-white font-mono">32,273</div>
              <div className="text-xs text-slate-400 font-medium">Indexed Code Vectors</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-400 font-mono">&lt; 1.8s</div>
              <div className="text-xs text-slate-400 font-medium">End-to-End Latency</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400 font-mono">99.4%</div>
              <div className="text-xs text-slate-400 font-medium">Grounding Precision</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: 3D Centerpiece & Floating Stat Chips */}
        <div className="lg:col-span-5 relative h-[480px] lg:h-[560px] flex items-center justify-center">
          {/* 3D Canvas */}
          <div className="absolute inset-0 w-full h-full">
            <Hero3DCanvas />
          </div>

          {/* Floating Floating Neumorphic Stat Chips */}
          {/* Chip 1: Top Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute top-6 left-2 sm:-left-4 neu-panel p-3.5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl backdrop-blur-md animate-float-bob pointer-events-auto"
            data-cursor="card"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white">ChromaDB Store</div>
              <div className="text-[10px] text-slate-400 font-mono">32,273 Vectors</div>
            </div>
          </motion.div>

          {/* Chip 2: Bottom Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute bottom-10 right-2 sm:-right-4 neu-panel p-3.5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl backdrop-blur-md animate-float-bob-delayed pointer-events-auto"
            data-cursor="card"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white">LangGraph Verifier</div>
              <div className="text-[10px] text-emerald-400 font-semibold">100% Citation Grounded</div>
            </div>
          </motion.div>

          {/* Chip 3: Mid Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="absolute bottom-28 left-4 neu-panel px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg backdrop-blur-md pointer-events-auto"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-slate-200">
              bge-reranker-large
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
