"use client";

// LF-API: https://lastorresfc-api.vercel.app
import { Navbar } from "@/components/navbar";
import { HeroCarousel } from "@/components/hero-carousel";
import { StatsSection } from "@/components/stats-section";
import { NewsSection } from "@/components/news-section";
import { MatchesSection } from "@/components/matches-section";
import { SectionCards } from "@/components/section-cards";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <StatsSection />
      
      <div className="h-1 bg-gradient-to-b from-[#0a0a0a] to-[#2a2a2a] opacity-30" />
      
      <NewsSection />
      
      <div className="h-1 bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] opacity-30" />
      
      <MatchesSection />
      
      <div className="h-2 bg-gradient-to-b from-[#0a0a0a] to-[#2a2a2a] opacity-50" />
      
      <SectionCards />
      
      <div className="h-2 bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] opacity-50" />
      
      <CTASection />

      <Footer />
    </main>
  );
}