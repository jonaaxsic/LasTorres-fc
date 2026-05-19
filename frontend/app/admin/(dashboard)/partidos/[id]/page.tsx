import { getEditarPartidoClient } from "./EditarPartidoClient";

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default getEditarPartidoClient;