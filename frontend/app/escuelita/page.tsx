import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Video, UserPlus, Heart } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import Image from "next/image";

export default function EscuelitaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-3">Escuelita</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Escuela de Fútbol Las Torres FC
            </h1>
            <p className="text-muted-foreground mt-3">
              Formando futuros campeones desde hace años
            </p>
          </div>

          {/* Imagen principal */}
          <div className="relative w-full aspect-video mb-12 rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dyslpppz8/image/upload/v1/WhatsApp_Image_2024-01-15_at_10.30.15_sf2f3e"
              alt="Escuelita Las Torres FC"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Reseña de la escuela */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-4">
              ¿Quiénes Somos?
            </h2>
            <div className="bg-card p-6 rounded-lg">
              <p className="text-lg leading-relaxed text-muted-foreground">
                La Escuelita de Fútbol Las Torres FC es un proyecto de formación integral 
                para niños y jóvenes de nuestra comunidad. Nuestros objetivos son:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Enseñar los fundamentos técnicos del fútbol
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Fomentar el trabajo en equipo y deportividad
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Crear líder positivo en cada niño y joven
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Brindar un espacio seguro de entretenimiento y aprendizaje
                </li>
              </ul>
            </div>
          </div>

          {/* Horarios */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Horarios de Entrenamiento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Categoría Sub 8 - Sub 10</h3>
                <p className="text-muted-foreground">Sábados 10:00 AM - 12:00 PM</p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Categoría Sub 11 - Sub 13</h3>
                <p className="text-muted-foreground">Sábados 10:00 AM - 12:00 PM</p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Categoría Sub 15</h3>
                <p className="text-muted-foreground">Sábados 10:00 AM - 12:00 PM</p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Categoría Sub 17+</h3>
                <p className="text-muted-foreground">Sábados 10:00 AM - 12:00 PM</p>
              </div>
            </div>
          </div>

          {/*Lugar */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              ¿Dónde Entrenamos?
            </h2>
            <div className="bg-card p-6 rounded-lg">
              <p className="text-lg">
                <strong>Cancha de Las Torres FC</strong>
              </p>
              <p className="text-muted-foreground">Las Torres 2318, Cerro Navia</p>
            </div>
          </div>

          {/* Video TikTok */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" />
              Conoce nuestra Escuelita
            </h2>
            <div className="bg-card p-6 rounded-lg">
              <p className="text-muted-foreground mb-4">
                Mira un preview de nuestras prácticas y entrenamiento
              </p>
              <a 
                href="https://www.tiktok.com/@lastorresfc" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                <Video className="w-4 h-4" />
                Ver en TikTok
              </a>
            </div>
          </div>

          {/* Inscripciones - MUY IMPORTANTE */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              Inscripciones
            </h2>
            <div className="bg-card p-6 rounded-lg border-2 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold">¡TOTALMENTE GRÁTIS!</span>
              </div>
              <p className="text-lg text-muted-foreground">
                La inscripción y participación en la Escuelita de Fútbol Las Torres FC es 
                <strong className="text-primary"> completamente gratuita</strong>. 
                No hay ningún costo para que tu hijo/a participe en nuestros entrenamientos.
              </p>
              <p className="mt-4 text-muted-foreground">
                Para inscribir, simplemente asiste a cualquiera de nuestros entrenamientos 
                en el horario indicado. ¡Todos son bienvenidos!
              </p>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">¡No importa el nivel, lo que importa es la actitud!</p>
              </div>
            </div>
          </div>

          {/* Llamado a la acción */}
          <div className="text-center py-8">
            <p className="text-lg mb-4">¿Qué esperas para inscribir a tu hijo/a?</p>
            <p className="text-muted-foreground">Ven con tu ropa deportiva, mucha energía y conviértete en la próxima estrella de Las Torres FC</p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}