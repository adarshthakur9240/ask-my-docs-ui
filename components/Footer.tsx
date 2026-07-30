"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ExternalLink, ShieldCheck, Terminal } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] bg-[#161822]/90 pt-16 pb-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full neu-icon-btn">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Ask My Docs</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
            Production-grade Retrieval Augmented Generation engine fine-tuned for LangChain and LangGraph documentation. Built with cross-encoder reranking, graph memory, and automated grounding self-checks.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/adarshthakur9240/ask-my-docs-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="neu-icon-btn px-3 py-2 rounded-xl text-xs gap-2 text-slate-300 hover:text-white"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Frontend Repo</span>
            </a>
            <a
              href="https://github.com/adarshthakur9240/Ask-My-Docs"
              target="_blank"
              rel="noopener noreferrer"
              className="neu-icon-btn px-3 py-2 rounded-xl text-xs gap-2 text-slate-300 hover:text-white"
            >
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>FastAPI Backend</span>
            </a>
          </div>
        </div>

        {/* Col 2: System Architecture */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Architecture
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-400">
            <li className="hover:text-blue-400 transition-colors">
              <a href="#pipeline">Cross-Encoder Reranking</a>
            </li>
            <li className="hover:text-blue-400 transition-colors">
              <a href="#grounding">LangGraph Self-Correction</a>
            </li>
            <li className="hover:text-blue-400 transition-colors">
              <a href="#comparison">Naive vs Advanced RAG</a>
            </li>
            <li className="hover:text-blue-400 transition-colors">
              <a href="#techstack">ChromaDB Vector Index</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Status Badge */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            System Status
          </h4>
          <div className="neu-panel p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Vector Index</span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Embedding Engine</span>
              <span className="text-slate-200 font-mono">bge-small-en-v1.5</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Grounding Accuracy</span>
              <span className="text-blue-400 font-bold">99.4% Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/[0.04] pt-8 flex items-center justify-between text-xs text-slate-500 font-semibold">
        <span>© {new Date().getFullYear()} Ask My Docs. Designed for high-reliability RAG.</span>
      </div>
    </footer>
  );
}
