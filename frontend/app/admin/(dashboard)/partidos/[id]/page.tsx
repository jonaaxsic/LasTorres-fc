"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { matchesApi, Match } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchForm } from "@/components/admin/match-form";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditarPartidoPage() {
  const params = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatch();
  }, [params.id]);

  const loadMatch = async () => {
    const id = Number(params.id);
    if (isNaN(id)) {
      toast.error("ID de partido inválido");
      return;
    }

    setIsLoading(true);
    const { data, error } = await matchesApi.getById(id);

    if (data) {
      setMatch(data);
    } else {
      toast.error(error || "Partido no encontrado");
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
            <Skeleton className="h-48 w-full mb-6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <p className="text-muted-foreground mb-4">Partido no encontrado</p>
        <Link href="/admin/partidos">
          <Button>Volver a Partidos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/partidos">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Partidos
          </Button>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">
            <Trophy className="w-3 h-3 mr-1" />
            Editar Partido
          </Badge>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
          vs {match.opponent}
        </h1>
        <p className="text-muted-foreground mt-1">
          Modifica los campos para actualizar el partido
        </p>
      </div>

      <MatchForm initialData={match} isEditing />
    </div>
  );
}
