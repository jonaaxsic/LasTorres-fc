"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import Image from "next/image";
import { BackgroundEffects } from "@/components/background-effects";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function ClubPage() {
  const clubInfo = {
    nombre: "Club Socio Cultural Las Torres FC",
    fundacion: "28 de marzo de 2025",
    direccion: "Las Torres 2318, Cerro Navía",
    region: "Santiago de Chile",
    historia: "Club Socio Cultural Las Torres FC es un club de fútbol barrial fundado el 28 de marzo de 2025 en el sector de Cerro Navía, Santiago. Desde entonces, hemos sido un espacio de formación deportiva y valores para niños y jóvenes de la comunidad. El club se mantiene gracias al esfuerzo y compromiso de nuestros socios y simpatizantes, quienes año tras año apoyan para mantener viva la pasión por el fútbol en nuestro sector.",
    vision: "Ser un espacio de formación integral donde los niños y jóvenes de Cerro Navía encuentren un lugar seguro para desarrollar sus habilidades deportivas, formándose como personas de bien a través del fútbol, contribuyendo a una comunidad más sana y unida.",
    mission: "Promover el fútbol formativo en niños y jóvenes de Cerro Navía, brindando un espacio seguro donde puedan desarrollar habilidades deportivas, aprender valores de respeto, trabajo en equipo y disciplina, alejándolos de los peligros del uso excesivo de tecnología y las adicciones."
  };

  // Imágenes del bucket
  const galeria = [
    "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc02.webp",
    "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc06.jpg",
    "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc08.jpg",
    "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc09.jpg",
    "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc12.jpg",
    "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/img-08.jpeg",
  ];

  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />

          {/* ── HEADER ── */}
          <ScrollReveal delay={0.1}>
            <div className="mb-12">
              <Badge className="mb-3 bg-white/10 border-0 text-white/70 text-xs font-bold uppercase tracking-widest">
                Club Socio Cultural
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">
                Las Torres FC
              </h1>
            </div>
          </ScrollReveal>

          {/* ── FECHA DE FUNDACIÓN (mejorada) ── */}
          <ScrollReveal delay={0.15}>
            <div className="mb-16">
            <div className="bg-gradient-to-r from-red-900/30 to-transparent p-6 md:p-8 rounded-xl border-l-4 border-red-600">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Fundado el</p>
              <p className="text-xl md:text-2xl font-bold text-red-500">28 de marzo de 2025</p>
              <p className="text-sm text-muted-foreground mt-2">Club Socio Cultural Las Torres FC</p>
            </div>
          </div>
          </ScrollReveal>

          {/* ── IMAGEN PRINCIPAL ── */}
          <ScrollReveal delay={0.15}>
          <div className="mb-16">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src={galeria[0]}
                alt="Cancha Las Torres FC"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/90 text-lg font-medium">Nuestra Casa</p>
                <p className="text-white/70 text-sm">{clubInfo.direccion}</p>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* ── HISTORIA ── */}
          <ScrollReveal delay={0.2}>
          <div className="mb-16">
            <div className="max-w-3xl">
              <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase mb-4">
                Nuestra Historia
              </h2>
              <div className="w-16 h-1 bg-red-600 mb-6" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                {clubInfo.historia}
              </p>
            </div>
          </div>
          </ScrollReveal>

          {/* ── MISIÓN Y VISIÓN ── */}
          <ScrollReveal delay={0.25}>
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-white/10 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                    <MisionIcon className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-bold text-lg uppercase">Misión</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {clubInfo.mission}
                </p>
              </div>

              <div className="bg-card border border-white/10 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                    <VisionIcon className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-bold text-lg uppercase">Visión</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {clubInfo.vision}
                </p>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* ── GALERÍA (fotos diferentes) ── */}
          <ScrollReveal delay={0.3}>
          <div className="mb-16">
            <h2 className="font-heading text-xl md:text-2xl font-bold uppercase mb-6">
              Nuestra Galeria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galeria.slice(1).map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`Galeria Las Torres FC ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* ── DIRECCIÓN Y MAPA ── */}
          <ScrollReveal delay={0.35}>
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card/50 border border-white/10 p-6 rounded-xl">
                <h3 className="font-bold text-lg uppercase mb-4">Nuestra Sede</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <PinIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Dirección</p>
                      <p className="text-muted-foreground">{clubInfo.direccion}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Sector</p>
                      <p className="text-muted-foreground">Cerro Navía, Santiago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 border border-white/10 p-1 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.356724879576!2d-70.7319017!3d-33.4155088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c1588038845%3A0x1030fa6d147127fd!2sLas%20Torres%202318%2C%20Cerro%20Nav%C3%ADa!5e0!3m2!1ses!2scl!4v1753234567890!5m2!1ses!2scl"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "200px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Las Torres FC"
                />
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* ── CONTACTO ── */}
          <ScrollReveal delay={0.4}>
          <div className="text-center py-8 border-t border-white/10">
            <p className="text-lg font-medium mb-2">¿Quieres visitarnos o participar?</p>
            <p className="text-sm text-muted-foreground">
              Te esperamos en {clubInfo.direccion}
            </p>
            <p className="text-sm text-white/60 mt-1">
              Los sábados de 10:00 a 12:00 hrs
            </p>
          </div>
          </ScrollReveal>

        </div>
      </main>
      <Footer />
    </>
  );
}

// ===== ICONOS SVG =====

function MisionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function VisionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 9-9 9s-9-2-9-9" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18" />
    </svg>
  );
}