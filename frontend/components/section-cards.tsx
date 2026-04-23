"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sections = [
  {
    href: "/jugadores",
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc15.jpeg",
    badge: "Plantel",
    title: "Conoce a Nuestros Jugadores",
    description: "El equipo que representa nuestros colores en cada partido.",
  },
  {
    href: "/escuelita",
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc14.jpeg",
    badge: "Formación",
    title: "Escuelita de Fútbol",
    description: "Formamos a los futuros talentos del fútbol desde temprana edad.",
  },
  {
    href: "/noticias",
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc13.jpeg",
    badge: "Noticias",
    title: "Últimas Noticias",
    description: "Mantente informado sobre todo lo que pasa en el club.",
  },
  {
    href: "/galeria",
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc12.jpg",
    badge: "Multimedia",
    title: "Galería de Imágenes",
    description: "Revive los mejores momentos de la temporada.",
  },
  {
    href: "/club",
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc09.jpg",
    badge: "Historia",
    title: "Nuestra Historia",
    description: "Conoce los orígenes y la trayectoria del club.",
  },
  {
    href: "/contacto",
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/img-09.jpeg",
    badge: "Contacto",
    title: "Contáctanos",
    description: "Únete a nuestra comunidad o envíanos tus consultas.",
  },
];

export function SectionCards() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Explora</Badge>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Descubre el Club
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre Las Torres FC en un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link 
              key={section.href} 
              href={section.href}
              className="group block"
            >
              <div className="relative rounded-xl overflow-hidden border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-video">
                  <div className="absolute inset-0 z-10 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <img
                    src={section.image}
                    alt={section.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-primary text-primary-foreground">{section.badge}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
