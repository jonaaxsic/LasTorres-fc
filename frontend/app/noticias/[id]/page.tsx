"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { Breadcrumb } from "@/components/breadcrumb";

// Allow dynamic params for static export
export function generateStaticParams() {
  return [];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface News {
  id: number;
  titulo: string;
  contenido: string;
  imagen_url: string;
  imagen_url_2: string;
  fecha_publicacion: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "Fecha no disponible";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Fecha inválida";
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch {
    return "Fecha inválida";
  }
}

export default function NoticiaDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    fetch(`${API_URL}/api/noticias/${id}`)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p>Cargando...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p>Noticia no encontrada</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const titulo = news.titulo || "Sin título";
  const contenido = news.contenido || "";
  const imagenUrl = news.imagen_url || null;
  const imagenUrl2 = news.imagen_url_2 || null;
  const fecha = news.fecha_publicacion || "";

  let texto1 = "";
  let texto2 = "";

  if (imagenUrl2 && contenido.length > 560) {
    const limite = 560;
    let ultimoPunto = -1;
    
    for (let i = 0; i < limite; i++) {
      if (contenido[i] === '.') {
        ultimoPunto = i;
      }
    }
    
    if (ultimoPunto > 0) {
      texto1 = contenido.substring(0, ultimoPunto + 1);
      texto2 = contenido.substring(ultimoPunto + 1);
    } else {
      texto1 = contenido.substring(0, limite);
      texto2 = contenido.substring(limite);
    }
  } else {
    texto1 = contenido;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb />
          
          <article className="mt-8">
            <Badge className="mb-4">Noticias</Badge>
            
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4">
              {titulo}
            </h1>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm">{formatDate(fecha)}</span>
            </div>

            {imagenUrl && (
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden mb-8">
                <Image
                  src={imagenUrl}
                  alt={titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{texto1}</p>
              
              {texto2 && (
                <>
                  {imagenUrl2 && (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden my-8">
                      <Image
                        src={imagenUrl2}
                        alt={`${titulo} - imagen 2`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      />
                    </div>
                  )}
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{texto2}</p>
                </>
              )}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}