// Server Component wrapper con generateStaticParams para output: 'export'
// El componente cliente maneja la lógica de runtime
import { getNoticiaDetailClient } from "./NoticiaDetailClient";

export function generateStaticParams() {
  // No pre-generar ninguna ruta en build time - el routing se maneja en cliente
  return [];
}

export default getNoticiaDetailClient;