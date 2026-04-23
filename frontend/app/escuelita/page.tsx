import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { schoolApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

async function getCategories() {
  const { data } = await schoolApi.getAll();
  return data || [];
}

export default async function EscuelitaPage() {
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-3">Escuelita</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Escuela de Fútbol
            </h1>
            <p className="text-muted-foreground mt-3">
              Información sobre nuestras categorías y horarios de entrenamiento
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No hay categorías registradas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <Card key={cat.id}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      {cat.category || cat.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium">{cat.schedule || cat.horario}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-medium">{cat.entry || cat.entrada}</span>
                    </div>
                    {cat.description || cat.description && (
                      <p className="text-muted-foreground">{cat.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Información general */}
          <div className="mt-16 p-8 bg-muted/30 rounded-lg">
            <h2 className="font-heading text-2xl font-bold mb-4">
              Información de Inscripciones
            </h2>
            <p className="text-muted-foreground">
              Para inscribir a tu hijo en nuestra escuela de fútbol, contacta al club a través de nuestros canales de comunicación.
              Las inscripciones están abertas para todas las categorías durante todo el año.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}