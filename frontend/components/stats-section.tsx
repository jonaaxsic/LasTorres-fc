"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories = [
  { name: "Sub-6", age: "5-6 años" },
  { name: "Sub-8", age: "7-8 años" },
  { name: "Sub-10", age: "9-10 años" },
  { name: "Sub-12", age: "11-12 años" },
];

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Sección Categorías */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">Categorías</Badge>
          <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
            Nuestras Divisiones
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Inscripciones abiertas para todas las categorías
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category, index) => (
            <Card key={index} className="text-center bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer">
              <CardContent className="py-6">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-1">
                  {category.name}
                </div>
                <div className="text-sm text-muted-foreground">{category.age}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/escuelita">
              Consultar Inscripciones
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
