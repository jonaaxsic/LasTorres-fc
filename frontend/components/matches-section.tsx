"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { matchesApi, Match } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowRight, Trophy, CalendarOff, Shield, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const CLUB_LOGO = "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/logos/logoClub.png";

export function MatchesSection() {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMatches, setHasMatches] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    const { data, error } = await matchesApi.getAll();

    if (data && data.length > 0) {
      setHasMatches(true);
      const upcoming = data
        .filter((m) => m.estado === "programado" || m.estado === "vivo")
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .slice(0, 5);

      const results = data
        .filter((m) => m.estado === "finalizado")
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 3);

      setUpcomingMatches(upcoming);
      setRecentResults(results);
    } else {
      setHasMatches(false);
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
      <section className="py-12 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3">Partidos</Badge>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
              Próximo Partido
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  // No hay partidos
  if (!hasMatches || upcomingMatches.length === 0) {
    return (
      <section className="py-12 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3">Partidos</Badge>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
              Próximo Partido
            </h2>
          </div>
          <div className="text-center py-12">
            <CalendarOff className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-medium">Aún no tenemos partidos programados</p>
            <p className="text-muted-foreground mt-2">Pronto anunciaremos nuevos encuentros</p>
          </div>
        </div>
      </section>
    );
  }

  // Solo hay próximo partido (sin resultados)
  if (recentResults.length === 0) {
    return (
      <section className="py-12 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3">Partidos</Badge>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
              Próximo Partido
            </h2>
          </div>

          <Card className="overflow-hidden max-w-md mx-auto">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="w-5 h-5 text-primary" />
                Próximo Partido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {formatDate(upcomingMatches[0].fecha)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {upcomingMatches[0].hora}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {upcomingMatches[0].lugar}
                </span>
              </div>

              {upcomingMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden">
                      <Image src={CLUB_LOGO} alt="Las Torres" fill className="object-cover" sizes="32px" />
                    </div>
                    <span className="text-xs font-medium">Las Torres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-[#dc2626] text-white text-[10px] px-1">{match.categoria}</Badge>
                    <span className="text-xs font-bold">VS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{match.rival}</span>
                    <div className="w-8 h-8 relative rounded-full overflow-hidden bg-background flex items-center justify-center">
                      {match.logo_rival ? (
                        <Image src={match.logo_rival} alt={match.rival} fill className="object-cover" sizes="32px" />
                      ) : (
                        <Shield className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Hay próximos y resultados
  return (
    <section className="py-12 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3">Partidos</Badge>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight">
            Próximo Partido
          </h2>
        </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="w-5 h-5 text-primary" />
                Próximo Partido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {formatDate(upcomingMatches[0].fecha)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {upcomingMatches[0].hora}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {upcomingMatches[0].lugar}
                </span>
              </div>

              {upcomingMatches.slice(0, 1).map((match) => (
                <div key={match.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden">
                      <Image src={CLUB_LOGO} alt="Las Torres" fill className="object-cover" sizes="32px" />
                    </div>
                    <span className="text-xs font-medium">Las Torres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-[#dc2626] text-white text-[10px] px-1">{match.categoria}</Badge>
                    <span className="text-xs font-bold">VS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{match.rival}</span>
                    <div className="w-8 h-8 relative rounded-full overflow-hidden bg-background flex items-center justify-center">
                      {match.logo_rival ? (
                        <Image src={match.logo_rival} alt={match.rival} fill className="object-cover" sizes="32px" />
                      ) : (
                        <Shield className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="w-5 h-5 text-primary" />
                Resultados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3">
              {recentResults.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden">
                      <Image src={CLUB_LOGO} alt="Las Torres" fill className="object-cover" sizes="32px" />
                    </div>
                    <span className="text-xs font-medium">Las Torres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-[#dc2626] text-white text-[10px] px-1">{match.categoria}</Badge>
                    <span className="text-xs font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      {match.marca_local} - {match.marca_visitante}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{match.rival}</span>
                    <div className="w-8 h-8 relative rounded-full overflow-hidden bg-background flex items-center justify-center">
                      {match.logo_rival ? (
                        <Image src={match.logo_rival} alt={match.rival} fill className="object-cover" sizes="32px" />
                      ) : (
                        <Shield className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}