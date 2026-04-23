"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { newsApi, News } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowRight, Newspaper } from "lucide-react";

// Fallback data for when API is unavailable
const fallbackNews = [
  {
    id: 1,
    title: "Victoria histórica ante el clásico rival",
    content: "El equipo logró una victoria contundente 3-1 en el partido más esperado de la temporada.",
    image_url: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/img-05.jpeg",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Inscripciones abiertas para la temporada",
    content: "Ya puedes inscribir a los más pequeños en nuestra escuela de fútbol.",
    image_url: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/img-04.jpeg",
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Nuevo refuerzo para el mediocampo",
    content: "El club anuncia la incorporación de un talentoso mediocampista.",
    image_url: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/img-13.jpeg",
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Cena anual del club confirmada",
    content: "Reserva tu lugar para la tradicional cena de fin de temporada.",
    image_url: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc18.jpg",
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    const { data, error } = await newsApi.getAll();
    
    if (data && data.length > 0) {
      // Sort by date and get latest 4
      const sorted = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setNews(sorted.slice(0, 4));
    } else {
      // Use fallback data if API fails or returns empty
      setNews(fallbackNews);
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

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <Badge variant="outline" className="mb-4">Actualidad</Badge>
              <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
                Últimas Noticias
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="aspect-[4/3] lg:aspect-[4/5] w-full rounded-lg" />
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  const featuredNews = news.find((n) => n.featured) || news[0];
  const regularNews = news.filter((n) => n.id !== featuredNews.id).slice(0, 3);

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <Badge variant="outline" className="mb-4">Actualidad</Badge>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
              Últimas Noticias
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/noticias" className="gap-2">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured News - sin Card para evitar borde gris */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            {featuredNews.image_url ? (
              <img
                src={featuredNews.image_url}
                alt={featuredNews.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                <Newspaper className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              {featuredNews.featured && (
                <Badge className="mb-2 bg-primary">Destacado</Badge>
              )}
              <h3 className="font-heading text-xl font-bold text-white mb-1 line-clamp-1">
                {featuredNews.title}
              </h3>
              <p className="text-white/70 text-sm line-clamp-1">{featuredNews.content}</p>
              <div className="flex items-center gap-2 text-white/60 text-xs mt-1">
                <CalendarDays className="w-3 h-3" />
                {formatDate(featuredNews.created_at)}
              </div>
            </div>
          </div>

          {/* Regular News - sin borde */}
          <div className="flex flex-col gap-4">
            {regularNews.map((item) => (
              <Link key={item.id} href={`/noticias/${item.id}`} className="block">
                <div className="flex flex-row overflow-hidden rounded-xl bg-card">
                  <div className="w-24 sm:w-32 h-20 sm:h-24 flex-shrink-0 relative">
                    {item.image_url ? (
                      <>
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/50 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-3 min-w-0">
                    <Badge variant="secondary" className="text-xs w-fit mb-1">
                      {item.featured ? "Destacada" : "Noticia"}
                    </Badge>
                    <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                      <CalendarDays className="w-3 h-3" />
                      {formatDate(item.created_at)}
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
