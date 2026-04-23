import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/breadcrumb";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getNews(id: number) {
  const res = await fetch(`${API_URL}/api/noticias/${id}`, { 
    cache: "no-store" 
  });
  if (!res.ok) return null;
  return res.json();
}

interface Props {
  params: Promise<{ id: string }>;
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

export default async function NoticiaDetailPage({ params }: Props) {
  const { id } = await params;
  const news = await getNews(parseInt(id));

  if (!news) {
    notFound();
  }

  const titulo = news.titulo || news.title || "Sin título";
  const contenido = news.contenido || news.content || "";
  const imagenUrl = news.image_url || news.imagen_url || null;
  const fecha = news.fecha_publicacion || news.created_at || "";

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Breadcrumb />
          
          <div className="mb-6">
            <Badge variant="outline" className="mb-3">
              Noticia
            </Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {titulo}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(fecha)}</span>
          </div>

          {imagenUrl && (
            <div className="relative w-full aspect-video mb-8">
              <Image
                src={imagenUrl}
                alt={titulo}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          <article className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {contenido}
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}