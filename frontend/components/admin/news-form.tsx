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
    title: initialData?.title || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    featured: initialData?.featured || false,
  });

  // Validar que sea URL válida de imagen
  const isValidImageUrl = (url: string) => {
    if (!url) return true; // vacío es válido
    return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || 
           url.includes("supabase.co") ||
           url.includes("placeholder") ||
           url.startsWith("http");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("El contenido es obligatorio");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = isEditing && initialData
      ? await newsApi.update(initialData.id, formData)
      : await newsApi.create(formData);

    if (data) {
      toast.success(isEditing ? "Noticia actualizada" : "Noticia creada");
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
                  <FieldLabel htmlFor="title">Título</FieldLabel>
                  <Input
                    id="title"
                    placeholder="Título de la noticia"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="content">Contenido</FieldLabel>
                  <Textarea
                    id="content"
                    placeholder="Escribe el contenido de la noticia..."
                    rows={10}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
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
                <FieldLabel htmlFor="image_url">URL de la imagen</FieldLabel>
                <Input
                  id="image_url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.image_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Pega la URL de la imagen (Ej: de Google Drive, Supabase, etc.)
                </p>
                
                {formData.image_url ? (
                  <div className="mt-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={formData.image_url}
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
                      onClick={() => setFormData({ ...formData, image_url: "" })}
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
