"use client";

import { useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";

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

function AnimatedCard({ section, index }: { section: typeof sections[0]; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        delay: index * 0.08,
        duration: 0.3
      }}
    >
      <Link href={section.href} className="group block">
        <div className="rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-red-600 hover:shadow-red-600/40 h-full flex flex-col bg-card border border-transparent">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-full object-cover"
            />
            {/* Difuminado inferior - suave transición hacia el contenido */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge className="bg-[#dc2626] text-white font-bold">
                {section.badge}
              </Badge>
            </div>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-heading text-base font-bold mb-1 group-hover:text-red-500 transition-colors">
              {section.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {section.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function SectionCards() {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#2a2a2a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">Explora</Badge>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Descubre el Club
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre Las Torres FC en un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section, index) => (
            <AnimatedCard key={section.href} section={section} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}