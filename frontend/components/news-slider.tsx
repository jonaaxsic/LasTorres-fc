"use client";

import { useState, useEffect } from "react";
import { News } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NewsSliderProps {
  news: News[];
}

const ITEMS_PER_PAGE = 9;
const ITEMS_PER_ROW = 3;

export function NewsSlider({ news }: NewsSliderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Ordenar noticias por fecha (más recientes primero)
  const sortedNews = [...news].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  const itemsPerPage = isMobile ? 6 : ITEMS_PER_PAGE;
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = sortedNews.slice(startIndex, endIndex);

  if (news.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No hay noticias disponibles.</p>
        <Link href="/admin/noticias/nueva">
          <Button variant="link">Crear primera noticia</Button>
        </Link>
      </div>
    );
  }

  // Mobile: grid vertical con paginación
  if (isMobile) {
    return (
      <MobileNewsGrid 
        news={sortedNews} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        currentNews={currentNews}
      />
    );
  }

  // Desktop: grid con navegación de páginas
  return (
    <div>
      {/* Grid de noticias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentNews.map((item: News) => (
          <Link key={item.id} href={`/noticias/${item.id}`} className="block">
            <div className="h-full bg-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Imagen */}
              <div className="relative aspect-video w-full">
                {item.image_url ? (
                  <>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card via-card/80 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Sin imagen</span>
                  </div>
                )}
              </div>
              
              {/* Contenido */}
              <div className="p-5">
                <Badge className="w-fit mb-3 text-xs font-medium bg-primary text-white">
                  {item.featured ? "Destacada" : "Noticia"}
                </Badge>
                
                <h2 className="font-heading font-bold text-lg line-clamp-2 mb-3">
                  {item.title}
                </h2>
                
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {item.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <CalendarDays className="w-3 h-3" />
                    <span>{new Date(item.created_at).toLocaleDateString("es-CL")}</span>
                  </div>
                  
                  <span className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                    Leer noticia <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Paginación Desktop */}
      {totalPages > 1 && (
        <>
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      className="h-9 w-9 min-w-[36px]"
                    >
                      {page}
                    </Button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-1 text-muted-foreground">...</span>;
                }
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-center text-muted-foreground text-sm mt-3">
            Mostrando {startIndex + 1}-{Math.min(endIndex, sortedNews.length)} de {sortedNews.length} noticias
          </p>
        </>
      )}
    </div>
  );
}

// Mobile Grid Component
function MobileNewsGrid({ 
  news, 
  currentPage, 
  setCurrentPage, 
  totalPages,
  currentNews 
}: { 
  news: News[];
  currentPage: number;
  setCurrentPage: (p: number) => void;
  totalPages: number;
  currentNews: News[];
}) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        {currentNews.map((item: News) => (
          <Link key={item.id} href={`/noticias/${item.id}`} className="block">
            <div className="h-full bg-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative aspect-video w-full">
                {item.image_url ? (
                  <>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card via-card/80 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Sin imagen</span>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <Badge className="w-fit mb-3 text-xs font-medium bg-primary text-white">
                  {item.featured ? "Destacada" : "Noticia"}
                </Badge>
                
                <h2 className="font-heading font-bold text-lg line-clamp-2 mb-3">
                  {item.title}
                </h2>
                
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {item.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <CalendarDays className="w-3 h-3" />
                    <span>{new Date(item.created_at).toLocaleDateString("es-CL")}</span>
                  </div>
                  
                  <span className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                    Leer noticia <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground px-3">
            {currentPage} / {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}