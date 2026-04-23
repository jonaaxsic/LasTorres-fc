"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { clubApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simular envío
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb />
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-3">Contacto</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Contáctanos
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información de contacto */}
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                ¿Tienes alguna consulta? ¿Quieres más información sobre el club?
                ¡Escríbenos!
              </p>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Correo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="mailto:contacto@lastorresfc.cl" className="text-primary hover:underline">
                    contacto@lastorresfc.cl
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Teléfono
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="tel:+56912345678" className="text-primary hover:underline">
                    +56 9 1234 5678
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Dirección
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Las Torres, Chile</p>
                </CardContent>
              </Card>
            </div>

            {/* Formulario */}
            <Card>
              <CardContent className="pt-6">
                {sent ? (
                  <div className="text-center py-8">
                    <p className="text-green-600 font-bold text-lg mb-2">¡Mensaje enviado!</p>
                    <p className="text-muted-foreground">Gracias por contactarnos. Te responderemos pronto.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nombre</label>
                      <Input
                        placeholder="Tu nombre"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Correo</label>
                      <Input
                        type="email"
                        placeholder="tu@correo.cl"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Mensaje</label>
                      <Textarea
                        placeholder="Tu mensaje..."
                        rows={4}
                        value={form.mensaje}
                        onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={sending}>
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}