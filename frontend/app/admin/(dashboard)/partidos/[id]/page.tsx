import { getEditarPartidoClient } from "./EditarPartidoClient";

// Edge runtime required for Cloudflare Workers
export const runtime = 'edge';

export const generateStaticParams = async () => {
  return [];
};

export const dynamicParams = true;

export default getEditarPartidoClient;