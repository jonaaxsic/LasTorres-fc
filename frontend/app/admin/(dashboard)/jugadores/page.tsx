"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { playersApi, Player } from "@/lib/api";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import Image from "next/image";

export default function JugadoresAdminPage() {
  const router = useRouter();
  const [jugadores, setJugadores] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState<Player | null>(null);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [jugRes, catRes] = await Promise.all([
      playersApi.getAll(),
      fetch("http://localhost:3001/api/jugadores/categorias/list").then(r => r.json()).catch(() => [])
    ]);
    setJugadores(jugRes.data || []);
    setCategorias(catRes);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = {
      nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value,
      fecha_nacimiento: (form.elements.namedItem("fecha") as HTMLInputElement).value,
      foto_url: (form.elements.namedItem("foto") as HTMLInputElement).value,
      categoria_id: parseInt((form.elements.namedItem("categoria") as HTMLSelectElement).value),
      posicion_id: parseInt((form.elements.namedItem("posicion") as HTMLSelectElement).value),
    };

    console.log("Enviando datos:", JSON.stringify(data));

    try {
      let result;
      if (editando?.id) {
        result = await playersApi.update(editando.id, data);
      } else {
        result = await playersApi.create(data);
      }

      console.log("Resultado API:", result);

      if (result.error) {
        console.error("Error:", result.error);
        toast.error(result.error);
      } else if (result.data) {
        console.log("Jugador guardado:", result.data);
        toast.success(editando?.id ? "Jugador actualizado" : "Jugador creado exitosamente");
        setEditando(null);
        cargarDatos();
      } else {
        console.log("Sin data en resultado");
        toast.success("Jugador guardado");
        setEditando(null);
        cargarDatos();
      }
    } catch (err) {
      console.error("Excepción:", err);
      toast.error("Error al guardar");
    }

    setIsSubmitting(false);
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar jugador?")) return;
    const result = await playersApi.delete(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Jugador eliminado");
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
          <h1 className="text-2xl font-bold">Jugadores</h1>
          <p className="text-muted-foreground">Gestiona los jugadores del club</p>
        </div>
        <Button onClick={() => setEditando({} as Player)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Jugador
        </Button>
      </div>

      {editando !== null && (
        <Card>
          <CardHeader>
            <CardTitle>{editando?.id ? "Editar" : "Nuevo"} Jugador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input name="nombre" defaultValue={editando?.nombre || editando?.name} required />
                </Field>
                <Field>
                  <FieldLabel>Fecha de Nacimiento</FieldLabel>
                  <Input name="fecha" type="date" defaultValue={editando?.fecha_nacimiento || editando?.birthdate} required />
                </Field>
                <Field>
                  <FieldLabel>URL de Foto</FieldLabel>
                  <Input name="foto" type="url" defaultValue={editando?.foto_url || editando?.photo_url || ""} placeholder="https://ejemplo.com/foto.jpg" />
                </Field>
                <Field>
                  <FieldLabel>Categoría</FieldLabel>
                  <select name="categoria" className="w-full h-10 px-3 border rounded-md bg-background text-foreground" defaultValue={editando?.categoria_id}>
                    {categorias.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel>Posición</FieldLabel>
                  <select name="posicion" className="w-full h-10 px-3 border rounded-md bg-background text-foreground" defaultValue={editando?.posicion_id}>
                    <option value="1">Portero</option>
                    <option value="2">Defensa</option>
                    <option value="3">Mediocampista</option>
                    <option value="4">Delantero</option>
                  </select>
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
        {jugadores.map((jugador) => (
          <Card key={jugador.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted overflow-hidden relative">
                {jugador.foto_url || jugador.photo_url ? (
                  <Image src={jugador.foto_url || jugador.photo_url} alt={jugador.nombre} fill className="object-cover" sizes="64px" />
                ) : (
                  <User className="w-8 h-8 m-auto text-muted-foreground" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{jugador.nombre || jugador.name}</CardTitle>
                <Badge variant="secondary">{jugador.categoria?.nombre || "Sin categoría"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{jugador.posicion?.nombre}</p>
              <p className="text-sm text-muted-foreground">{jugador.fecha_nacimiento || jugador.birthdate}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setEditando(jugador)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => eliminar(jugador.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}