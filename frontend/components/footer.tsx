import Link from "next/link";
import { Globe, MessageCircle, Share2, Play, MapPin, Phone, Mail } from "lucide-react";

const socialLinks = [
  { href: "#", icon: Globe, label: "Facebook" },
  { href: "#", icon: MessageCircle, label: "Instagram" },
  { href: "#", icon: Share2, label: "Twitter" },
  { href: "#", icon: Play, label: "YouTube" },
];

const quickLinks = [
  { href: "/club", label: "El Club" },
  { href: "/jugadores", label: "Plantel" },
  { href: "/noticias", label: "Noticias" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-xl">LT</span>
              </div>
              <div>
                <span className="font-heading font-bold text-lg block">LAS TORRES FC</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Más que un club, una familia. Formando deportistas y personas desde 1985.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-heading font-bold uppercase tracking-wider mb-4">
              Enlaces
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-heading font-bold uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Av. Las Torres 1234, Ciudad</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@lastorresfc.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center md:text-left">
            <h4 className="font-heading font-bold uppercase tracking-wider mb-4">
              Síguenos
            </h4>
            <div className="flex items-center justify-center md:justify-start gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Las Torres FC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
