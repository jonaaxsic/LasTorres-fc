"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, User, Link } from "lucide-react";
import Image from "next/image";

interface Directivo {
  id?: number;
  nombre: string;
  cargo: string;
  foto_url?: string;
  descripcion?: string;
}

const directivoApi = {
  getAll: async () => {
    const res = await fetch("http://localhost:3001/api/directiva");
    return res.json();
  },
  create: async (data: Directivo) => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch("http://localhost:3001/api/directiva", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: number, data: Partial<Directivo>) => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`http://localhost:3001/api/directiva/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: number) => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`http://localhost:3001/api/directiva/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export default function DirectivaAdminPage() {
  const [directivos, setDirectivos] = useState<Directivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState<Directivo | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await directivoApi.getAll();
      setDirectivos(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = {
      nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value,
      cargo: (form.elements.namedItem("cargo") as HTMLInputElement).value,
      descripcion: (form.elements.namedItem("descripcion") as HTMLTextAreaElement).value,
      foto_url: editando?.foto_url || "",
    };

    let result;
    if (editando?.id) {
      result = await directivoApi.update(editando.id, data);
    } else {
      result = await directivoApi.create(data);
    }

    if (result.detail || result.error) {
      toast.error(result.detail || result.error);
    } else {
      toast.success(editando?.id ? "Directivo actualizado" : "Directivo creado");
      setEditando(null);
      cargarDatos();
    }

    setIsSubmitting(false);
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar directivo?")) return;
    const result = await directivoApi.delete(id);
    if (result.detail || result.error) {
      toast.error(result.detail || result.error);
    } else {
      toast.success("Directivo eliminado");
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
                  <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
                  <Input id="nombre" name="nombre" defaultValue={editando?.nombre} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cargo">Cargo</FieldLabel>
                  <Input id="cargo" name="cargo" defaultValue={editando?.cargo} placeholder="Presidente, Secretario, Tesorero, etc." required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="descripcion">Descripción (opcional)</FieldLabel>
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
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={editando?.foto_url || ""}
                    onChange={(e) => setEditando({ ...editando!, foto_url: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Pega la URL de la foto del directivo
                  </p>
                  
                  {editando?.foto_url && (
                    <div className="mt-4">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {directivos.map((directivo) => (
          <Card key={directivo.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted overflow-hidden relative shrink-0">
                {directivo.foto_url ? (
                  <Image src={directivo.foto_url} alt={directivo.nombre} fill className="object-cover" 
                    onError={(e) => {(e.target as HTMLImageElement).src = "/placeholder.svg";}}
                  />
                ) : (
                  <User className="w-10 h-10 m-auto text-muted-foreground" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{directivo.nombre}</CardTitle>
                <p className="text-sm text-primary font-medium">{directivo.cargo}</p>
              </div>
            </CardHeader>
            <CardContent>
              {directivo.descripcion && (
                <p className="text-sm text-muted-foreground mb-4">{directivo.descripcion}</p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditando(directivo)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => eliminar(directivo.id!)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {directivos.length === 0 && (
        <Card className="p-8 text-center">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No hay directivos creados</p>
          <Button className="mt-4" onClick={() => setEditando({ nombre: "", cargo: "", foto_url: "", descripcion: "" })}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Directivo
          </Button>
        </Card>
      )}
    </div>
  );
}