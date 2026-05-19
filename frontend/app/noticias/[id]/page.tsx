import { getNoticiaDetailClient } from "./NoticiaDetailClient";

// Required for output: 'export' - async function returns array
export async function generateStaticParams() {
  return [];
}

// Allow dynamic routes at runtime
export const dynamicParams = true;

export default getNoticiaDetailClient;