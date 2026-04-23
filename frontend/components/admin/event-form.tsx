"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { eventsApi, Event, EventCreate, uploadFile } from "@/lib/api";
import { EVENT_TYPE_LABELS, EventType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface EventFormProps {
  initialData?: Event;
  isEditing?: boolean;
}

export function EventForm({ initialData, isEditing = false }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<EventCreate>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    location: initialData?.location || "",
    event_type: initialData?.event_type || "evento",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setIsUploading(true);
    const { data, error } = await uploadFile(file);

    if (data?.url) {
      setFormData({ ...formData, image_url: data.url });
      toast.success("Imagen subida correctamente");
    } else {
      toast.error(error || "Error al subir la imagen");
    }

    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("La descripción es obligatoria");
      return;
    }

    if (!formData.date) {
      toast.error("La fecha es obligatoria");
      return;
    }

    if (!formData.time) {
      toast.error("La hora es obligatoria");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("La ubicación es obligatoria");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = isEditing && initialData
      ? await eventsApi.update(initialData.id, formData)
      : await eventsApi.create(formData);

    if (data) {
      toast.success(isEditing ? "Evento actualizado" : "Evento creado");
      router.push("/admin/eventos");
    } else {
      toast.error(error || "Error al guardar el evento");
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
              <CardTitle>Información del Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="title">Título</FieldLabel>
                    <Input
                      id="title"
                      placeholder="Nombre del evento"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="event_type">Tipo de Evento</FieldLabel>
                    <Select
                      value={formData.event_type}
                      onValueChange={(value: EventType) =>
                        setFormData({ ...formData, event_type: value })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="event_type">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="description">Descripción</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Describe el evento..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="date">Fecha</FieldLabel>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="time">Hora</FieldLabel>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      disabled={isSubmitting}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="location">Ubicación</FieldLabel>
                  <Input
                    id="location"
                    placeholder="Lugar del evento"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
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
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                {formData.image_url ? (
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData({ ...formData, image_url: "" })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer bg-muted/50">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading || isSubmitting}
                    />
                    {isUploading ? (
                      <Spinner className="w-8 h-8" />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click para subir imagen
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG hasta 5MB
                        </span>
                      </>
                    )}
                  </label>
                )}
              </Field>
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
                "Actualizar Evento"
              ) : (
                "Crear Evento"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/eventos")}
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
