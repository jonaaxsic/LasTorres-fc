"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchForm } from "@/components/admin/match-form";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";

export default function NuevoPartidoPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/partidos">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Partidos
          </Button>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">
            <Trophy className="w-3 h-3 mr-1" />
            Nuevo Partido
          </Badge>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
          Crear Partido
        </h1>
        <p className="text-muted-foreground mt-1">
          Completa los campos para programar un nuevo partido
        </p>
      </div>

      <MatchForm />
    </div>
  );
}
