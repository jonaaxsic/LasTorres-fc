"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { eventsApi, Event } from "@/lib/api";
import { EVENT_TYPE_LABELS } from "@/lib/types";
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
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Clock,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

const typeColors: Record<string, string> = {
  evento: "bg-blue-500/10 text-blue-500",
  entrenamiento: "bg-green-500/10 text-green-500",
  bingo: "bg-amber-500/10 text-amber-500",
  reunion: "bg-purple-500/10 text-purple-500",
  otro: "bg-muted text-muted-foreground",
};

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    const { data, error } = await eventsApi.getAll();
    if (data) {
      const sorted = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setEvents(sorted);
    } else if (error) {
      toast.error("Error al cargar eventos");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const { error } = await eventsApi.delete(deleteId);

    if (error) {
      toast.error("Error al eliminar el evento");
    } else {
      toast.success("Evento eliminado correctamente");
      setEvents(events.filter((e) => e.id !== deleteId));
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
              <Calendar className="w-3 h-3 mr-1" />
              Gestión de Eventos
            </Badge>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
            Eventos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los eventos del club
          </p>
        </div>
        <Link href="/admin/eventos/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Evento
          </Button>
        </Link>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyIcon>
                <Calendar className="w-10 h-10" />
              </EmptyIcon>
              <EmptyTitle>No hay eventos</EmptyTitle>
              <EmptyDescription>
                Crea tu primer evento para mostrarlo en el calendario.
              </EmptyDescription>
              <Link href="/admin/eventos/nuevo">
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Evento
                </Button>
              </Link>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <Card key={event.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Image */}
                  {event.image_url ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={typeColors[event.event_type]}>
                            {EVENT_TYPE_LABELS[event.event_type]}
                          </Badge>
                        </div>
                        <h3 className="font-semibold truncate mb-1">{event.titulo}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {event.descripcion}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.fecha).toLocaleDateString("es-ES", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.hora}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.lugar}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/admin/eventos/${event.id}`}>
                          <Button variant="outline" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(event.id)}
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
            <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El evento será eliminado permanentemente.
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
