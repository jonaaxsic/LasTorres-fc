"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsForm } from "@/components/admin/news-form";
import { ArrowLeft, Newspaper } from "lucide-react";
import Link from "next/link";

export default function NuevaNoticiaPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/noticias">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Noticias
          </Button>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">
            <Newspaper className="w-3 h-3 mr-1" />
            Nueva Noticia
          </Badge>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
          Crear Noticia
        </h1>
        <p className="text-muted-foreground mt-1">
          Completa los campos para publicar una nueva noticia
        </p>
      </div>

      <NewsForm />
    </div>
  );
}
