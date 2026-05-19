import { getEditarPartidoClient } from "./EditarPartidoClient";

export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lastorresfc.onrender.com';
    const response = await fetch(`${API_URL}/api/partidos`, {
      next: { revalidate: 0 }
    });
    const partidos = await response.json();
    return partidos.map((partido: { id: number }) => ({
      id: String(partido.id),
    }));
  } catch (error) {
    console.error('Error fetching partidos for generateStaticParams:', error);
    return [];
  }
}

export const dynamicParams = true;

export default getEditarPartidoClient;