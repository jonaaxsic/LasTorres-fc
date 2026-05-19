import { getNoticiaDetailClient } from "./NoticiaDetailClient";

// Edge runtime required for Cloudflare Workers
export const runtime = 'edge';

// Generate static params for pre-rendering
export const generateStaticParams = async () => {
  return [];
};

// Allow dynamic routes at runtime
export const dynamicParams = true;

export default getNoticiaDetailClient;