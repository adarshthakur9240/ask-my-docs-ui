"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Sparkles,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Send,
  ChevronDown,
  ChevronUp,
  Database,
  Cpu,
  Layers,
  Zap,
  RefreshCw,
  Bot,
  User,
  ExternalLink,
  ArrowRight,
  Clock,
  BookOpen,
} from "lucide-react";

// --- Types ---
interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: string[];
  grounded?: boolean;
  latency_ms?: number;
  timestamp: string;
}

interface PipelineStats {
  total_vectors: number;
  embedding_model: string;
  llm_model: string;
  reranker_model: string;
}

// --- Neumorphic 3D Tilt Card Component ---
function TiltCard({
  children,
  className = "",
  maxTilt = 5,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setMousePos({ x: mouseX, y: mouseY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative perspective-1000 ${className}`}
    >
      {/* Specular sheen spot following cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-10"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 70%)`,
        }}
      />
      <div className="relative z-0 h-full w-full">{children}</div>
    </motion.div>
  );
}

// --- Pipeline Architecture Nodes ---
const PIPELINE_NODES = [
  { id: "query", label: "1. Query", desc: "User input", icon: Sparkles },
  { id: "retrieve", label: "2. Retrieve", desc: "Top-20 ChromaDB", icon: Database },
  { id: "rerank", label: "3. Rerank", desc: "Top-5 Cross-Encoder", icon: Layers },
  { id: "generate", label: "4. Generate", desc: "Ollama Llama3.2", icon: Cpu },
  { id: "self_check", label: "5. Self-Check", desc: "Grounding Judge", icon: CheckCircle2 },
  { id: "answer", label: "6. Answer", desc: "Verified Response", icon: Zap },
];

