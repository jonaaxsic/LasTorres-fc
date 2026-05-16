"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { eventsApi, Event } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EventForm } from "@/components/admin/event-form";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditarEventoPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [params.id]);

  const loadEvent = async () => {
    const id = Number(params.id);
    if (isNaN(id)) {
      toast.error("ID de evento inválido");
      return;
    }

    setIsLoading(true);
    const { data, error } = await eventsApi.getById(id);

    if (data) {
      setEvent(data);
    } else {
      toast.error(error || "Evento no encontrado");
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <p className="text-muted-foreground mb-4">Evento no encontrado</p>
        <Link href="/admin/eventos">
          <Button>Volver a Eventos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/eventos">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Eventos
          </Button>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            Editar Evento
          </Badge>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
          {event.title}
        </h1>
        <p className="text-muted-foreground mt-1">
          Modifica los campos para actualizar el evento
        </p>
      </div>

      <EventForm initialData={event} isEditing />
    </div>
  );
}
