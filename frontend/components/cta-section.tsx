"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div 
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundImage: "url('https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc06.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 p-8 md:p-16 text-center">
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight text-white mb-4">
              Únete a Nuestra Familia
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
              Inscribe a tus hijos en nuestra escuelita de fútbol o forma parte de nuestro equipo. Hay un lugar para todos en Las Torres FC.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link href="/escuelita" className="gap-2">
                  Escuelita de Fútbol <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white/10">
                <Link href="/contacto">
                  Contáctanos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
