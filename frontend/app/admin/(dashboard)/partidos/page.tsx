"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { matchesApi, Match } from "@/lib/api";
import { MATCH_STATUS_LABELS, CATEGORIES } from "@/lib/types";
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
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-500",
  live: "bg-green-500/10 text-green-500",
  finished: "bg-muted text-muted-foreground",
  postponed: "bg-amber-500/10 text-amber-500",
};

export default function PartidosPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    const { data, error } = await matchesApi.getAll();
    if (data) {
      // Sort by date, most recent first
      const sorted = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setMatches(sorted);
    } else if (error) {
      toast.error("Error al cargar partidos");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const { error } = await matchesApi.delete(deleteId);

    if (error) {
      toast.error("Error al eliminar el partido");
    } else {
      toast.success("Partido eliminado correctamente");
      setMatches(matches.filter((m) => m.id !== deleteId));
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
              <Trophy className="w-3 h-3 mr-1" />
              Gestión de Partidos
            </Badge>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
            Partidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los partidos del club
          </p>
        </div>
        <Link href="/admin/partidos/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Partido
          </Button>
        </Link>
      </div>

      {/* Matches List */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyIcon>
                <Trophy className="w-10 h-10" />
              </EmptyIcon>
              <EmptyTitle>No hay partidos</EmptyTitle>
              <EmptyDescription>
                Crea tu primer partido para mostrarlo en el calendario.
              </EmptyDescription>
              <Link href="/admin/partidos/nuevo">
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Partido
                </Button>
              </Link>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Match Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusColors[match.status]}>
                        {MATCH_STATUS_LABELS[match.status]}
                      </Badge>
                      <Badge variant="outline">{match.category}</Badge>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">LT</span>
                        </div>
                        <span className="font-semibold">Las Torres</span>
                      </div>

                      {match.status === "finished" ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-muted">
                          <span className="font-bold text-lg">
                            {match.is_home ? match.home_score : match.away_score}
                          </span>
                          <span className="text-muted-foreground">-</span>
                          <span className="font-bold text-lg">
                            {match.is_home ? match.away_score : match.home_score}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">vs</span>
                      )}

                      <div className="flex items-center gap-2">
                        {match.opponent_logo ? (
                          <img
                            src={match.opponent_logo}
                            alt={match.opponent}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {match.opponent.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-semibold">{match.rival}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(match.fecha).toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {match.hora}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {match.lugar}
                        {match.es_local && " (Local)"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/admin/partidos/${match.id}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(match.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
            <AlertDialogTitle>¿Eliminar partido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El partido será eliminado permanentemente.
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
