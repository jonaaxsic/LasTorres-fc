"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { newsApi, News, NewsCreate } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { X, Image as ImageIcon, Link } from "lucide-react";
import { toast } from "sonner";

interface NewsFormProps {
  initialData?: News;
  isEditing?: boolean;
}

export function NewsForm({ initialData, isEditing = false }: NewsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<NewsCreate>({
    titulo: initialData?.titulo || "",
    contenido: initialData?.contenido || "",
    imagen_url: initialData?.imagen_url || "",
    imagen_url_2: initialData?.imagen_url_2 || "",
    featured: initialData?.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!formData.contenido.trim()) {
      toast.error("El contenido es obligatorio");
      return;
    }

    setIsSubmitting(true);

    console.log("Guardando noticia:", formData);

    const { data, error } = isEditing && initialData
      ? await newsApi.update(initialData.id, formData)
      : await newsApi.create(formData);

    console.log("Resultado:", data, error);

    if (data) {
      toast.success(isEditing ? "✅ Noticia actualizada correctamente" : "✅ Noticia creada correctamente");
      router.push("/admin/noticias");
    } else {
      toast.error(error || "Error al guardar la noticia");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-6">
{/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="titulo">Título</FieldLabel>
                  <Input
                    id="titulo"
                    placeholder="Título de la noticia"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="contenido">Contenido</FieldLabel>
                  <Textarea
                    id="contenido"
                    placeholder="Escribe el contenido de la noticia..."
                    rows={10}
                    value={formData.contenido}
                    onChange={(e) =>
                      setFormData({ ...formData, contenido: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Image URL */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
<FieldLabel htmlFor="imagen_url">URL de la imagen</FieldLabel>
                  <Input
                    id="imagen_url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.imagen_url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, imagen_url: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Pega la URL de la imagen (Ej: de Google Drive, Supabase, Cloudinary, etc.)
                  </p>
                  
                  {formData.imagen_url ? (
                    <div className="mt-4">
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={formData.imagen_url}
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
                        className="mt-2 w-full"
                        onClick={() => setFormData({ ...formData, imagen_url: "" })}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Quitar imagen
                      </Button>
                    </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30">
                    <Link className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground text-center px-4">
                      Ingresa la URL de la imagen arriba
                    </span>
                  </div>
                )}
              </Field>

              {/* Segunda imagen */}
              <Field>
                <FieldLabel htmlFor="imagen_url_2">Segunda imagen (opcional)</FieldLabel>
                <Input
                  id="imagen_url_2"
                  placeholder="https://ejemplo.com/imagen2.jpg"
                  value={formData.imagen_url_2 || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, imagen_url_2: e.target.value })
                  }
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Imagen más pequeña que aparece junto con el texto
                </p>
                
                {formData.imagen_url_2 ? (
                  <div className="mt-4">
                    <div className="h-32 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={formData.imagen_url_2}
                        alt="Preview 2"
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
                      className="mt-2 w-full"
                      onClick={() => setFormData({ ...formData, imagen_url_2: "" })}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Quitar imagen
                    </Button>
                  </div>
                ) : null}
              </Field>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Noticia Destacada
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Aparecerá en la sección principal
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Guardando...
                </>
              ) : isEditing ? (
                "Actualizar Noticia"
              ) : (
                "Crear Noticia"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/noticias")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
