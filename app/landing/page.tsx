"use client";

import React, { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import LivingBackground from "@/components/LivingBackground";
import HeroSection from "@/components/HeroSection";
import NaiveVsAdvancedSection from "@/components/NaiveVsAdvancedSection";
import PipelineSection from "@/components/PipelineSection";
import SelfCheckSection from "@/components/SelfCheckSection";
import TechStackSection from "@/components/TechStackSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#171924] text-[#e8eaf0] font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Interactive Custom Morphing Cursor */}
      <CustomCursor />

      {/* Branded Fast Preloader Sequence (<1.5s) */}
      <Preloader onComplete={() => setPreloaderComplete(true)} />

      {/* Ambient Particle Mesh Living Background */}
      <LivingBackground />

      {/* Fixed Neumorphic Liquid Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection />
        <NaiveVsAdvancedSection />
        <PipelineSection />
        <SelfCheckSection />
        <TechStackSection />
        <CTASection />
      </main>

      {/* Dark Neumorphic Footer */}
      <Footer />
    </div>
  );
}
