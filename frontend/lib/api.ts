// ============================================
// API Layer - Las Torres FC
// Patterns: single responsibility, DRY, typed responses
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

// ─── Types ───────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface RefreshState {
  isRefreshing: boolean;
  queue: Array<{ resolve: (value: boolean) => void }>;
}

// ─── Token refresh (singleton) ───────────────────

const refreshState: RefreshState = { isRefreshing: false, queue: [] };

async function tryRefreshToken(): Promise<boolean> {
  if (refreshState.isRefreshing) {
    return new Promise((resolve) => refreshState.queue.push({ resolve }));
  }

  refreshState.isRefreshing = true;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      ...DEFAULT_FETCH_OPTIONS,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    refreshState.isRefreshing = false;
    refreshState.queue.forEach(({ resolve }) => resolve(false));
    refreshState.queue = [];
  }
}

// ─── Core fetch wrapper ──────────────────────────

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 1,
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
      headers: { ...DEFAULT_FETCH_OPTIONS.headers, ...options.headers },
    });

    if (res.status === 401 && retries > 0 && !endpoint.includes("/login")) {
      const refreshed = await tryRefreshToken();
      if (refreshed) return fetchApi<T>(endpoint, options, 0);
      return { error: "Sesión expirada" };
    }

    if (res.status === 403) return { error: "No tienes permisos" };

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.detail ?? body.message ?? `Error ${res.status}` };
    }

    if (res.status === 204) return { data: undefined as T };

    const data = await res.json();
    return { data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de conexión";
    return { error: message };
  }
}

// ─── Auth ────────────────────────────────────────

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  usuario: Usuario;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  email?: string;
  rol: string;
  username?: string;
}

export const authApi = {
  login: (creds: LoginCredentials) =>
    fetchApi<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: creds.username, password: creds.password }),
    }),

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        ...DEFAULT_FETCH_OPTIONS,
      });
    } catch { /* silent */ }
  },

  me: () => fetchApi<Usuario>("/api/auth/me"),
};

// ─── Noticias ────────────────────────────────────

export interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  imagen_url?: string;
  /** @deprecated Usar imagen_url */
  imagenUrl?: string;
  imagen_url_2?: string;
  featured?: boolean;
  fecha_publicacion?: string;
  /** @deprecated Usar fecha_publicacion */
  created_at?: string;
  autor?: string;
}

export interface NoticiaInput {
  titulo: string;
  contenido: string;
  imagen_url?: string;
  imagen_url_2?: string;
  featured?: boolean;
}

