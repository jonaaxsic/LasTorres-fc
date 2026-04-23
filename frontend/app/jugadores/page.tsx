"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Breadcrumb } from "@/components/breadcrumb";

interface Player {
  id: number;
  nombre?: string;
  name?: string;
  fecha_nacimiento?: string;
  foto_url?: string;
  photo_url?: string;
  categoria?: { id: number; nombre: string };
  posicion?: { id: number; nombre: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function JugadoresPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/jugadores/`)
      .then(res => res.json())
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Agrupar por categoría
  const playersByCategory: Record<string, Player[]> = {};
  players.forEach((player) => {
    const cat = player.categoria?.nombre || "Sin categoría";
    if (!playersByCategory[cat]) playersByCategory[cat] = [];
    playersByCategory[cat].push(player);
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-3">Plantel</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Nuestros Jugadores
            </h1>
            <p className="text-muted-foreground mt-3">
              Conoce a los jugadores de Las Torres FC por categoría
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner className="w-8 h-8" />
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No hay jugadores registrados.</p>
            </div>
          ) : (
            Object.entries(playersByCategory).map(([category, categoryPlayers]) => (
              <div key={category} className="mb-12">
                <h2 className="font-heading text-2xl font-bold mb-6 border-b pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryPlayers.map((player) => (
                    <Card key={player.id} className="overflow-hidden">
                      {player.foto_url || player.photo_url ? (
                        <div className="relative aspect-square w-full">
                          <Image
                            src={player.foto_url || player.photo_url || ""}
                            alt={player.nombre || player.name || "Jugador"}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <span className="text-4xl">⚽</span>
                        </div>
                      )}
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm text-center">
                          {player.nombre || player.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 text-center text-xs text-muted-foreground">
                        {player.categoria?.nombre}
                        {player.posicion?.nombre && ` • ${player.posicion.nombre}`}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}