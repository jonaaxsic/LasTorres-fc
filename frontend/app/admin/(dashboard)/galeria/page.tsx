"use client";

import { useEffect, useState } from "react";
import { galleryApi, GalleryImage } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Link,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    url: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    const { data, error } = await galleryApi.getAll();
    if (data) {
      setImages(data);
    } else if (error) {
      toast.error("Error al cargar galería");
    }
    setIsLoading(false);
  };

  // Handle URL input directly
  const handleUrlChange = (url: string) => {
    setUploadData({ ...uploadData, url });
  };

  const handleUploadSubmit = async () => {
    if (!uploadData.url) {
      toast.error("Ingresa una URL de imagen");
      return;
    }

    setIsUploading(true);
    const { data, error } = await galleryApi.upload({
      url: uploadData.url,
      title: uploadData.title || undefined,
      description: uploadData.description || undefined,
    });

    if (data) {
      toast.success("Imagen agregada a la galería");
      setImages([data, ...images]);
      setIsUploadOpen(false);
      setUploadData({ url: "", title: "", description: "" });
    } else {
      toast.error(error || "Error al guardar en galería");
    }

    setIsUploading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const { error } = await galleryApi.delete(deleteId);

    if (error) {
      toast.error("Error al eliminar la imagen");
    } else {
      toast.success("Imagen eliminada correctamente");
      setImages(images.filter((i) => i.id !== deleteId));
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              <ImageIcon className="w-3 h-3 mr-1" />
              Gestión de Galería
            </Badge>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
            Galería
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las imágenes del club
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Subir Imagen
        </Button>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyIcon>
                <ImageIcon className="w-10 h-10" />
              </EmptyIcon>
              <EmptyTitle>No hay imágenes</EmptyTitle>
              <EmptyDescription>
                Sube tu primera imagen para mostrarla en la galería.
              </EmptyDescription>
              <Button className="mt-4" onClick={() => setIsUploadOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Subir Imagen
              </Button>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={image.url}
                alt={image.title || "Imagen de galería"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setDeleteId(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm truncate">{image.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

{/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Imagen</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="url">URL de la imagen</FieldLabel>
              <Input
                id="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={uploadData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Pega la URL de la imagen (de Drive, Supabase, etc.)
              </p>
              
              {uploadData.url ? (
                <div className="mt-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={uploadData.url}
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
                    onClick={() => setUploadData({ ...uploadData, url: "" })}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Quitar
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

            <Field>
              <FieldLabel htmlFor="title">Título (opcional)</FieldLabel>
              <Input
                id="title"
                placeholder="Título de la imagen"
                value={uploadData.title}
                onChange={(e) =>
                  setUploadData({ ...uploadData, title: e.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Descripción (opcional)</FieldLabel>
              <Input
                id="description"
                placeholder="Descripción breve"
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData({ ...uploadData, description: e.target.value })
                }
              />
            </Field>
          </FieldGroup>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleUploadSubmit} disabled={isUploading || !uploadData.url}>
              {isUploading ? <Spinner className="w-4 h-4 mr-2" /> : null}
              Agregar
            </Button>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
