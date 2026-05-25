"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Link } from "lucide-react";
import Image from "next/image";
import { teamApi, TeamMember } from "@/lib/api";
import { DirectivaCard } from "@/components/directiva-card";

interface DirectivoForm {
  id?: number;
  nombre: string;
  cargo: string;
  foto_url?: string;
  descripcion?: string;
}

export default function DirectivaAdminPage() {
  const [directivos, setDirectivos] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState<DirectivoForm | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const { data, error } = await teamApi.getAll();
      if (error) {
        if (error.includes("table") || error.includes("schema")) {
          toast.error("La tabla de directivos no existe en la base de datos.");
        } else {
          toast.error(error);
        }
      } else {
        setDirectivos(data || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar directivos");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const nombreInput = form.elements.namedItem("nombre") as HTMLInputElement;
    const cargoInput = form.elements.namedItem("cargo") as HTMLInputElement;
    
    let hayError = false;
    
    if (!nombreInput.value.trim()) {
      nombreInput.classList.add("border-red-500", "ring-2", "ring-red-500/50");
      hayError = true;
    } else {
      nombreInput.classList.remove("border-red-500", "ring-2", "ring-red-500/50");
    }
    
    if (!cargoInput.value.trim()) {
      cargoInput.classList.add("border-red-500", "ring-2", "ring-red-500/50");
      hayError = true;
    } else {
      cargoInput.classList.remove("border-red-500", "ring-2", "ring-red-500/50");
    }
    
    if (hayError) {
      toast.warning("Completá los campos obligatorios (Nombre y Cargo)");
      return;
    }
    
    toast.info(editando?.id ? "Actualizando directivo..." : "Creando directivo...");
    setIsSubmitting(true);

    const data = {
      nombre: nombreInput.value.trim(),
      cargo: cargoInput.value.trim(),
      descripcion: (form.elements.namedItem("descripcion") as HTMLTextAreaElement)?.value || "",
      foto_url: (form.elements.namedItem("foto_url") as HTMLInputElement)?.value || "",
    };

    const { error } = editando?.id
      ? await teamApi.update(editando.id, data)
      : await teamApi.create(data);

    if (error) {
      toast.error(error);
    } else {
      toast.success(editando?.id ? "✅ Directivo actualizado correctamente" : "✅ Directivo creado correctamente");
      setEditando(null);
      cargarDatos();
    }

    setIsSubmitting(false);
  };

  const eliminar = async (id: number, nombre: string) => {
    const confirmar = confirm(`¿Eliminar a "${nombre || "este directivo"}"?\n\nEsta acción no se puede deshacer.`);
    if (!confirmar) return;
    
    toast.info("Eliminando...");
    const { error } = await teamApi.delete(id);
    if (error) {
      toast.error(error);
    } else {
      toast.success("✅ Directivo eliminado correctamente");
      cargarDatos();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Directiva</h1>
          <p className="text-muted-foreground">Gestiona los miembros de la directiva</p>
        </div>
        <Button onClick={() => setEditando({ nombre: "", cargo: "", foto_url: "", descripcion: "" })}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Directivo
        </Button>
      </div>

      {editando !== null && (
        <Card>
          <CardHeader>
            <CardTitle>{editando?.id ? "Editar" : "Nuevo"} Directivo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="nombre">Nombre *</FieldLabel>
                  <Input id="nombre" name="nombre" defaultValue={editando?.nombre} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cargo">Cargo *</FieldLabel>
                  <Input id="cargo" name="cargo" defaultValue={editando?.cargo} placeholder="Presidente, Secretário, Tesorero, etc." required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
                  <textarea 
                    id="descripcion" 
                    name="descripcion"
                    defaultValue={editando?.descripcion}
                    className="w-full min-h-[80px] px-3 py-2 border rounded-md bg-background"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="foto_url">URL de Foto</FieldLabel>
                  <Input 
                    id="foto_url" 
                    name="foto_url" 
                    placeholder="https://..."
                    value={editando?.foto_url || ""}
                    onChange={(e) => setEditando({ ...editando!, foto_url: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Pega la URL de la foto del directivo</p>
                  
                  {editando?.foto_url && (
                    <div className="mt-3">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border">
                        <img
                          src={editando.foto_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => setEditando({...editando, foto_url: ""})}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Quitar foto
                      </Button>
                    </div>
                  )}
                </Field>
              </FieldGroup>
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner className="w-4 h-4 mr-2" /> : null}
                  {editando?.id ? "Actualizar" : "Crear"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditando(null)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {directivos.map((directivo) => (
          <DirectivaCard
            key={directivo.id}
            id={directivo.id}
            nombre={directivo.nombre || ""}
            cargo={directivo.cargo || ""}
            descripcion={directivo.descripcion}
            foto_url={directivo.foto_url}
            onEdit={(item) => setEditando({ 
              id: item.id, 
              nombre: item.nombre, 
              cargo: item.cargo, 
              foto_url: item.foto_url, 
              descripcion: item.descripcion 
            })}
            onDelete={(id) => eliminar(id,directivo.nombre || "")}
            showButtons={true}
          />
        ))}
      </div>

      {directivos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No hay directivos creados</p>
          <Button onClick={() => setEditando({ nombre: "", cargo: "", foto_url: "", descripcion: "" })}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Directivo
          </Button>
        </div>
      )}
    </div>
  );
}