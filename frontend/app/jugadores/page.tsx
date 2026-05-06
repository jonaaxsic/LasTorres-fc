"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { PlayerCard } from "@/components/player-card";
import { Spinner } from "@/components/ui/spinner";
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

  // Agrupar por categoría — lógica sin cambios
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

          {/* ── HEADER MEJORADO ── */}
          <div className="relative overflow-hidden mb-10 pb-8">
            <Badge variant="outline" className="mb-3 sm:mb-4 border-red-600 bg-red-600 text-white uppercase tracking-widest text-[10px] sm:text-xs font-bold">
              PLANTEL OFICIAL
            </Badge>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">
              Nuestros Jugadores
            </h1>

            {/* Línea decorativa roja */}
            <div className="mt-3 sm:mt-4 h-[2px] sm:h-[3px] w-16 sm:w-20 bg-red-600 rounded-full" />

            <p className="text-muted-foreground mt-3 sm:mt-4 text-xs sm:text-sm">
              {players.length > 0
                ? `${players.length} jugador${players.length !== 1 ? "es" : ""} registrado${players.length !== 1 ? "s" : ""}`
                : "Selecciona una categoría para ver sus jugadores"}
            </p>
          </div>

          {/* ── ESTADOS ── */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner className="w-8 h-8" />
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg font-medium">No hay jugadores registrados.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Vuelve pronto para ver el plantel completo.</p>
            </div>
          ) : (
            <>
              {/* ── BOTONES DE CATEGORÍA MEJORADOS ── */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
                {categorias.map((categoria) => {
                  const activa = categoriaSeleccionada === categoria;
                  return (
                    <button
                      key={categoria}
                      onClick={() =>
                        setCategoriaSeleccionada(activa ? null : categoria)
                      }
                      className={`
                        relative px-4 sm:px-7 py-2 sm:py-3 rounded-lg sm:rounded-xl font-black uppercase tracking-widest
                        text-xs sm:text-sm transition-all duration-300 cursor-pointer
                        ${activa
                          ? "bg-red-600 text-white scale-105"
                          : "border border-white/10 text-white/60 hover:border-red-600/40 hover:text-white bg-transparent"
                        }
                      `}
                      style={
                        activa
                          ? { boxShadow: "0 6px 20px rgba(220, 38, 38, 0.35)" }
                          : {}
                      }
                    >
                      {categoria}
                      <span
                        className={`
                          ml-1.5 sm:ml-2 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold
                          ${activa ? "bg-white/20 text-white" : "bg-white/10 text-white/50"}
                        `}
                      >
                        {playersByCategory[categoria].length}
                      </span>

                      {/* Punto activo */}
                      {activa && (
                        <span className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-400 border-2 border-background" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* GRID DE JUGADORES - mismo layout que admin */}
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {(categoriaSeleccionada ? playersByCategory[categoriaSeleccionada] : players).map((player) => (
                  <PlayerCard
                    key={player.id}
                    id={player.id}
                    nombre={player.nombre || player.name || ""}
                    categoria={player.categoria?.nombre}
                    posicion={player.posicion?.nombre}
                    fecha_nacimiento={player.fecha_nacimiento}
                    foto_url={player.foto_url || player.photo_url}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    showButtons={false}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}