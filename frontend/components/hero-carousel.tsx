"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://res.cloudinary.com/dyslpppz8/image/upload/v1777759926/WhatsApp_Image_2026-05-02_at_15.07.30_hjtjpd.jpg",
    title: "Bienvenidos a Las Torres FC",
    subtitle: "Más que un club, una familia",
  },
  {
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/img-08.jpeg",
    title: "Formando Campeones",
    subtitle: "Escuela de fútbol para todas las edades",
  },
  {
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc03.jpg",
    title: "Temporada 2026",
    subtitle: "Nuevos desafíos, misma pasión",
  },
  {
    image: "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc08.jpg",
    title: "Temporada 2026",
    subtitle: "Nuevos desafíos, misma pasión",
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt=""
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{
              objectFit: "cover",
              objectPosition: index === 0 ? "center 60%" : index === 3 ? "center 70%" : "center 15%",
            }}
          />
        ))}

      {/* Contenido - posicion media en mobile, abajo en desktop */}
      <div className="absolute z-10 bottom-12 md:bottom-12 left-4 md:left-12 lg:left-20 right-4 md:right-auto max-w-xl">
        <h1 className="font-heading text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide text-white mb-0.5 md:mb-3 drop-shadow-lg">
          {slides[current].title}
        </h1>
        <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-white/85">
          {slides[current].subtitle}
        </p>
      </div>

      {/* Navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots - solo visible en desktop */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? "bg-white scale-125" : "bg-white/40"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
