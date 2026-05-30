"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { DirectivaCard } from "@/components/directiva-card";
import { BackgroundEffects } from "@/components/background-effects";
import { teamApi, type Directivo } from "@/lib/api";

export default function DirectivaPage() {
  const [members, setMembers] = useState<Directivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    teamApi.getAll().then(({ data, error }) => {
      if (data) setMembers(data);
      if (error) setError(error);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />

          <div className="mb-8">
            <Badge variant="outline" className="mb-3">Directiva</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Nuestra Directiva
            </h1>
            <p className="text-muted-foreground mt-3">
              Conoce a los encargados del club
            </p>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : members.length === 0 ? (
            <p className="text-muted-foreground">No hay directivos</p>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {members.map((member) => (
                <DirectivaCard
                  key={member.id}
                  id={member.id}
                  nombre={member.nombre}
                  cargo={member.cargo}
                  descripcion={member.descripcion}
                  foto_url={member.foto_url}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
