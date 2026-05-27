import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const CLUB_LOGO = "https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/logos/logoClub.png";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Social together */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <img src={CLUB_LOGO} alt="Las Torres FC" className="w-14 h-14 rounded-full object-cover" />
              <span className="font-heading font-bold text-2xl">LAS TORRES FC</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              Más que un club, una familia. Formando deportistas y personas desde 2025.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <a href="https://web.facebook.com/profile.php?id=61575806463393" target="_blank" rel="noopener noreferrer">
                <img src="https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/logos/face.png" alt="Facebook" className="w-8 h-8 object-contain" />
              </a>
              <a href="https://www.instagram.com/lastorres.f/" target="_blank" rel="noopener noreferrer">
                <img src="https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/logos/insta.png" alt="Instagram" className="w-8 h-8 object-contain" />
              </a>
              <a href="https://www.tiktok.com/@las.torres.f.c" target="_blank" rel="noopener noreferrer">
                <img src="https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/logos/tiktok.png" alt="TikTok" className="w-8 h-8 object-contain" />
              </a>
              <a href="mailto:club.lastorres.fc@gmail.com">
                <img src="https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/logos/logo-Gmail-1.png" alt="Gmail" className="w-8 h-8 object-contain" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-heading font-bold uppercase tracking-wider mb-4 text-lg">Enlaces</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-heading font-bold uppercase tracking-wider mb-4 text-lg">Contacto</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-left">
                  <span>Las Torres 2318</span>
                  <br />
                  <span className="text-sm">Cerro Navia, Santiago</span>
                </div>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-left">
                  <a href="tel:+56974613927" className="hover:text-primary block">+56 9 7461 3927</a>
                  <a href="tel:+56927450414" className="hover:text-primary block text-sm">+56 9 2745 0414</a>
                </div>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:club.lastorres.fc@gmail.com" className="hover:text-primary">club.lastorres.fc@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Las Torres FC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}