import { getEditarNoticiaClient } from "./EditarNoticiaClient";

export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lastorresfc.onrender.com';
    const response = await fetch(`${API_URL}/api/noticias`, {
      next: { revalidate: 0 }
    });
    const noticias = await response.json();
    return noticias.map((noticia: { id: number }) => ({
      id: String(noticia.id),
    }));
  } catch (error) {
    console.error('Error fetching noticias for generateStaticParams:', error);
    return [];
  }
}

export const dynamicParams = true;

export default getEditarNoticiaClient;