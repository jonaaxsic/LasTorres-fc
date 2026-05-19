import { getNoticiaDetailClient } from "./NoticiaDetailClient";

// Required for output: 'export' - must export generateStaticParams
export const generateStaticParams = () => Promise.resolve([]);

// Allow dynamic routes at runtime
export const dynamicParams = true;

export default getNoticiaDetailClient;