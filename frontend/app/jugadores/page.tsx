"use client";

import { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { PlayerCard } from "@/components/player-card";
import { Spinner } from "@/components/ui/spinner";
import { Breadcrumb } from "@/components/breadcrumb";
import { BackgroundEffects } from "@/components/background-effects";
import { playersApi, type Jugador } from "@/lib/api";

export default function JugadoresPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [players, setPlayers] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    playersApi.getAll().then(({ data, error }) => {
      if (data) setPlayers(data);
      if (error) setError(error);
      setLoading(false);
    });
  }, []);

  // Clic fuera para deseleccionar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Agrupar por categoría
  const byCategory = players.reduce<Record<string, Jugador[]>>((acc, p) => {
    const cat = p.categoria?.nombre ?? "Sin categoría";
    (acc[cat] ??= []).push(p);
    return acc;
  }, {});

  const categories = Object.keys(byCategory);

  // ─── Render helper ──────────────────────────────
  const renderCategoryButtons = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
      {categories.map((cat) => {
        const active = selectedCategory === cat;
        const count = byCategory[cat].length;
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              relative px-4 sm:px-7 py-2 sm:py-3 rounded-lg sm:rounded-xl font-black uppercase tracking-widest
              text-xs sm:text-sm transition-all duration-300 cursor-pointer
              ${active
                ? "bg-red-600 text-white scale-105"
                : "border border-white/10 text-white/60 hover:border-red-600/40 hover:text-white bg-transparent"
              }
            `}
            style={active ? { boxShadow: "0 6px 20px rgba(220, 38, 38, 0.35)" } : {}}
          >
            {cat}
            <span
              className={`
                ml-1.5 sm:ml-2 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold
                ${active ? "bg-white/20 text-white" : "bg-white/10 text-white/50"}
              `}
            >
              {count}
            </span>
            {active && (
              <span className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-400 border-2 border-background" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <main className="min-h-screen py-24 px-4" ref={containerRef}>
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />

          <div className="relative overflow-hidden mb-10 pb-8">
            <Badge
              variant="outline"
              className="mb-3 sm:mb-4 border-red-600 bg-red-600 text-white uppercase tracking-widest text-[10px] sm:text-xs font-bold"
            >
              PLANTEL OFICIAL
            </Badge>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">
              Nuestros Jugadores
            </h1>

            <div className="mt-3 sm:mt-4 h-[2px] sm:h-[3px] w-16 sm:w-20 bg-red-600 rounded-full" />

            <p className="text-muted-foreground mt-3 sm:mt-4 text-xs sm:text-sm">
              {selectedCategory
                ? `${byCategory[selectedCategory].length} jugador${byCategory[selectedCategory].length !== 1 ? "es" : ""} en ${selectedCategory}`
                : players.length > 0
                  ? `${players.length} jugador${players.length !== 1 ? "es" : ""} en ${categories.length} categoría${categories.length !== 1 ? "s" : ""}`
                  : "Selecciona una categoría para ver sus jugadores"}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner className="w-8 h-8" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive text-lg font-medium">{error}</p>
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg font-medium">
                No hay jugadores registrados.
              </p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Vuelve pronto para ver el plantel completo.
              </p>
            </div>
          ) : (
            <>
              {renderCategoryButtons()}

              {selectedCategory ? (
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  {byCategory[selectedCategory].map((player) => (
                    <PlayerCard
                      key={player.id}
                      id={player.id}
                      nombre={player.nombre}
                      categoria={player.categoria?.nombre}
                      posicion={player.posicion?.nombre}
                      fecha_nacimiento={player.fecha_nacimiento}
                      foto_url={player.foto_url}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      showButtons={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <p className="text-white/80 text-lg sm:text-xl font-medium mb-2">
                    Selecciona una categoría
                  </p>
                  <p className="text-white/40 text-sm max-w-md mx-auto">
                    Elige una de las categorías para ver los jugadores que pertenecen a esa plantilla
                  </p>
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
