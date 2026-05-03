"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { newsApi, News } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      setNews(sorted.slice(0, 5));
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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 240 + 16; // w-60 + gap-4
      scrollRef.current.scrollBy({ left: direction === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
    }
  };

  // Drag handlers para sliding suave
  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    if (scrollRef.current) {
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - startX;
    scrollRef.current.scrollLeft = scrollLeft - x;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-60 md:w-80">
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
          {/* Botón izq */}
          <button 
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-card/95 border border-border/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {/* Botón der */}
          <button 
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-card/95 border border-border/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Cards con drag suave */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-10 md:px-12 py-2 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {news.map((item) => (
              <Link 
                key={item.id} 
                href={`/noticias/${item.id}`}
                className="flex-shrink-0 w-60 md:w-80"
              >
                <div className="h-full rounded-xl overflow-hidden bg-card border border-border/10 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300">
                  <div className="relative h-36 md:h-48 w-full overflow-hidden">
                    {item.imagen_url ? (
                      <img
                        src={item.imagen_url}
                        alt={item.titulo}
                        className="w-full h-full object-cover"
                      />
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}