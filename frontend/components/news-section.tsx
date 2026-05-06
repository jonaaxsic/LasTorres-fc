"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { newsApi, News } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const CARD_WIDTH_PX = 288;
const GAP_PX = 16;
const VISIBLE = 3;

export function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    const { data } = await newsApi.getAll();
    
    if (data && data.length > 0) {
      const sorted = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setNews(sorted.slice(0, 10));
    }
    
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Siempre 2 slides fixed (como estaba antes)
  const totalSlides = 2;
  const maxIndex = totalSlides - 1;
  const slideOffset = currentIndex * (CARD_WIDTH_PX + GAP_PX) * VISIBLE;

  const goTo = useCallback((direction: "left" | "right") => {
    if (isTransitioning) return;
    
    let newIndex = currentIndex;
    if (direction === "right") {
      newIndex = Math.min(currentIndex + 1, maxIndex);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    if (newIndex !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 400);
    }
  }, [currentIndex, maxIndex, isTransitioning]);

  const goToIndex = useCallback((index: number) => {
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 400);
    }
  }, [currentIndex, isTransitioning]);

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
          <div className="flex gap-4">
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

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-24 px-2 md:px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8 px-2">
          <Badge variant="outline" className="mb-4">Actualidad</Badge>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
            Últimas Noticias
          </h2>
        </div>

        <div className="relative">
          <button 
            onClick={() => goTo("left")}
            disabled={currentIndex === 0}
            className={`absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm ${
              currentIndex === 0
                ? "bg-card/60 text-muted-foreground/40 cursor-not-allowed"
                : "bg-card/85 border border-border/20 hover:bg-primary hover:text-white hover:scale-105 cursor-pointer"
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => goTo("right")}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm ${
              currentIndex >= maxIndex
                ? "bg-card/60 text-muted-foreground/40 cursor-not-allowed"
                : "bg-card/85 border border-border/20 hover:bg-primary hover:text-white hover:scale-105 cursor-pointer"
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden mx-12 md:mx-16">
            <div 
              ref={containerRef}
              className="flex transition-transform duration-400 ease-out"
              style={{
                transform: `translateX(-${slideOffset}px)`,
                width: "300%"
              }}
            >
              {news.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-72 px-2">
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
                            {formatDate(item.fecha_publicacion)}
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

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-border/50 hover:bg-border"
                }`}
                aria-label={`Ver slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}