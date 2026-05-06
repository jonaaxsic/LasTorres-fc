// DirectivaCard - Flip 3D con rotación visible

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User, RotateCcw } from "lucide-react";

type DirectivaCardProps = {
  id: number;
  nombre: string;
  cargo?: string;
  descripcion?: string;
  foto_url?: string;
  onEdit?: (directivo: any) => void;
  onDelete?: (id: number) => void;
  showButtons?: boolean;
};

export const DirectivaCard = ({
  id,
  nombre,
  cargo,
  descripcion,
  foto_url,
  onEdit,
  onDelete,
  showButtons = false,
}: DirectivaCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasDesc = descripcion && descripcion.trim().length > 0;

  return (
    <div 
      className="relative w-48 h-72 rounded-xl overflow-hidden shadow-md hover:shadow-red-500/50 cursor-pointer"
      style={{ perspective: "800px" }}
      onMouseEnter={() => hasDesc && !showButtons && setIsFlipped(true)}
      onMouseLeave={() => hasDesc && !showButtons && setIsFlipped(false)}
    >
      {/* Contenedor 3D */}
      <div 
        className="relative w-full h-full transition-transform duration-900 ease-in-out"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front - Imagen */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {foto_url ? (
            <img src={foto_url} alt={nombre} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-700">
              <User className="w-12 h-12 text-zinc-400" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 w-full p-4 text-white">
            <h2 className="text-base font-bold truncate">{nombre}</h2>
            <p className="text-sm text-zinc-300">{cargo}</p>
            
            {hasDesc && !showButtons && (
              <div className="mt-3 flex items-center gap-1 text-xs text-zinc-400">
                <RotateCcw className="w-3 h-3" />
                <span>Ver más</span>
              </div>
            )}
          </div>
        </div>

        {/* Back - Descripción */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden bg-zinc-900 flex flex-col items-center justify-center p-4"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h2 className="text-base font-bold text-white text-center">{nombre}</h2>
          <p className="text-sm text-zinc-400 text-center mb-3">{cargo}</p>
          {descripcion && (
            <p className="text-xs text-zinc-200 leading-relaxed text-center">{descripcion}</p>
          )}
          <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-zinc-400">
            <RotateCcw className="w-3 h-3" />
            <span>Volver</span>
          </div>
        </div>
      </div>

      {/* Botones admin */}
      {showButtons && (
        <div className="absolute bottom-0 w-full p-4 z-20 flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs bg-white text-red-600 hover:bg-red-50 border-2 border-red-600" 
            onClick={() => onEdit?.({ id, nombre, cargo, descripcion, foto_url })}
          >
            <Pencil className="w-3 h-3 mr-1" /> Editar
          </Button>
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs bg-red-600 text-white hover:bg-red-700" 
            onClick={() => onDelete?.(id)}
          >
            <Trash2 className="w-3 h-3 mr-1" /> Borrar
          </Button>
        </div>
      )}
    </div>
  );
};