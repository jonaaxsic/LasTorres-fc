import { getEditarEventoClient } from "./EditarEventoClient";

export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lastorresfc.onrender.com';
    const response = await fetch(`${API_URL}/api/eventos`, {
      next: { revalidate: 0 }
    });
    const eventos = await response.json();
    return eventos.map((evento: { id: number }) => ({
      id: String(evento.id),
    }));
  } catch (error) {
    console.error('Error fetching eventos for generateStaticParams:', error);
    return [];
  }
}

export const dynamicParams = true;

export default getEditarEventoClient;