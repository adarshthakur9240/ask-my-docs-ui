"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Database, Zap, Cpu, ShieldCheck, ArrowRight, Layers, Code, CheckCircle2 } from "lucide-react";

export default function PipelineSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setReducedMotion(true);
      return;
    }

    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80);

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: () => "+=" + track.scrollWidth * 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const pipelineCards = [
    {
      step: "01",
      title: "AST Code Chunking",
      subtitle: "Semantic Document Parsing",
      icon: Code,
      badge: "Ingestion Engine",
      color: "from-blue-500/20 to-cyan-500/10",
      accentColor: "text-blue-400",
      borderColor: "border-blue-500/20",
      desc: "Parses official LangChain & LangGraph documentation, Python source code, and TypeScript SDKs into syntax-aware AST chunks preserving full signatures.",
      stats: [
        { label: "Indexed Vectors", value: "32,273" },
        { label: "Chunk Strategy", value: "AST & Header Split" },
        { label: "Embedding Dim", value: "384-d Dense" },
      ],
      codeSnippet: `def chunk_langchain_ast(doc):\n    tree = ast.parse(doc.content)\n    return [ClassDef, FunctionDef]`,
    },
    {
      step: "02",
      title: "Multi-Vector Hybrid Search",
      subtitle: "Dense + Sparse BM25 Retrieval",
      icon: Database,
      badge: "Vector Store",
      color: "from-cyan-500/20 to-indigo-500/10",
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/20",
      desc: "Queries ChromaDB vector database using bge-small-en-v1.5 embeddings while simultaneously executing sparse BM25 search for exact class names.",
      stats: [
        { label: "Candidates", value: "Top-20 Chunks" },
        { label: "Search Latency", value: "< 42 ms" },
        { label: "Distance Metric", value: "Cosine Similarity" },
      ],
      codeSnippet: `results = vectorstore.similarity_search_with_score(\n    query, k=20, filter={"version": "v0.2"}\n)`,
    },
    {
      step: "03",
      title: "Cross-Encoder Reranking",
      subtitle: "Relevance Scoring with BGE Reranker",
      icon: Zap,
      badge: "Reranker Model",
      color: "from-indigo-500/20 to-purple-500/10",
      accentColor: "text-indigo-400",
      borderColor: "border-indigo-500/20",
      desc: "Passes initial candidates through bge-reranker-large to score true query-document semantic pair relevance, filtering out irrelevant chunks.",
      stats: [
        { label: "Reranker Model", value: "bge-reranker-large" },
        { label: "Threshold", value: "Score > 0.68" },
        { label: "Context Window", value: "Filtered Top-5" },
      ],
      codeSnippet: `scores = reranker.predict(pairs=[(query, doc) for doc in top_20])\nselected = [doc for doc, score in zip(docs, scores) if score > 0.68]`,
    },
    {
      step: "04",
      title: "Self-Check Grounding",
      subtitle: "LangGraph Automated Validation",
      icon: ShieldCheck,
      badge: "State Graph Agent",
      color: "from-emerald-500/20 to-teal-500/10",
      accentColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      desc: "Executes an automated verification loop in LangGraph. Unbacked claims are automatically flagged, re-queried, or corrected before stream output.",
      stats: [
        { label: "Grounding Precision", value: "99.4%" },
        { label: "Verification Loop", value: "< 350 ms" },
        { label: "Citations", value: "Exact URL Anchor" },
      ],
      codeSnippet: `if not grounding_evaluator.is_supported(claim, sources):\n    return Command(goto="re_query_doc_node")`,
    },
  ];

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="relative min-h-screen py-20 flex flex-col justify-center overflow-hidden z-10 bg-[#161822]"
    >
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-6 w-full space-y-4 mb-10 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Inside the Ask My Docs Architecture
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md">
            Scroll vertically to inspect each phase of the production RAG pipeline from AST ingestion to self-checking synthesis.
          </p>
        </div>
      </div>

      {/* Horizontal Cards Track */}
      <div className="w-full overflow-x-hidden">
        <div
          ref={trackRef}
          className={`flex gap-6 px-6 lg:px-16 ${
            reducedMotion ? "overflow-x-auto pb-6" : ""
          }`}
          style={{ width: "max-content" }}
        >
          {pipelineCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="w-[85vw] sm:w-[500px] lg:w-[560px] neu-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between shrink-0 relative overflow-hidden bg-gradient-to-b bg-[#1e2231] shadow-2xl"
                data-cursor="card"
              >
                {/* Ambient Top Glow */}
                <div
                  className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${card.color} blur-3xl pointer-events-none rounded-full`}
                />

                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl neu-icon-btn flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${card.accentColor}`} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        {card.subtitle}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-600">
                    {card.step}
                  </span>
                </div>

                {/* Body Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mb-6 relative z-10">
                  {card.desc}
                </p>

                {/* Code Snippet Box */}
                <div className="mb-6 relative z-10">
                  <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                    <Code className="w-3 h-3 text-blue-400" />
                    <span>Implementation Code</span>
                  </div>
                  <pre className="bg-[#131520] p-4 rounded-xl border border-white/5 font-mono text-[11px] text-blue-300 leading-relaxed overflow-x-auto">
                    <code>{card.codeSnippet}</code>
                  </pre>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4 relative z-10">
                  {card.stats.map((stat, idx) => (
                    <div key={idx} className="neu-input-bar p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400 font-medium">{stat.label}</div>
                      <div className={`text-xs font-bold font-mono mt-0.5 ${card.accentColor}`}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
