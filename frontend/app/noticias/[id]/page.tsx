import { getNoticiaDetailClient } from "./NoticiaDetailClient";

// Generate static params - returns empty array for output: export
export const generateStaticParams = async () => {
  return [];
};

// Allow dynamic routes at runtime
export const dynamicParams = true;

export default getNoticiaDetailClient;