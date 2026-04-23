import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { teamApi, TeamMember } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Breadcrumb } from "@/components/breadcrumb";

async function getTeam() {
  const { data } = await teamApi.getAll();
  return data || [];
}

export default async function DirectivaPage() {
  const team = await getTeam();

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

          {team.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No hay miembros de la directiva registrados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member: TeamMember) => (
                <Card key={member.id} className="overflow-hidden">
                  {member.photo_url || member.foto_url ? (
                    <div className="relative aspect-square w-full">
                      <Image
                        src={member.photo_url || member.foto_url || ""}
                        alt={member.nombre || member.name || "Directivo"}
                        fill
                        className="object-cover"
                        sizes="250px"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                  <CardHeader className="p-4 text-center">
                    <CardTitle className="text-lg">
                      {member.nombre || member.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-center">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {member.role || member.cargo}
                    </span>
                    {member.description && (
                      <p className="text-muted-foreground text-sm mt-2">
                        {member.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}