import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import Image from "next/image";

export default function EscuelitaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />

          {/* ── HEADER ── */}
          <div className="relative mb-12">
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden mb-6">
              <Image
                src="https://res.cloudinary.com/dyslpppz8/image/upload/q_auto/f_auto/v1777759926/WhatsApp_Image_2026-05-02_at_15.07.30_hjtjpd.jpg"
                alt="Escuelita Las Torres FC"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <Badge className="mb-3 bg-white/10 backdrop-blur-sm border-0 text-white text-xs font-bold uppercase tracking-widest">
                  Escuela de Fútbol
                </Badge>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-none">
                  Las Torres FC
                </h1>
              </div>
            </div>
          </div>

          {/* ── DESCRIPCIÓN ── */}
          <div className="mb-16">
            <div className="max-w-3xl">
              <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase mb-4">
                Nuestra Escuela
              </h2>
              <div className="w-16 h-1 bg-red-600 mb-6" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                La Escuela de Fútbol Las Torres FC es una escuela autofinanciada por los socios y simpatizantes del Club. 
                Es una organización que ayuda y fomenta el deporte para los niños y jóvenes de la población de Cerro Navía.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                La escuela ayuda a sus alumnos en materias deportivas y recreativas, evitando que niños y jóvenes 
                eviten el uso prolongado del celular y los malos pasos de las drogas.
              </p>
            </div>
          </div>

          {/* ── VALORES (cards con hover rojo) ── */}
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-lg bg-card border border-white/10 hover:border-red-600 hover:bg-red-600/5 transition-all cursor-pointer group">
                <FutbolIcon className="w-8 h-8 mb-3 text-white/70 group-hover:text-red-500 transition-colors" />
                <p className="font-bold text-sm uppercase tracking-wide">Deporte</p>
                <p className="text-xs text-muted-foreground mt-1">Técnicas de fútbol</p>
              </div>
              
              <div className="p-4 rounded-lg bg-card border border-white/10 hover:border-red-600 hover:bg-red-600/5 transition-all cursor-pointer group">
                <EquipoIcon className="w-8 h-8 mb-3 text-white/70 group-hover:text-red-500 transition-colors" />
                <p className="font-bold text-sm uppercase tracking-wide">Equipo</p>
                <p className="text-xs text-muted-foreground mt-1">Cooperación</p>
              </div>
              
              <div className="p-4 rounded-lg bg-card border border-white/10 hover:border-red-600 hover:bg-red-600/5 transition-all cursor-pointer group">
                <CorazonIcon className="w-8 h-8 mb-3 text-white/70 group-hover:text-red-500 transition-colors" />
                <p className="font-bold text-sm uppercase tracking-wide">Valores</p>
                <p className="text-xs text-muted-foreground mt-1">Respeto y disciplina</p>
              </div>
              
              <div className="p-4 rounded-lg bg-card border border-white/10 hover:border-red-600 hover:bg-red-600/5 transition-all cursor-pointer group">
                <EscudoIcon className="w-8 h-8 mb-3 text-white/70 group-hover:text-red-500 transition-colors" />
                <p className="font-bold text-sm uppercase tracking-wide">Comunidad</p>
                <p className="text-xs text-muted-foreground mt-1">Un espacio seguro</p>
              </div>
            </div>
          </div>

          {/* ── INFO: IMAGEN + HORARIO + UBICACIÓN ── */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Imagen */}
              <div className="relative h-[220px] md:h-[280px] rounded-xl overflow-hidden">
                <Image
                  src="https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/galeria/imagenlfc02.webp"
                  alt="Entrenamiento Las Torres FC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Horario y Ubicación */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-card/50 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-1">
                    <RelojIcon className="w-4 h-4 text-red-500" />
                    <h3 className="font-bold uppercase text-xs tracking-wide">Horario</h3>
                  </div>
                  <p className="text-lg font-bold">Sábados 10:00 - 12:00 hrs</p>
                  <p className="text-sm text-muted-foreground">Todos los sábados</p>
                </div>

                <div className="bg-card/50 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-1">
                    <PinIcon className="w-4 h-4 text-red-500" />
                    <h3 className="font-bold uppercase text-xs tracking-wide">Dónde</h3>
                  </div>
                  <p className="text-base font-bold">Cancha Las Torres FC</p>
                  <p className="text-sm text-muted-foreground">Las Torres 2318, Cerro Navía</p>
                </div>
              </div>

            </div>
          </div>

          {/* ── INSCRIPCIÓN (minimal, dark) ── */}
          <div className="mb-16">
            <div className="bg-card p-5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold uppercase text-sm">Inscripción Abierta</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    La inscripción y participación es <strong className="text-white">100% gratuita</strong>. 
                    No hay ningún costo.
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1 bg-white/10 text-white/70 text-xs font-bold uppercase rounded">
                  Gratis
                </span>
              </div>
            </div>
          </div>

          {/* ── CTA FINAL ── */}
          <div className="text-center py-8 border-t border-white/10">
            <p className="text-lg font-medium">
              ¿Te interesa participar?
            </p>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Asiste cualquier sábado a las 10:00 AM con tu ropa deportiva.
            </p>
            <p className="text-sm text-white/60">
              Cancha Las Torres FC • Sábados 10:00 AM
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

// ===== ICONOS SVG =====

function FutbolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2c2.5 2 4 5 4 10s-1.5 8-4 10" />
      <path d="M12 2c-2.5 2-4 5-4 10s1.5 8 4 10" />
      <path d="M2 12h20" />
    </svg>
  );
}

function EquipoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CorazonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function EscudoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function RelojIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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