"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

const categories = [
  { name: "Sub-8", age: "7-9 años" },
  { name: "Sub-10", age: "10-12 años" },
  { name: "Sub-13", age: "13-14 años" },
];

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Sección Categorías */}
        <ScrollReveal delay={0.1}>
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">Categorías</Badge>
            <h3 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-2">
              Nuestras Divisiones
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Inscripciones abiertas para todas las categorías
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="text-center bg-[#dc2626]/80 border-red-900/30 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
              >
                <CardContent className="py-6">
                  <div className="font-heading text-3xl md:text-4xl font-bold text-white mb-1">
                    {category.name}
                  </div>
                  <div className="text-sm text-white/80">{category.age}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/escuelita">
                Consultar Inscripciones
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}