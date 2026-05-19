import { getEditarNoticiaClient } from "./EditarNoticiaClient";

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default getEditarNoticiaClient;