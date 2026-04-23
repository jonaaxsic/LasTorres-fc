"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { newsApi, News } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import {
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  Star,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function NoticiasPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    const { data, error } = await newsApi.getAll();
    if (data) {
      setNews(data);
    } else if (error) {
      toast.error("Error al cargar noticias");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const { error } = await newsApi.delete(deleteId);

    if (error) {
      toast.error("Error al eliminar la noticia");
    } else {
      toast.success("Noticia eliminada correctamente");
      setNews(news.filter((n) => n.id !== deleteId));
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              <Newspaper className="w-3 h-3 mr-1" />
              Gestión de Contenido
            </Badge>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
            Noticias
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las noticias del club
          </p>
        </div>
        <Link href="/admin/noticias/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Noticia
          </Button>
        </Link>
      </div>

      {/* News List */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : news.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyIcon>
                <Newspaper className="w-10 h-10" />
              </EmptyIcon>
              <EmptyTitle>No hay noticias</EmptyTitle>
              <EmptyDescription>
                Crea tu primera noticia para mostrarla en el sitio web.
              </EmptyDescription>
              <Link href="/admin/noticias/nueva">
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Noticia
                </Button>
              </Link>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {news.map((item) => (
            <Card key={item.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Image */}
                  {item.image_url ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Newspaper className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          {item.featured && (
                            <Badge variant="secondary" className="shrink-0">
                              <Star className="w-3 h-3 mr-1" />
                              Destacada
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {item.content}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(item.created_at).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/admin/noticias/${item.id}`}>
                          <Button variant="outline" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La noticia será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
