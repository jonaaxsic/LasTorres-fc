"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
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
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);

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

  const categorias = Object.keys(playersByCategory);

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
              Selecciona una categoría para ver sus jugadores
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
            <>
              {/* Botones de categorías */}
              <div className="flex flex-wrap gap-3 mb-8">
                {categorias.map((categoria) => (
                  <button
                    key={categoria}
                    onClick={() => setCategoriaSeleccionada(
                      categoriaSeleccionada === categoria ? null : categoria
                    )}
                    className={`px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 min-w-[140px] ${
                      categoriaSeleccionada === categoria
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 border"
                    }`}
                  >
                    {categoria}
                    <span className="ml-2 text-xs opacity-75">
                      ({playersByCategory[categoria].length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Jugadores de la categoría seleccionada */}
              {categoriaSeleccionada && playersByCategory[categoriaSeleccionada] && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <h2 className="font-heading text-xl font-bold mb-4">
                    {categoriaSeleccionada}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {playersByCategory[categoriaSeleccionada].map((player) => (
                      <div
                        key={player.id}
                        className="bg-card rounded-lg p-3 flex flex-col items-center text-center border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2 bg-muted">
                          {player.foto_url || player.photo_url ? (
                            <Image
                              src={player.foto_url || player.photo_url || ""}
                              alt={player.nombre || player.name || "Jugador"}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-xl">👤</span>
                            </div>
                          )}
                        </div>
                        <p className="font-medium text-sm truncate w-full">
                          {player.nombre || player.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {player.posicion?.nombre || "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}