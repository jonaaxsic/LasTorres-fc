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
import { Plus, Search } from "lucide-react";
import { PlayerCard } from "@/components/player-card";
import Image from "next/image";

export default function JugadoresAdminPage() {
  const router = useRouter();
  const [jugadores, setJugadores] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState<Player | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [catSeleccionada, setCatSeleccionada] = useState<string | null>(null);

  // Agrupar por categoría
  const porCategoria: Record<string, Player[]> = {};
  jugadores.forEach(j => {
    const cat = j.categoria?.nombre || "Sin categoría";
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(j);
  });
  const categoriasKeys = Object.keys(porCategoria);

  // Filtrar por búsqueda o categoría
  const jugadoresFiltrados = busqueda
    ? jugadores.filter(j => (j.nombre || j.name || "").toLowerCase().includes(busqueda.toLowerCase()))
    : catSeleccionada
      ? porCategoria[catSeleccionada] || []
      : [];

  const mostrarVacio = !busqueda && !catSeleccionada;

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

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jugador..."
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setCatSeleccionada(null); }}
          className="pl-10"
        />
      </div>

      {/* Botones de categoría */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={catSeleccionada === null ? "default" : "outline"}
          size="sm"
          onClick={() => setCatSeleccionada(null)}
        >
          Todos
        </Button>
        {categoriasKeys.map(cat => (
          <Button
            key={cat}
            variant={catSeleccionada === cat ? "default" : "outline"}
            size="sm"
            onClick={() => catSeleccionada === cat ? setCatSeleccionada(null) : setCatSeleccionada(cat)}
          >
            {cat}
          </Button>
        ))}
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

      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {mostrarVacio ? (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Escribe para buscar un jugador</p>
          </div>
        ) : (
          <>
            {jugadoresFiltrados.map((jugador) => (
              <PlayerCard 
                key={jugador.id}
                id={jugador.id}
                nombre={jugador.nombre || jugador.name || ""}
                categoria={jugador.categoria?.nombre}
                posicion={jugador.posicion?.nombre}
                fecha_nacimiento={jugador.fecha_nacimiento}
                foto_url={jugador.foto_url || jugador.photo_url}
                onEdit={setEditando}
                onDelete={eliminar}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}