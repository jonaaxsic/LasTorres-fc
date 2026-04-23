"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();

  // No mostrar en home
  if (pathname === "/") return null;

  // Convertir pathname a segmentos
  const segments = pathname.split("/").filter(Boolean);

  // No mostrar si solo hay un segmento (como /noticias)
  if (segments.length === 0) return null;

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    ...segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      // Convertir slug a texto legible
      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return { label, href };
    }),
  ];

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <div key={item.href} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground/50" />}
            {isLast ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {index === 0 ? <Home className="w-4 h-4" /> : item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}