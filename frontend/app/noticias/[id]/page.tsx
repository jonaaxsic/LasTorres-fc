// Server Component wrapper con generateStaticParams para output: 'export'
import { getNoticiaDetailClient } from "./NoticiaDetailClient";

// Required for output: 'export' - no pre-generation, client handles routing
export function generateStaticParams() {
  return [];
}

// Disable dynamic params to avoid build errors in static export mode
export const dynamicParams = true;

export default getNoticiaDetailClient;