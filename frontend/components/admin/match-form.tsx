"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { matchesApi, Match, MatchCreate } from "@/lib/api";
import { CATEGORIES, MATCH_STATUS_LABELS, MatchStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Link, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface MatchFormProps {
  initialData?: Match;
  isEditing?: boolean;
}

export function MatchForm({ initialData, isEditing = false }: MatchFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<MatchCreate>({
    opponent: initialData?.opponent || "",
    opponent_logo: initialData?.opponent_logo || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    location: initialData?.location || "",
    home_score: initialData?.home_score,
    away_score: initialData?.away_score,
    is_home: initialData?.is_home ?? true,
    category: initialData?.category || "Sub-10",
    status: initialData?.status || "scheduled",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.opponent.trim()) {
      toast.error("El rival es obligatorio");
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
      ? await matchesApi.update(initialData.id, formData)
      : await matchesApi.create(formData);

    if (data) {
      toast.success(isEditing ? "Partido actualizado" : "Partido creado");
      router.push("/admin/partidos");
    } else {
      toast.error(error || "Error al guardar el partido");
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
              <CardTitle>Información del Partido</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="opponent">Rival</FieldLabel>
                    <Input
                      id="opponent"
                      placeholder="Nombre del equipo rival"
                      value={formData.opponent}
                      onChange={(e) =>
                        setFormData({ ...formData, opponent: e.target.value })
                      }
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="category">Categoría</FieldLabel>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

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
                    placeholder="Nombre del estadio o cancha"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Estado</FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(value: MatchStatus) =>
                      setFormData({ ...formData, status: value })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MATCH_STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                {/* Score (only visible when finished) */}
                {formData.status === "finished" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="home_score">
                        Goles {formData.is_home ? "Las Torres" : "Rival"}
                      </FieldLabel>
                      <Input
                        id="home_score"
                        type="number"
                        min="0"
                        value={formData.home_score ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            home_score: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        disabled={isSubmitting}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="away_score">
                        Goles {formData.is_home ? "Rival" : "Las Torres"}
                      </FieldLabel>
                      <Input
                        id="away_score"
                        type="number"
                        min="0"
                        value={formData.away_score ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            away_score: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        disabled={isSubmitting}
                      />
                    </Field>
                  </div>
                )}
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Logo del Rival */}
          <Card>
            <CardHeader>
              <CardTitle>Logo del Rival</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel htmlFor="opponent_logo">URL del Logo</FieldLabel>
                <Input
                  id="opponent_logo"
                  placeholder="https://ejemplo.com/logo.png"
                  value={formData.opponent_logo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, opponent_logo: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Pega la URL del escudo del rival
                </p>
                
                {formData.opponent_logo && (
                  <div className="mt-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-muted">
                      <img
                        src={formData.opponent_logo}
                        alt="Logo del rival"
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
                      onClick={() => setFormData({ ...formData, opponent_logo: "" })}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Quitar
                    </Button>
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
                  <Label htmlFor="is_home" className="text-sm font-medium">
                    Partido de Local
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Las Torres juega de local
                  </p>
                </div>
                <Switch
                  id="is_home"
                  checked={formData.is_home}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_home: checked })
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
                "Actualizar Partido"
              ) : (
                "Crear Partido"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/partidos")}
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
