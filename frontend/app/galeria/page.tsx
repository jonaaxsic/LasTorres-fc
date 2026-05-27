"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { galleryApi, GalleryImage } from "@/lib/api";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Helpers ───
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface MonthGroup {
  label: string;
  key: string;
  images: GalleryImage[];
}

function groupByMonth(images: GalleryImage[]): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();

  for (const img of images) {
    let key: string;
    let label: string;

    if (img.created_at) {
      const d = new Date(img.created_at);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = d.getMonth();
        key = `${year}-${String(month + 1).padStart(2, "0")}`;
        label = `${MONTHS[month]} ${year}`;
      } else {
        key = "sin-fecha";
        label = "Sin fecha";
      }
    } else {
      key = "sin-fecha";
      label = "Sin fecha";
    }

    if (!groups.has(key)) {
      groups.set(key, { label, key, images: [] });
    }
    groups.get(key)!.images.push(img);
  }

  return Array.from(groups.values()).sort((a, b) => {
    if (a.key === "sin-fecha") return 1;
    if (b.key === "sin-fecha") return -1;
    return b.key.localeCompare(a.key);
  });
}

/** Devuelve el índice global de una imagen dentro del array plano */
function globalIndex(groups: MonthGroup[], groupIdx: number, imgIdx: number): number {
  let acc = 0;
  for (let g = 0; g < groupIdx; g++) {
    acc += groups[g].images.length;
  }
  return acc + imgIdx;
}

// ─── Lightbox ───
function Lightbox({
  images,
  currentIndex,
  groupLabel,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  currentIndex: number;
  groupLabel: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") { e.preventDefault(); onPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 select-none"
      onClick={onClose}
    >
      {/* Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Anterior */}
      {hasMultiple && currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Imagen */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.url}
          alt={img.titulo || img.name || "Imagen de galería"}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />

        <div className="mt-3 flex items-center gap-4 text-white/80 text-sm">
          {hasMultiple && (
            <span className="font-semibold tabular-nums">
              {currentIndex + 1} / {images.length}
            </span>
          )}
          <span>{groupLabel}</span>
          {(img.titulo || img.title) && (
            <span className="text-white/50">— {img.titulo || img.title}</span>
          )}
        </div>
      </div>

      {/* Siguiente */}
      {hasMultiple && currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}

// ─── Página principal ───
export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await galleryApi.getAll();
      if (data) setImages(data);
      setLoading(false);
    })();
  }, []);

  const groups = useMemo(() => groupByMonth(images), [images]);

  const handlePrev = () => {
    setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setLightboxIdx((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : prev
    );
  };

  // Grupo actual del lightbox
  const activeGroup = useMemo(() => {
    if (lightboxIdx === null) return null;
    let acc = 0;
    for (const g of groups) {
      if (lightboxIdx < acc + g.images.length) return g.label;
      acc += g.images.length;
    }
    return null;
  }, [groups, lightboxIdx]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />

          <div className="mb-12">
            <Badge variant="outline" className="mb-3">Galería</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Galería de Imágenes
            </h1>
            <p className="text-muted-foreground mt-2">
              Recorré los momentos del club
            </p>
          </div>

          {loading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((s) => (
                <div key={s}>
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No hay imágenes en la galería.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {groups.map((group, gIdx) => (
                <section key={group.key}>
                  {/* Título del mes */}
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-0.5 bg-primary rounded-full" />
                    {group.label}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({group.images.length} {group.images.length === 1 ? "imagen" : "imágenes"})
                    </span>
                  </h2>

                  {/* Grid de imágenes */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {group.images.map((img, iIdx) => {
                      const globalIdx = globalIndex(groups, gIdx, iIdx);
                      return (
                        <div
                          key={img.id}
                          className="relative group aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer"
                          onClick={() => {
                            setLightboxIdx(globalIdx);
                          }}
                        >
                          <img
                            src={img.url}
                            alt={img.titulo || img.name || "Imagen de galería"}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                            loading="lazy"
                          />
                          {/* Título en hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            {(img.titulo || img.title) && (
                              <span className="text-white text-sm font-medium truncate">
                                {img.titulo || img.title}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Lightbox */}
      {lightboxIdx !== null && activeGroup && (
        <Lightbox
          images={images}
          currentIndex={lightboxIdx}
          groupLabel={activeGroup}
          onClose={() => setLightboxIdx(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
