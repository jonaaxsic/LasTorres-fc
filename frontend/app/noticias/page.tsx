"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { newsApi, News } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { NewsSlider } from "@/components/news-slider";
import { Skeleton } from "@/components/ui/skeleton";

export default function NoticiasPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    newsApi.getAll().then(({ data }) => {
      setNews(data || []);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />
          <div className="mb-6">
            <Badge variant="outline" className="mb-3">Noticias</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Todas las Noticias
            </h1>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-card">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-5">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NewsSlider news={news} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}