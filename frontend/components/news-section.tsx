"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { newsApi, News } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const CARD_WIDTH = 288;   // w-72 = 18rem
const CARD_GAP = 16;      // gap-4

export function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    const { data } = await newsApi.getAll();
    if (data && data.length > 0) {
      const sorted = data.sort(
        (a, b) => new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime()
      );
      setNews(sorted.slice(0, 10));
    }
    setIsLoading(false);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -(CARD_WIDTH + CARD_GAP) : CARD_WIDTH + CARD_GAP;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  // Track active slide on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (CARD_WIDTH + CARD_GAP));
      setActiveIndex(Math.min(idx, news.length - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [news.length]);

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.children[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 md:py-24 px-4 bg-[#2a2a2a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <Badge variant="outline" className="mb-4">Actualidad</Badge>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
              Últimas Noticias
            </h2>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-72">
                <Skeleton className="h-36 md:h-48 w-full rounded-t-xl" />
                <div className="p-4 bg-card">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="py-12 md:py-24 px-2 md:px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8 px-2">
          <Badge variant="outline" className="mb-4">Actualidad</Badge>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
            Últimas Noticias
          </h2>
        </div>

        <div className="relative group">
          {/* Flecha izquierda — visible siempre en desktop, hover en mobile */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-1 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm
              bg-card/85 border border-border/20 hover:bg-primary hover:text-white hover:scale-105 cursor-pointer
              opacity-0 group-hover:opacity-100 md:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Flecha derecha */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-1 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm
              bg-card/85 border border-border/20 hover:bg-primary hover:text-white hover:scale-105 cursor-pointer
              opacity-0 group-hover:opacity-100 md:opacity-100"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* ⭐ Scroll-snap container: deslizamiento nativo suave con el dedo */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-1 pb-2 news-scrollbar-hidden"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
            }}
          >
            <style>{`
              .news-scrollbar-hidden::-webkit-scrollbar { display: none; }
            `}</style>

            {news.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[85vw] max-w-72"
                style={{ scrollSnapAlign: "start" }}
              >
                <Link href={`/noticias/${item.id}`}>
                  <div className="h-full rounded-xl overflow-hidden bg-card border border-border/10 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300">
                    <div className="relative h-36 md:h-48 w-full overflow-hidden">
                      {item.imagen_url ? (
                        <img src={item.imagen_url} alt={item.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-card">
                      <h3 className="font-heading text-base font-bold line-clamp-2 mb-1 text-foreground">
                        {item.titulo}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {item.contenido}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-border/20">
                        <span className="text-xs text-muted-foreground">
                          {item.fecha_publicacion ? formatDate(item.fecha_publicacion) : ""}
                        </span>
                        <span className="text-xs font-medium text-primary flex items-center gap-1">
                          Ver más <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dots de navegación */}
        <div className="flex justify-center gap-2 mt-6">
          {news.slice(0, 7).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-border/50 hover:bg-border"
              }`}
              aria-label={`Ir a noticia ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