const SAMPLE_QUESTIONS = [
  "How do I add memory to a LangGraph agent?",
  "What are checkpointers used for in LangGraph?",
  "How do I stream events from a LangGraph workflow?",
  "What is short-term memory in LangChain?",
  "What is LCEL?",
];

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(-1);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch pipeline stats from FastAPI backend
  const fetchStats = async () => {
    setIsStatsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn("Could not fetch pipeline stats:", err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Sequence active node index during loading state
  useEffect(() => {
    if (!isLoading) {
      setActiveNodeIndex(-1);
      return;
    }

    setActiveNodeIndex(0);
    const interval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev < PIPELINE_NODES.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Submit Query
  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || isLoading) return;

    setErrorMsg(null);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.answer,
        sources: data.sources || [],
        grounded: data.grounded ?? true,
        latency_ms: data.latency_ms || 0,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("API error:", err);
      setErrorMsg("Failed to reach API server at http://localhost:8000. Ensure uvicorn is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#171924] text-[#e8eaf0] selection:bg-[#4a9eff]/30 selection:text-white">
      {/* ── Top Header Bar ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full bg-[#1a1d29]/90 backdrop-blur-xl border-b border-[#252938] px-6 lg:px-12 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="neu-icon-btn w-12 h-12 rounded-2xl group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-[#4a9eff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#e8eaf0]">
                Ask My Docs
              </h1>
              <p className="text-xs text-[#94a3b8] font-semibold">
                LangChain &amp; LangGraph RAG Agent
              </p>
            </div>
          </Link>

          {/* Neumorphic Stats Bar */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 overflow-x-auto max-w-full pb-1 sm:pb-0"
          >
            <div className="neu-pill px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs text-[#cbd5e1] font-semibold">
              <div className="neu-icon-btn w-6 h-6 rounded-lg text-xs">
                <Database className="w-3.5 h-3.5 text-[#4a9eff]" />
              </div>
              <span>{stats ? stats.total_vectors.toLocaleString() : "32,273"} vectors</span>
            </div>

            <div className="neu-pill px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs text-[#cbd5e1] font-semibold">
              <div className="neu-icon-btn w-6 h-6 rounded-lg text-xs">
                <Layers className="w-3.5 h-3.5 text-[#4a9eff]" />
              </div>
              <span>{stats ? stats.embedding_model.split("/").pop() : "MiniLM-L6-v2"}</span>
            </div>

            <div className="neu-pill px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs text-[#cbd5e1] font-semibold">
              <div className="neu-icon-btn w-6 h-6 rounded-lg text-xs">
                <Cpu className="w-3.5 h-3.5 text-[#4a9eff]" />
              </div>
              <span>{stats ? stats.llm_model : "ollama/llama3.2"}</span>
            </div>

            <Link
              href="/"
              className="neu-pill px-4 py-2 rounded-2xl flex items-center gap-2 text-xs text-blue-400 font-bold hover:text-blue-300 transition-all border border-blue-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>← Back to Overview</span>
            </Link>

            <button
              onClick={fetchStats}
              disabled={isStatsLoading}
              title="Refresh stats"
              className="neu-icon-btn w-10 h-10 rounded-2xl hover:text-[#60a5fa] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isStatsLoading ? "animate-spin text-[#4a9eff]" : ""}`} />
            </button>
          </motion.div>
        </div>
      </header>

      {/* ── Main Container ────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pt-10 pb-40 flex flex-col gap-10">
        {/* Pipeline Architecture Accordion */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <TiltCard className="rounded-[2.5rem]">
            <div className="neu-panel rounded-[2.5rem] p-8 sm:p-10 transition-all">
              <button
                onClick={() => setIsPipelineOpen(!isPipelineOpen)}
                className="w-full flex items-center justify-between text-left font-bold text-[#e8eaf0] text-base cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="neu-icon-btn w-10 h-10 rounded-2xl">
                    <Layers className="w-5 h-5 text-[#4a9eff]" />
                  </div>
                  <span>Pipeline Architecture &amp; Execution Flow</span>
                  {isLoading && (
                    <span className="neu-pill px-3 py-1 rounded-full text-xs text-[#4a9eff] font-bold animate-pulse">
                      Processing step {activeNodeIndex + 1}/6…
                    </span>
                  )}
                </div>
                <div className="neu-icon-btn w-9 h-9 rounded-xl">
                  {isPipelineOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#94a3b8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isPipelineOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 mt-6 border-t border-[#2d3245]">
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {PIPELINE_NODES.map((node, i) => {
                          const Icon = node.icon;
                          const isActive = isLoading && activeNodeIndex === i;
                          const isDone = isLoading && activeNodeIndex > i;

                          return (
                            <div
                              key={node.id}
                              className={`relative p-5 rounded-2xl flex flex-col justify-between transition-all ${
                                isActive
                                  ? "neu-button-primary font-bold shadow-[0_0_20px_rgba(74,158,255,0.4)]"
                                  : isDone
                                  ? "neu-panel bg-[#162824] border border-[#34d399]/30 text-[#e8eaf0]"
                                  : "neu-card-interactive text-[#e8eaf0]"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div
                                  className={`neu-icon-btn w-9 h-9 rounded-xl ${
                                    isActive
                                      ? "bg-[#4a9eff] text-white animate-bounce shadow-none border-none"
                                      : isDone
                                      ? "bg-[#18342c] text-[#34d399]"
                                      : ""
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                {isDone && <CheckCircle2 className="w-4 h-4 text-[#34d399]" />}
                              </div>

                              <div>
                                <div className="text-xs font-bold text-[#e8eaf0] leading-tight mb-1">
                                  {node.label}
                                </div>
                                <div className="text-[11px] text-[#94a3b8] font-semibold truncate">
                                  {node.desc}
                                </div>
                              </div>

                              {/* Traveling pulse line connector */}
                              {i < PIPELINE_NODES.length - 1 && (
                                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-[#2a2f42] z-10">
                                  {isActive && <div className="h-full bg-[#4a9eff] animate-pulse-particle" />}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-xs text-[#94a3b8] text-center mt-6 font-semibold leading-relaxed">
                        StateGraph pipeline: Hybrid retrieval (top-20) → Cross-Encoder rerank (top-5) → Llama3.2 generation → Grounding self-check → Verified answer.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TiltCard>
        </motion.div>

        {/* Error Banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="neu-panel bg-[#2c1d22] border border-[#f87171]/30 text-[#fca5a5] p-6 rounded-3xl flex items-center justify-between gap-4 font-semibold"
          >
            <div className="flex items-center gap-3.5">
              <div className="neu-icon-btn w-10 h-10 rounded-xl text-[#f87171]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs text-[#fca5a5] hover:text-white underline font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Welcome Screen / Empty State Card */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center my-auto"
          >
            <TiltCard className="max-w-2xl w-full rounded-[2.5rem]">
              <div className="neu-panel rounded-[2.5rem] p-10 sm:p-12 flex flex-col items-center">
                <div className="neu-icon-btn w-20 h-20 rounded-3xl mb-6 text-[#4a9eff] shadow-[8px_8px_20px_rgba(10,12,18,0.7),-6px_-6px_16px_rgba(255,255,255,0.04)]">
                  <BookOpen className="w-10 h-10" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#e8eaf0] mb-3 tracking-tight">
                  Welcome to Ask My Docs
                </h2>
                <p className="text-sm sm:text-base text-[#94a3b8] font-semibold leading-relaxed mb-8 max-w-lg">
                  Query the official LangChain &amp; LangGraph documentation with a production RAG pipeline featuring cross-encoder reranking and strict self-check grounding verification.
                </p>

                <div className="w-full text-left">
                  <div className="text-xs font-bold text-[#94a3b8] tracking-widest uppercase mb-4 px-1">
                    Try a sample question:
                  </div>

                  <div className="flex flex-col gap-3">
                    {SAMPLE_QUESTIONS.map((sq, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01, x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(sq)}
                        className="neu-card-interactive px-6 py-4 rounded-2xl text-sm font-semibold text-[#e8eaf0] text-left flex items-center justify-between group cursor-pointer"
                      >
                        <span className="leading-relaxed">{sq}</span>
                        <div className="neu-icon-btn w-8 h-8 rounded-xl opacity-80 group-hover:opacity-100 group-hover:text-[#60a5fa] transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Bot Avatar */}
                {msg.role === "bot" && (
                  <div className="neu-icon-btn w-12 h-12 rounded-2xl flex-shrink-0">
                    <Bot className="w-6 h-6 text-[#4a9eff]" />
                  </div>
                )}

                {/* Bubble Container */}
                <TiltCard className="max-w-[88%] sm:max-w-[80%] rounded-[2.5rem]">
                  <div
                    className={`rounded-[2.5rem] p-8 ${
                      msg.role === "user"
                        ? "neu-panel bg-gradient-to-r from-[#2a3044] to-[#222736] text-[#e8eaf0]"
                        : "neu-panel text-[#e8eaf0]"
                    }`}
                  >
                    {/* Header Line for Bot */}
                    {msg.role === "bot" && (
                      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2d3245] text-xs font-semibold">
                        <div className="flex items-center gap-3">
                          {msg.grounded ? (
                            <span className="neu-badge-grounded px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                              Grounded ✓
                            </span>
                          ) : (
                            <span className="neu-badge-fallback px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-bold">
                              <AlertTriangle className="w-4 h-4 text-[#fbbf24]" />
                              Not confident (fallback) ⚠️
                            </span>
                          )}
                        </div>

                        {msg.latency_ms !== undefined && (
                          <div className="neu-pill px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs text-[#94a3b8] font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#4a9eff]" />
                            <span>{msg.latency_ms} ms</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-semibold text-[#e8eaf0]">
                      {msg.content}
                    </div>

                    {/* Source Pills (for Bot messages) */}
                    {msg.role === "bot" && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-[#2d3245]">
                        <div className="text-xs font-bold text-[#94a3b8] tracking-widest uppercase mb-3 flex items-center gap-2">
                          <div className="neu-icon-btn w-6 h-6 rounded-lg text-xs">
                            <Link2 className="w-3.5 h-3.5 text-[#4a9eff]" />
                          </div>
                          <span>Sources:</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {msg.sources.map((src, sIdx) => {
                            const title = src.split("/").pop() || "doc-source";
                            return (
                              <motion.a
                                key={sIdx}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                href={src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="neu-pill px-4 py-2 rounded-xl text-xs font-semibold text-[#4a9eff] hover:text-[#60a5fa] flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <div className="neu-icon-btn w-5 h-5 rounded-lg text-xs">
                                  <ExternalLink className="w-3 h-3 text-[#4a9eff]" />
                                </div>
                                <span>{title}</span>
                              </motion.a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </TiltCard>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="neu-icon-btn w-12 h-12 rounded-2xl flex-shrink-0">
                    <User className="w-6 h-6 text-[#4a9eff]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 justify-start"
            >
              <div className="neu-icon-btn w-12 h-12 rounded-2xl flex-shrink-0 animate-pulse">
                <Bot className="w-6 h-6 text-[#4a9eff]" />
              </div>
              <TiltCard className="max-w-[70%] rounded-[2.5rem]">
                <div className="neu-panel p-6 rounded-[2.5rem] flex items-center gap-4">
                  <div className="neu-icon-btn w-8 h-8 rounded-xl">
                    <div className="w-4 h-4 rounded-full border-2 border-[#4a9eff] border-t-transparent animate-spin" />
                  </div>
                  <span className="text-sm font-bold text-[#e8eaf0]">
                    {PIPELINE_NODES[Math.max(0, activeNodeIndex)]?.label || "Processing pipeline…"}
                  </span>
                </div>
              </TiltCard>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ── Floating Input Bar ────────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 px-6 pb-8 pt-4 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <TiltCard className="rounded-[2.5rem]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="neu-input-bar rounded-[2.5rem] p-3 flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about LangChain or LangGraph…"
                disabled={isLoading}
                className="flex-1 bg-transparent px-6 py-4 text-base text-[#e8eaf0] placeholder-[#64748b] focus:outline-none font-semibold"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                disabled={!input.trim() || isLoading}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  input.trim() && !isLoading
                    ? "neu-button-primary cursor-pointer"
                    : "neu-panel text-[#475569] cursor-not-allowed"
                }`}
              >
                <Send className="w-6 h-6" />
              </motion.button>
            </form>
          </TiltCard>
        </div>
      </footer>
    </div>
  );
}