export const newsApi = {
  getAll: () => fetchApi<Noticia[]>("/api/noticias/"),
  getById: (id: number) => fetchApi<Noticia>(`/api/noticias/${id}/`),
  create: (data: NoticiaInput) =>
    fetchApi<Noticia>("/api/noticias/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<NoticiaInput>) =>
    fetchApi<Noticia>(`/api/noticias/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) =>
    fetchApi<void>(`/api/noticias/${id}`, { method: "DELETE" }),
};

// ─── Eventos ─────────────────────────────────────

export interface Evento {
  id: number;
  titulo: string;
  /** @deprecated Usar titulo */
  title?: string;
  descripcion?: string;
  /** @deprecated Usar descripcion */
  description?: string;
  imagen_url?: string;
  /** @deprecated Usar imagen_url */
  image_url?: string;
  fecha: string;
  /** @deprecated Usar fecha */
  date?: string;
  hora?: string;
  /** @deprecated Usar hora */
  time?: string;
  lugar?: string;
  /** @deprecated Usar lugar */
  location?: string;
  tipo_evento?: string;
  /** @deprecated Usar tipo_evento */
  event_type?: string;
}

export interface EventoInput {
  titulo: string;
  /** @deprecated Usar titulo */
  title?: string;
  descripcion?: string;
  /** @deprecated Usar descripcion */
  description?: string;
  imagen_url?: string;
  /** @deprecated Usar imagen_url */
  image_url?: string;
  fecha: string;
  /** @deprecated Usar fecha */
  date?: string;
  hora?: string;
  /** @deprecated Usar hora */
  time?: string;
  lugar?: string;
  /** @deprecated Usar lugar */
  location?: string;
  tipo_evento?: string;
  /** @deprecated Usar tipo_evento */
  event_type?: string;
}

export const eventsApi = {
  getAll: () => fetchApi<Evento[]>("/api/events"),
  getById: (id: number) => fetchApi<Evento>(`/api/events/${id}`),
  create: (data: EventoInput) =>
    fetchApi<Evento>("/api/events/", {
      method: "POST",
      body: JSON.stringify({
        titulo: data.titulo || data.title,
        descripcion: data.descripcion || data.description,
        imagen_url: data.imagen_url || data.image_url,
        fecha: data.fecha || data.date,
        hora: data.hora || data.time,
        lugar: data.lugar || data.location,
        tipo_evento: data.tipo_evento || data.event_type || "evento",
      }),
    }),
  update: (id: number, data: Partial<EventoInput>) =>
    fetchApi<Evento>(`/api/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...(data.titulo || data.title ? { titulo: data.titulo || data.title } : {}),
        ...(data.descripcion || data.description ? { descripcion: data.descripcion || data.description } : {}),
        ...(data.imagen_url || data.image_url ? { imagen_url: data.imagen_url || data.image_url } : {}),
        ...(data.fecha || data.date ? { fecha: data.fecha || data.date } : {}),
        ...(data.hora || data.time ? { hora: data.hora || data.time } : {}),
        ...(data.lugar || data.location ? { lugar: data.lugar || data.location } : {}),
        ...(data.tipo_evento || data.event_type ? { tipo_evento: data.tipo_evento || data.event_type } : {}),
      }),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/events/${id}`, { method: "DELETE" }),
};

// ─── Partidos ────────────────────────────────────

export interface Partido {
  id: number;
  rival: string;
  /** @deprecated Usar rival */
  opponent?: string;
  logo_rival?: string;
  /** @deprecated Usar logo_rival */
  opponent_logo?: string;
  fecha: string;
  /** @deprecated Usar fecha */
  date?: string;
  hora?: string;
  /** @deprecated Usar hora */
  time?: string;
  lugar: string;
  /** @deprecated Usar lugar */
  location?: string;
  marca_local?: number;
  /** @deprecated Usar marca_local */
  home_score?: number;
  marca_visitante?: number;
  /** @deprecated Usar marca_visitante */
  away_score?: number;
  es_local: boolean;
  /** @deprecated Usar es_local */
  is_home?: boolean;
  categoria?: string;
  estado?: string;
  /** @deprecated Usar estado */
  status?: string;
}

export interface PartidoInput {
  rival: string;
  /** @deprecated Usar rival */
  opponent?: string;
  logo_rival?: string;
  /** @deprecated Usar logo_rival */
  opponent_logo?: string;
  fecha: string;
  /** @deprecated Usar fecha */
  date?: string;
  hora?: string;
  /** @deprecated Usar hora */
  time?: string;
  lugar: string;
  /** @deprecated Usar lugar */
  location?: string;
  marca_local?: number;
  /** @deprecated Usar marca_local */
  home_score?: number;
  marca_visitante?: number;
  /** @deprecated Usar marca_visitante */
  away_score?: number;
  es_local: boolean;
  /** @deprecated Usar es_local */
  is_home?: boolean;
  categorias: string[];
  /** @deprecated Usar categorias */
  categories?: string[];
  estado?: string;
  /** @deprecated Usar estado */
  status?: string;
}

export interface PartidoUpdate {
  estado?: string;
  marca_local?: number;
  marca_visitante?: number;
  rival?: string;
  fecha?: string;
  hora?: string;
  lugar?: string;
  logo_rival?: string;
  es_local?: boolean;
  categorias?: string[];
  /** @deprecated Usar categorias */
  categories?: string[];
}

/** Convierte JSON de categorías de la API a array */
export function parseCategorias(raw?: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return raw ? [raw] : [];
  }
}

export const matchesApi = {
  getAll: () => fetchApi<Partido[]>("/api/matches"),
  getUpcoming: () => fetchApi<Partido[]>("/api/matches/upcoming"),
  getResults: () => fetchApi<Partido[]>("/api/matches/results"),
  getById: (id: number) => fetchApi<Partido>(`/api/matches/${id}`),
  create: (data: PartidoInput) =>
    fetchApi<Partido>("/api/matches/", {
      method: "POST",
      body: JSON.stringify({
        rival: data.rival,
        logo_rival: data.logo_rival,
        fecha: data.fecha,
        hora: data.hora,
        lugar: data.lugar,
        marca_local: data.marca_local,
        marca_visitante: data.marca_visitante,
        es_local: data.es_local,
        categoria: JSON.stringify(data.categorias),
        estado: data.estado ?? "programado",
      }),
    }),
  update: (id: number, data: PartidoUpdate) =>
    fetchApi<Partido>(`/api/matches/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...data,
        ...(data.categorias ? { categoria: JSON.stringify(data.categorias) } : {}),
      }),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/matches/${id}`, { method: "DELETE" }),
};

// ─── Jugadores ───────────────────────────────────

export interface Jugador {
  id: number;
  nombre: string;
  /** @deprecated Usar nombre */
  name?: string;
  fecha_nacimiento?: string;
  /** @deprecated Usar fecha_nacimiento */
  birthdate?: string;
  categoria_id?: number;
  posicion_id?: number;
  foto_url?: string;
  /** @deprecated Usar foto_url */
  photo_url?: string;
  categoria?: { id: number; nombre: string };
  posicion?: { id: number; nombre: string };
}

export interface JugadorInput {
  nombre: string;
  fecha_nacimiento: string;
  categoria_id: number;
  posicion_id: number;
  foto_url?: string;
}

export const playersApi = {
  getAll: () => fetchApi<Jugador[]>("/api/jugadores"),
  getById: (id: number) => fetchApi<Jugador>(`/api/jugadores/${id}`),
  create: (data: JugadorInput) =>
    fetchApi<Jugador>("/api/jugadores/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<JugadorInput>) =>
    fetchApi<Jugador>(`/api/jugadores/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) =>
    fetchApi<void>(`/api/jugadores/${id}`, { method: "DELETE" }),
};

