"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { DirectivaCard } from "@/components/directiva-card";

const API_URL = "http://localhost:3001";

interface Member {
  id: number;
  nombre: string;
  cargo: string;
  descripcion?: string;
  foto_url?: string;
}

export default function DirectivaPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching from:", `${API_URL}/api/directiva/`);
    
    fetch(`${API_URL}/api/directiva/`)
      .then(res => {
        console.log("Response:", res);
        return res.json();
      })
      .then(data => {
        console.log("Data:", data);
        setMembers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
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
            <p>Cargando...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : members.length === 0 ? (
            <p className="text-muted-foreground">No hay directivos ({members.length})</p>
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