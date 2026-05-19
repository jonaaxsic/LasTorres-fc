import { getEditarNoticiaClient } from "./EditarNoticiaClient";

export const generateStaticParams = () => Promise.resolve([]);

export const dynamicParams = true;

export default getEditarNoticiaClient;