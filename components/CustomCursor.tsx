"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<"link" | "button" | "card" | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setReducedMotion(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, input, [role='button'], [data-cursor]");
      if (interactive) {
        setIsHovered(true);
        const cursorAttr = interactive.getAttribute("data-cursor");
        if (cursorAttr === "card") {
          setHoverType("card");
        } else if (interactive.tagName === "BUTTON") {
          setHoverType("button");
        } else {
          setHoverType("link");
        }
      } else {
        setIsHovered(false);
        setHoverType(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.body.classList.add("custom-cursor-active");

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (reducedMotion || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Inner Glowing Core Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]"
        style={{
          x: cursorX,
          y: cursorY,
          width: isHovered ? 10 : 8,
          height: isHovered ? 10 : 8,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Outer Morphing Neumorphic Ring */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full border border-blue-400/40 backdrop-blur-[1px] transition-colors duration-200 ${
          isHovered
            ? hoverType === "button"
              ? "bg-blue-500/15 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.4)]"
              : hoverType === "card"
              ? "bg-indigo-500/10 border-indigo-400/60 shadow-[0_0_24px_rgba(129,140,248,0.3)]"
              : "bg-blue-400/10 border-cyan-300 shadow-[0_0_16px_rgba(56,189,248,0.4)]"
            : "bg-transparent shadow-[0_0_8px_rgba(59,130,246,0.15)]"
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? (hoverType === "card" ? 64 : 48) : 32,
          height: isHovered ? (hoverType === "card" ? 64 : 48) : 32,
          borderRadius: isHovered && hoverType === "card" ? "16px" : "9999px",
        }}
        transition={{ type: "spring" as const, damping: 24, stiffness: 300 }}
      />
    </div>
  );
}
