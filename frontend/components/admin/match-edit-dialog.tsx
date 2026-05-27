"use client";

import { useEffect, useState } from "react";
import { matchesApi, Match, parseCategorias } from "@/lib/api";
import { MATCH_STATUS_LABELS, MatchStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface MatchEditDialogProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

/** Solo permite cambiar estado y resultado */
export function MatchEditDialog({ match, open, onOpenChange, onSaved }: MatchEditDialogProps) {
  const [estado, setEstado] = useState<string>("");
  const [marcaLocal, setMarcaLocal] = useState<number | undefined>(undefined);
  const [marcaVisitante, setMarcaVisitante] = useState<number | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizar estado cuando se abre con un match distinto
  useEffect(() => {
    if (match) {
      setEstado(match.estado || "programado");
      setMarcaLocal(match.marca_local);
      setMarcaVisitante(match.marca_visitante);
    }
  }, [match]);

  const handleSave = async () => {
    if (!match) return;

    setIsSaving(true);
    const { error } = await matchesApi.update(match.id, {
      estado,
      marca_local: estado === "finalizado" ? marcaLocal : undefined,
      marca_visitante: estado === "finalizado" ? marcaVisitante : undefined,
    });

    if (error) {
      toast.error("Error al actualizar el partido");
    } else {
      toast.success("✅ Partido actualizado");
      onOpenChange(false);
      onSaved();
    }

    setIsSaving(false);
  };

  const isFinished = estado === "finalizado";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Partido</DialogTitle>
          <DialogDescription>
            Solo podés cambiar el estado y el resultado.
          </DialogDescription>
        </DialogHeader>

        {match && (
          <div className="space-y-4 py-2">
            {/* Info del partido (solo lectura) */}
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">Las Torres</span>
                <span className="text-muted-foreground">vs</span>
                <span className="font-semibold">{match.rival}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{new Date(match.fecha).toLocaleDateString("es-ES")}</span>
                <span>{match.hora}</span>
                <span>{match.lugar}</span>
              </div>
              <div className="flex gap-1 mt-1">
                {parseCategorias(match.categoria).map((cat) => (
                  <span key={cat} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-estado">Estado</Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger id="edit-estado">
                  <SelectValue placeholder="Seleccioná estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programado">Programado</SelectItem>
                  <SelectItem value="postergado">Postergado</SelectItem>
                  <SelectItem value="suspendido">Suspendido</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado */}
            {isFinished && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-local">Goles Las Torres</Label>
                  <Input
                    id="edit-local"
                    type="number"
                    min="0"
                    value={marcaLocal ?? ""}
                    onChange={(e) =>
                      setMarcaLocal(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-visita">Goles {match.rival}</Label>
                  <Input
                    id="edit-visita"
                    type="number"
                    min="0"
                    value={marcaVisitante ?? ""}
                    onChange={(e) =>
                      setMarcaVisitante(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving || !match}>
            {isSaving ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
