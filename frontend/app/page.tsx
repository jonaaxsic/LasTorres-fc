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
      <NewsSection />
      <MatchesSection />
      <SectionCards />
      <CTASection />
      <Footer />
    </main>
  );
}
