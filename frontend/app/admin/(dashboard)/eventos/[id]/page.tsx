import { getEditarEventoClient } from "./EditarEventoClient";

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default getEditarEventoClient;