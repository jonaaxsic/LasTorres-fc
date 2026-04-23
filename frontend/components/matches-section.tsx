"use client";

import { useEffect, useState } from "react";
import { matchesApi, Match } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, MapPin, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

// Fallback data for when API is unavailable
const fallbackUpcoming = [
  {
    id: 1,
    rival: "Deportivo Norte",
    logo_rival: "",
    fecha: "2026-04-27",
    hora: "16:00",
    lugar: "Estadio Las Torres",
    marca_local: undefined,
    marca_visitante: undefined,
    es_local: true,
    categoria: "Primera",
    estado: "programado",
  },
  {
    id: 2,
    rival: "Club Atlético Sur",
    logo_rival: "",
    fecha: "2026-05-04",
    hora: "18:30",
    lugar: "Estadio Municipal",
    marca_local: undefined,
    marca_visitante: undefined,
    es_local: false,
    categoria: "Primera",
    estado: "programado",
  },
];

const fallbackResults = [
  {
    id: 3,
    rival: "FC Rivadavia",
    logo_rival: "",
    fecha: "2026-04-20",
    hora: "16:00",
    lugar: "Estadio Las Torres",
    marca_local: 3,
    marca_visitante: 1,
    es_local: true,
    categoria: "Primera",
    estado: "finalizado",
  },
  {
    id: 4,
    rival: "Unión FC",
    logo_rival: "",
    fecha: "2026-04-13",
    hora: "18:00",
    lugar: "Estadio Unión",
    marca_local: 1,
    marca_visitante: 1,
    es_local: false,
    categoria: "Primera",
    estado: "finalizado",
  },
];

export function MatchesSection() {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    const { data, error } = await matchesApi.getAll();

    if (data && data.length > 0) {
      const upcoming = data
        .filter((m) => m.estado === "programado" || m.estado === "vivo")
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .slice(0, 2);

      const results = data
        .filter((m) => m.estado === "finalizado")
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 2);

      setUpcomingMatches(upcoming.length > 0 ? upcoming : fallbackUpcoming);
      setRecentResults(results.length > 0 ? results : fallbackResults);
    } else {
      setUpcomingMatches(fallbackUpcoming);
      setRecentResults(fallbackResults);
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <Badge variant="outline" className="mb-4">Partidos</Badge>
              <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
                Calendario
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <Badge variant="outline" className="mb-4">Partidos</Badge>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
              Calendario
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/partidos" className="gap-2">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Próximos Partidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMatches.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay partidos programados
                </p>
              ) : (
                upcomingMatches.map((match, index) => (
                  <div key={match.id}>
                    <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{match.categoria}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(match.fecha)} - {match.hora}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className={`font-medium flex-1 text-right ${match.es_local ? "text-primary" : ""}`}>
                          {match.es_local ? "Las Torres FC" : match.rival}
                        </span>
                        <div className="px-4 py-2 bg-muted rounded-lg font-bold text-lg">
                          VS
                        </div>
                        <span className={`font-medium flex-1 ${!match.es_local ? "text-primary" : ""}`}>
                          {match.es_local ? match.rival : "Las Torres FC"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground justify-center">
                        <MapPin className="w-3 h-3" />
                        {match.lugar}
                      </div>
                    </div>
                    {index < upcomingMatches.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Últimos Resultados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay resultados recientes
                </p>
              ) : (
                recentResults.map((match, index) => {
                  const homeTeam = match.es_local ? "Las Torres FC" : match.rival;
                  const awayTeam = match.es_local ? match.rival : "Las Torres FC";

                  return (
                    <div key={match.id}>
                      <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">{match.categoria}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(match.fecha)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-medium flex-1 text-right">
                            {homeTeam}
                          </span>
                          <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-lg">
                            {match.marca_local} - {match.marca_visitante}
                          </div>
                          <span className="font-medium flex-1">
                            {awayTeam}
                          </span>
                        </div>
                      </div>
                      {index < recentResults.length - 1 && <Separator className="mt-4" />}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
