// PlayerCard - Imagen fondo completo, overlay, botones siempre visibles

"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User } from "lucide-react";

type PlayerCardProps = {
  id: number;
  nombre: string;
  categoria?: string;
  posicion?: string;
  fecha_nacimiento?: string;
  foto_url?: string;
  onEdit: (player: any) => void;
  onDelete: (id: number) => void;
  showButtons?: boolean;
};

export const PlayerCard = ({
  id,
  nombre,
  categoria,
  posicion,
  fecha_nacimiento,
  foto_url,
  onEdit,
  onDelete,
  showButtons = true,
}: PlayerCardProps) => {
  return (
    <div className="relative w-48 h-64 rounded-xl overflow-hidden shadow-md hover:shadow-red-500/50 hover:scale-105 transition-all duration-300">
      {/* Imagen fondo - cubre toda la card */}
      {foto_url ? (
        <img src={foto_url} alt={nombre} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-700">
          <User className="w-10 h-10 text-zinc-400" />
        </div>
      )}

      {/* Overlay oscuro con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Contenido sobre la imagen */}
      <div className="absolute bottom-0 w-full p-3 text-white z-10">
        <h2 className="text-sm font-bold truncate">{nombre}</h2>
        <p className="text-xs text-zinc-300">{posicion}</p>
        <p className="text-[10px] text-zinc-300 mt-1">{categoria}</p>

        {/* Fondo difuminado para botones */}
        <div className="absolute left-0 right-0 -bottom-2 -z-10 bg-black/95 blur-md" style={{ height: '60%', transform: 'translateY(20%)' }} />

        {/* Botones - solo visibles si showButtons es true */}
        {showButtons && (
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="flex-1 h-7 text-xs bg-white text-red-600 hover:bg-red-50 border-2 border-red-600" onClick={() => onEdit({ id, nombre, categoria, posicion, fecha_nacimiento, foto_url })}>
              <Pencil className="w-3 h-3 mr-1" /> Editar
            </Button>
            <Button size="sm" className="flex-1 h-7 text-xs bg-red-600 text-white hover:bg-red-700" onClick={() => onDelete(id)}>
              <Trash2 className="w-3 h-3 mr-1" /> Borrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};