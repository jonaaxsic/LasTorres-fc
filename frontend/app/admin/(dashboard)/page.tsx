"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { newsApi, matchesApi, eventsApi, News, Match, Event } from "@/lib/api";
import {
  Newspaper,
  Trophy,
  Calendar,
  Image,
  TrendingUp,
  Plus,
  ArrowRight,
  Users,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  news: number;
  matches: number;
  events: number;
  gallery: number;
  players: number;
  directive: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    news: 0,
    matches: 0,
    events: 0,
    gallery: 0,
    players: 0,
    directive: 0,
  });
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    const [newsRes, matchesRes, eventsRes, playersRes, directivaRes] = await Promise.all([
      newsApi.getAll(),
      matchesApi.getAll(),
      eventsApi.getAll(),
      fetch("http://localhost:3001/api/jugadores").then(r => r.json()).catch(() => []),
      fetch("http://localhost:3001/api/directiva").then(r => r.json()).catch(() => []),
    ]);

    if (newsRes.data) {
      setStats((prev) => ({ ...prev, news: newsRes.data!.length }));
      setRecentNews(newsRes.data.slice(0, 3));
    }

    if (matchesRes.data) {
      setStats((prev) => ({ ...prev, matches: matchesRes.data!.length }));
      const upcoming = matchesRes.data
        .filter((m) => m.estado === "programado")
        .slice(0, 3);
      setUpcomingMatches(upcoming);
    }

    if (eventsRes.data) {
      setStats((prev) => ({ ...prev, events: eventsRes.data!.length }));
      const upcoming = eventsRes.data
        .filter((e) => new Date(e.fecha) >= new Date())
        .slice(0, 3);
      setUpcomingEvents(upcoming);
    }

    // Cargar jugadores y directiva
    setStats((prev) => ({ 
      ...prev, 
      players: playersRes.length || 0,
      directive: directivaRes.length || 0,
    }));

    setIsLoading(false);
  };

  const statCards = [
    {
      title: "Noticias",
      value: stats.news,
      icon: Newspaper,
      href: "/admin/noticias",
      color: "text-white",
      bgColor: "bg-primary",
    },
    {
      title: "Partidos",
      value: stats.matches,
      icon: Trophy,
      href: "/admin/partidos",
      color: "text-white",
      bgColor: "bg-primary",
    },
    {
      title: "Eventos",
      value: stats.events,
      icon: Calendar,
      href: "/admin/eventos",
      color: "text-white",
      bgColor: "bg-primary",
    },
    {
      title: "Galería",
      value: stats.gallery,
      icon: Image,
      href: "/admin/galeria",
      color: "text-white",
      bgColor: "bg-primary",
    },
    {
      title: "Jugadores",
      value: stats.players,
      icon: Users,
      href: "/admin/jugadores",
      color: "text-white",
      bgColor: "bg-primary",
    },
    {
      title: "Directiva",
      value: stats.directive,
      icon: Briefcase,
      href: "/admin/directiva",
      color: "text-white",
      bgColor: "bg-primary",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">
            <TrendingUp className="w-3 h-3 mr-1" />
            Dashboard
          </Badge>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
          Bienvenido {user?.username}
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona el contenido de Las Torres FC desde aquí
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                  <div className="font-heading text-3xl font-bold">
                    {stat.value}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/noticias/nueva">
          <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
            <Plus className="w-5 h-5" />
            <span className="text-sm">Nueva Noticia</span>
          </Button>
        </Link>
        <Link href="/admin/partidos/nuevo">
          <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
            <Plus className="w-5 h-5" />
            <span className="text-sm">Nuevo Partido</span>
          </Button>
        </Link>
        <Link href="/admin/eventos/nuevo">
          <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
            <Plus className="w-5 h-5" />
            <span className="text-sm">Nuevo Evento</span>
          </Button>
        </Link>
        <Link href="/admin/galeria">
          <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
            <Plus className="w-5 h-5" />
            <span className="text-sm">Subir Imagen</span>
          </Button>
        </Link>
      </div>

      {/* Recent Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Últimas Noticias</CardTitle>
            <Link href="/admin/noticias">
              <Button variant="ghost" size="sm">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentNews.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Newspaper className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{news.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(news.created_at).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    {news.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Destacada
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">
                No hay noticias aún
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Matches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Próximos Partidos</CardTitle>
            <Link href="/admin/partidos">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : upcomingMatches.length > 0 ? (
              <div className="flex flex-col gap-3">
                {upcomingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {match.es_local ? "Las Torres vs " : ""}
                        {match.rival}
                        {!match.es_local ? " vs Las Torres" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.fecha).toLocaleDateString("es-ES")} -{" "}
                        {match.hora}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {match.categoria}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">
                No hay partidos programados
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
