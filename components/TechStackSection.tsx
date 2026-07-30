"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Database, Cpu, Zap, Code, ShieldCheck, Terminal, Server } from "lucide-react";

export default function TechStackSection() {
  const stackItems = [
    {
      name: "LangChain",
      category: "LLM Framework",
      desc: "Document Transformers & Prompt Templates",
      icon: Layers,
      color: "text-emerald-400",
      delay: 0,
      rotate: -3,
    },
    {
      name: "LangGraph",
      category: "Agent State Graph",
      desc: "Cyclic Execution & Grounding Verification",
      icon: ShieldCheck,
      color: "text-blue-400",
      delay: 0.2,
      rotate: 2,
    },
    {
      name: "ChromaDB",
      category: "Vector Store",
      desc: "Dense Embeddings & HNSW Vector Indexing",
      icon: Database,
      color: "text-cyan-400",
      delay: 0.4,
      rotate: -2,
    },
    {
      name: "Ollama / BGE",
      category: "Local LLM & Reranker",
      desc: "bge-small-en & bge-reranker-large",
      icon: Cpu,
      color: "text-purple-400",
      delay: 0.1,
      rotate: 4,
    },
    {
      name: "Next.js 16",
      category: "Frontend UI",
      desc: "App Router, React 19 & Tailwind CSS v4",
      icon: Code,
      color: "text-slate-100",
      delay: 0.5,
      rotate: -4,
    },
    {
      name: "FastAPI",
      category: "Async Backend",
      desc: "High-throughput Streaming SSE API",
      icon: Terminal,
      color: "text-teal-400",
      delay: 0.3,
      rotate: 3,
    },
  ];

  return (
    <section id="techstack" className="relative py-24 px-6 z-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Engineered Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Powered by Cutting-Edge Open Source
          </h2>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            Every layer selected for ultra-low latency, deterministic reproducibility, and zero external API dependencies.
          </p>
        </div>

        {/* Floating 3D Tilted Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.04, rotateY: 8, rotateX: -6, z: 20 }}
                className="neu-card-interactive p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden group"
                style={{ perspective: 1000 }}
                data-cursor="card"
              >
                {/* Floating Bob Container */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: item.delay,
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl neu-icon-btn flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
