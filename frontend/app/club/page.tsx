import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { clubApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";

async function getClubInfo() {
  const { data } = await clubApi.getInfo();
  return data;
}

export default async function ClubPage() {
  const club = await getClubInfo();

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb />
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-3">El Club</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              {club?.nombre || "Las Torres FC"}
            </h1>
          </div>

          {club?.historia && (
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-4">
                Nuestra Historia
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {club.historia}
              </p>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {club?.mision && (
              <Card>
                <CardHeader>
                  <CardTitle>Misión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{club.mision}</p>
                </CardContent>
              </Card>
            )}

            {club?.vision && (
              <Card>
                <CardHeader>
                  <CardTitle>Visión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{club.vision}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {(!club?.historia && !club?.mision && !club?.vision) && (
            <div className="text-center py-16 text-muted-foreground">
              <p>Información del clubcoming soon.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}