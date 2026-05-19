// Server Component wrapper con generateStaticParams para output: 'export'
import { getEditarEventoClient } from "./EditarEventoClient";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default getEditarEventoClient;