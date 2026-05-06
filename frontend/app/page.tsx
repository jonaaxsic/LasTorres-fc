"use client";

import { Navbar } from "@/components/navbar";
import { HeroCarousel } from "@/components/hero-carousel";
import { StatsSection } from "@/components/stats-section";
import { NewsSection } from "@/components/news-section";
import { MatchesSection } from "@/components/matches-section";
import { SectionCards } from "@/components/section-cards";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      
      <ScrollReveal distance={25}>
        <StatsSection />
      </ScrollReveal>
      
      <div className="h-1 bg-gradient-to-b from-[#0a0a0a] to-[#2a2a2a] opacity-30" />
      
      <ScrollReveal delay={0.05} distance={20}>
        <NewsSection />
      </ScrollReveal>
      
      <div className="h-1 bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] opacity-30" />
      
      <ScrollReveal delay={0.05} distance={20}>
        <MatchesSection />
      </ScrollReveal>
      
      <div className="h-2 bg-gradient-to-b from-[#0a0a0a] to-[#2a2a2a] opacity-50" />
      
      <ScrollReveal delay={0.05} distance={20}>
        <SectionCards />
      </ScrollReveal>
      
      <div className="h-2 bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] opacity-50" />
      
      <ScrollReveal delay={0.05} distance={20}>
        <CTASection />
      </ScrollReveal>
      
      <Footer />
    </main>
  );
}