"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Database, ShieldCheck, Zap } from "lucide-react";

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            if (onComplete) onComplete();
          }, 200);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18) + 12;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] bg-[#161822] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Neumorphic Loading Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="neu-panel p-8 rounded-3xl flex flex-col items-center gap-6 max-w-sm w-full border border-white/5 relative overflow-hidden"
          >
            {/* Glowing Ambient Backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

            {/* Assembling Logo Icon */}
            <div className="relative w-16 h-16 rounded-2xl neu-panel flex items-center justify-center shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border border-blue-400/20"
              />
              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight">Ask My Docs</h2>
              <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase">
                Initializing RAG System...
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full space-y-2">
              <div className="w-full h-2.5 neu-input-bar rounded-full overflow-hidden p-0.5 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Loading Embeddings</span>
                <span className="text-blue-400 font-bold">{progress}%</span>
              </div>
            </div>

            {/* Sub-status indicators */}
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-2">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-blue-400" />
                32.2k vectors
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Grounding Check
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
