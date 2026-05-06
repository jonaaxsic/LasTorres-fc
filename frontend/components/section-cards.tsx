"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });
  
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  
  // Animaciones basadas en scroll
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.95, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 3, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.7, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [30, 15, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ 
        scale, 
        rotateX, 
        opacity, 
        y,
        transformPerspective: 1000 
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
      transition={{ 
        delay: index * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 18
      }}
      whileHover={{ 
        scale: 1.02,
        rotateX: -5,
        rotateY: -5,
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      <Link href={section.href} className="group block">
        <div className="relative rounded-xl overflow-hidden border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/60 hover:-translate-y-2 h-full flex flex-col">
          <div className="relative aspect-video overflow-hidden">
            <motion.div
              className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/20 transition-colors"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.5 }}
            />
            <img
              src={section.image}
              alt={section.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <motion.div
              className="absolute top-3 left-3 z-20"
              whileHover={{ scale: 1.15 }}
            >
              <Badge className="bg-[#dc2626] text-white font-bold shadow-lg">
                {section.badge}
              </Badge>
            </motion.div>
            {/* Overlay con flecha */}
            <motion.div
              className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </motion.div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-heading text-lg font-bold mb-2 group-hover:text-primary transition-colors">
              {section.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-auto">
              {section.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function SectionCards() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [20, 0]);

  return (
    <section ref={containerRef} className="py-16 md:py-24 px-4 bg-[#2a2a2a]">
      <div className="max-w-7xl mx-auto">
        {/* Título con animación de scroll */}
        <motion.div
          className="text-center mb-12"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Explora</Badge>
          </motion.div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Descubre el Club
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre Las Torres FC en un solo lugar
          </p>
        </motion.div>

        {/* Grid de Cards con animaciones de scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <AnimatedCard key={section.href} section={section} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}