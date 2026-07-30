"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Database, ShieldCheck, Terminal } from "lucide-react";

const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
  ssr: false,
});

export default function CTASection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="neu-panel p-10 sm:p-16 rounded-3xl border border-white/10 relative overflow-hidden text-center space-y-8 bg-gradient-to-b from-[#212637] to-[#181b27] shadow-2xl"
        >
          {/* Background 3D Node Network Canvas */}
          <div className="absolute inset-0 w-full h-full opacity-35 pointer-events-none scale-125">
            <Hero3DCanvas />
          </div>

          {/* Glowing Radial Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full neu-pill border border-blue-500/20">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
              Ready for Production Exploration
            </span>
          </div>

          {/* Headline */}
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Start Querying Your Documentation Today
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Experience sub-2 second reranked, grounded answers over 32k+ vector chunks in real-time.
            </p>
          </div>

          {/* Button CTA */}
          <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="neu-button-primary px-10 py-5 rounded-2xl text-base font-bold flex items-center gap-3 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            >
              <span>Explore the Live Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* System Guarantees */}
          <div className="relative z-10 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-xs text-slate-400 font-medium">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Hallucinations</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Database className="w-4 h-4 text-blue-400" />
              <span>ChromaDB Vector Store</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>bge-reranker-large</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>LangGraph State Agent</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
