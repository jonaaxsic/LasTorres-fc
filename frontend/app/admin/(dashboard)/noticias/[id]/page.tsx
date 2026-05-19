// Server Component wrapper con generateStaticParams para output: 'export'
import { getEditarNoticiaClient } from "./EditarNoticiaClient";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default getEditarNoticiaClient;