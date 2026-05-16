import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { DirectivaCard } from "@/components/directiva-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Member {
  id: number;
  nombre: string;
  cargo: string;
  descripcion?: string;
  foto_url?: string;
}

async function getDirectiva() {
  try {
    const res = await fetch(`${API_URL}/api/directiva/`, { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function DirectivaPage() {
  const members = await getDirectiva() as Member[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-3">Directiva</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Nuestra Directiva
            </h1>
            <p className="text-muted-foreground mt-3">
              Conoce a los encargados del club
            </p>
          </div>

          {members.length === 0 ? (
            <p className="text-muted-foreground">No hay directivos</p>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {members.map((member) => (
                <DirectivaCard
                  key={member.id}
                  id={member.id}
                  nombre={member.nombre}
                  cargo={member.cargo}
                  descripcion={member.descripcion}
                  foto_url={member.foto_url}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}