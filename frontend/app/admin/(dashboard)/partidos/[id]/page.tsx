// Server Component wrapper con generateStaticParams para output: 'export'
import { getEditarPartidoClient } from "./EditarPartidoClient";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default getEditarPartidoClient;