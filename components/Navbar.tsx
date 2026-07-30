"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Menu, X, Database, Layers, Cpu, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Comparison", href: "#comparison" },
    { name: "RAG Pipeline", href: "#pipeline" },
    { name: "Self-Check Grounding", href: "#grounding" },
    { name: "Tech Stack", href: "#techstack" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300 pointer-events-none">
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            height: scrolled ? 54 : 66,
            paddingLeft: scrolled ? 20 : 28,
            paddingRight: scrolled ? 16 : 24,
            width: scrolled ? "min(92%, 1100px)" : "min(96%, 1240px)",
          }}
          transition={{ type: "spring" as const, stiffness: 260, damping: 25 }}
          className={`pointer-events-auto flex items-center justify-between rounded-full border border-white/[0.06] transition-all duration-300 ${
            scrolled
              ? "bg-[#1e2230]/90 backdrop-blur-xl shadow-[10px_10px_30px_rgba(10,12,18,0.7),-6px_-6px_20px_rgba(255,255,255,0.03)]"
              : "bg-[#222737]/70 backdrop-blur-md shadow-[8px_8px_24px_rgba(10,12,18,0.5),-6px_-6px_18px_rgba(255,255,255,0.02)]"
          }`}
        >
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full neu-icon-btn group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Ask My Docs
                <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  RAG v2
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links Center */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#191c28]/60 p-1.5 rounded-full border border-white/[0.03] shadow-[inset_3px_3px_8px_rgba(10,12,18,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.02)]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="neu-button-primary hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 active:scale-95"
            >
              <span>Try it live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden neu-icon-btn w-9 h-9 rounded-full"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Fullscreen Animated Circular Clip-Path Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#161823]/95 backdrop-blur-2xl flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
              <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2">
                Navigation
              </span>
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + idx * 0.08 }}
                  className="text-2xl font-bold text-slate-100 hover:text-blue-400 flex items-center justify-between border-b border-white/5 pb-4"
                >
                  {link.name}
                  <ArrowRight className="w-5 h-5 text-slate-500" />
                </motion.a>
              ))}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="pt-6"
              >
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="neu-button-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold shadow-lg"
                >
                  <span>Explore Live Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
