"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User, Home, Users, Trophy, GraduationCap, Newspaper, Image, Mail, Shield } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/club", label: "El Club", icon: Shield },
  { href: "/directiva", label: "Directiva", icon: Users },
  { href: "/jugadores", label: "Plantel", icon: Trophy },
  { href: "/escuelita", label: "Escuelita", icon: GraduationCap },
  { href: "/noticias", label: "Noticias", icon: Newspaper },
  { href: "/galeria", label: "Galería", icon: Image },
  { href: "/contacto", label: "Contacto", icon: Mail },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-[#0a0a0a] border-b-2 border-primary">
        <div className="flex items-center justify-between h-full px-4 max-w-7xl mx-auto">
          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-foreground hover:text-primary transition-colors lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/logos/logoClub.png"
              alt="Las Torres FC"
              className="w-10 h-10 object-contain rounded-full"
            />
            <span className="font-heading font-bold text-xl tracking-tight hidden sm:block">
              LAS TORRES FC
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User icon */}
          <Link 
            href="/admin/login" 
            className="p-2 text-foreground hover:text-primary transition-colors" 
            aria-label="Iniciar sesión"
          >
            <User className="w-6 h-6" />
          </Link>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <img 
                src="https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/logos/logoClub.png"
                alt="Las Torres FC"
                className="w-12 h-12 object-contain rounded-full"
              />
              <div>
                <span className="font-heading font-bold text-lg block">LAS TORRES FC</span>
                <span className="text-xs text-muted-foreground">Club de Fútbol</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 text-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Link 
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 w-full px-2 py-3 text-foreground hover:text-primary transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Iniciar sesión</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