// ─── Galería ─────────────────────────────────────

export interface GaleriaImagen {
  id: number;
  url: string;
  titulo?: string;
  /** @deprecated Usar titulo */
  title?: string;
  /** @deprecated Usar titulo */
  name?: string;
  descripcion?: string;
  created_at?: string;
}

export const galleryApi = {
  getAll: () => fetchApi<GaleriaImagen[]>("/api/galeria"),
  upload: (data: { url: string; titulo?: string; title?: string; descripcion?: string }) =>
    fetchApi<GaleriaImagen>("/api/galeria", {
      method: "POST",
      body: JSON.stringify({ ...data, titulo: data.titulo ?? data.title }),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/galeria/${id}`, { method: "DELETE" }),
};

// ─── Directiva ───────────────────────────────────

export interface Directivo {
  id: number;
  nombre: string;
  cargo: string;
  foto_url?: string;
  descripcion?: string;
}

export interface DirectivoInput {
  nombre: string;
  cargo: string;
  descripcion?: string;
  foto_url?: string;
}

export const teamApi = {
  getAll: () => fetchApi<Directivo[]>("/api/directiva"),
  create: (data: DirectivoInput) =>
    fetchApi<Directivo>("/api/directiva/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: DirectivoInput) =>
    fetchApi<Directivo>(`/api/directiva/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) =>
    fetchApi<void>(`/api/directiva/${id}/`, { method: "DELETE" }),
};

// ─── Escuelita ───────────────────────────────────

export interface CategoriaEscuelita {
  id: number;
  categoria?: string;
  horario?: string;
  entrada?: string;
  descripcion?: string;
}

export const schoolApi = {
  getAll: () => fetchApi<CategoriaEscuelita[]>("/api/escuelita"),
};

// ─── Club ────────────────────────────────────────

export interface InfoClub {
  id: number;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  historia?: string;
  mision?: string;
  vision?: string;
  logo_url?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export const clubApi = {
  getInfo: () => fetchApi<InfoClub>("/api/club"),
};

// ─── Upload ──────────────────────────────────────

// ─── Backward-compatible aliases (@deprecated) ───
/** @deprecated Usar Noticia */
export type News = Noticia;
/** @deprecated Usar NoticiaInput */
export type NewsCreate = NoticiaInput;
/** @deprecated Usar Partido */
export type Match = Partido;
/** @deprecated Usar PartidoInput */
export type MatchCreate = PartidoInput;
/** @deprecated Usar PartidoUpdate */
// MatchUpdate ya no existe, usar PartidoUpdate
/** @deprecated Usar Evento */
export type Event = Evento;
/** @deprecated Usar EventoInput */
export type EventCreate = EventoInput;
/** @deprecated Usar GaleriaImagen */
export type GalleryImage = GaleriaImagen;
/** @deprecated Usar Jugador */
export type Player = Jugador;
/** @deprecated Usar Directivo */
export type TeamMember = Directivo;

export const uploadFile = async (
  file: File,
  folder = "noticias",
): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    const res = await fetch(`${API_BASE_URL}/api/upload?folder=${folder}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.detail ?? "Error al subir archivo" };
    }

    const data = await res.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de conexión" };
  }
};
