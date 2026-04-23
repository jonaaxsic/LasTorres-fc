// ============================================
// API Layer - Las Torres FC
// Simplyfied para debug
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Helper obtener token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// Fetch simple
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Manejar códigos de estado
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      return { error: "Sesión expirada" };
    }

    if (response.status === 403) {
      return { error: "No tienes permisos" };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.detail || errorData.message || `Error ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error de conexión";
    return { error: message };
  }
}

// =====================
// Auth
// =====================
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  accessToken?: string;
  token_type?: string;
  expires_in?: number;
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
  email?: string;
  rol: string;
  username?: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    fetchApi<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.username,
        password: credentials.password,
      }),
    }),

  me: () => fetchApi<User>("/api/auth/me"),
};

// =====================
// News
// =====================
export interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  featured?: boolean;
  created_at: string;
}

export interface NewsCreate {
  title: string;
  content: string;
  image_url?: string;
  featured?: boolean;
}

export const newsApi = {
  getAll: () => fetchApi<News[]>("/api/news"),
  getById: (id: number) => fetchApi<News>(`/api/noticias/${id}`),
  create: (data: NewsCreate) =>
    fetchApi<News>("/api/noticias/", {
      method: "POST",
      body: JSON.stringify({
        titulo: data.title,      // Map title -> titulo
        contenido: data.content,
        imagen_url: data.image_url,
        featured: data.featured,
      }),
    }),
  update: (id: number, data: Partial<NewsCreate>) =>
    fetchApi<News>(`/api/noticias/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        titulo: data.title,
        contenido: data.content,
        imagen_url: data.image_url,
      }),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/noticias/${id}`, {
      method: "DELETE",
    }),
};

// =====================
// Events
// =====================
export interface Event {
  id: number;
  titulo: string;
  descripcion?: string;
  imagen_url?: string;
  fecha: string;
  hora?: string;
  lugar?: string;
  tipo_evento?: string;
}

export interface EventCreate {
  title: string;
  description?: string;
  image_url?: string;
  date: string;
  time?: string;
  location?: string;
  event_type?: string;
}

export const eventsApi = {
  getAll: () => fetchApi<Event[]>("/api/events/"),
  getById: (id: number) => fetchApi<Event>(`/api/events/${id}`),
  create: (data: EventCreate) =>
    fetchApi<Event>("/api/events/", {
      method: "POST",
      body: JSON.stringify({
        titulo: data.title,
        descripcion: data.description,
        imagen_url: data.image_url,
        fecha: data.date,
        hora: data.time,
        lugar: data.location,
        tipo_evento: data.event_type || "evento",
      }),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/events/${id}`, {
      method: "DELETE",
    }),
};

// =====================
// Matches
// =====================
export interface Match {
  id: number;
  rival: string;
  logo_rival?: string;
  fecha: string;
  hora?: string;
  lugar: string;
  marca_local?: number;
  marca_visitante?: number;
  es_local: boolean;
  categoria?: string;
  estado?: string;
}

export interface MatchCreate {
  opponent: string;
  opponent_logo?: string;
  date: string;
  time?: string;
  location: string;
  home_score?: number;
  away_score?: number;
  is_home: boolean;
  category?: string;
  status?: string;
}

export const matchesApi = {
  getAll: () => fetchApi<Match[]>("/api/matches/"),
  getUpcoming: () => fetchApi<Match[]>("/api/matches/upcoming"),
  getResults: () => fetchApi<Match[]>("/api/matches/results"),
  getById: (id: number) => fetchApi<Match>(`/api/matches/${id}`),
  create: (data: MatchCreate) =>
    fetchApi<Match>("/api/matches/", {
      method: "POST",
      body: JSON.stringify({
        rival: data.opponent,
        logo_rival: data.opponent_logo,
        fecha: data.date,
        hora: data.time,
        lugar: data.location,
        marca_local: data.home_score,
        marca_visitante: data.away_score,
        es_local: data.is_home,
        categoria: data.category,
        estado: data.status || "programado",
      }),
    }),
  update: (id: number, data: Partial<MatchCreate>) =>
    fetchApi<Match>(`/api/matches/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/matches/${id}`, {
      method: "DELETE",
    }),
};

// =====================
// Players
// =====================
export interface Player {
  id: number;
  nombre?: string;
  name?: string;
  fecha_nacimiento?: string;
  birthdate?: string;
  categoria_id?: number;
  posicion_id?: number;
  foto_url?: string;
  photo_url?: string;
  categoria?: { id: number; nombre: string };
  posicion?: { id: number; nombre: string };
}

export interface PlayerCreate {
  nombre: string;
  fecha_nacimiento: string;
  categoria_id: number;
  posicion_id: number;
  foto_url?: string;
}

export const playersApi = {
  getAll: () => fetchApi<Player[]>("/api/jugadores"),
  getById: (id: number) => fetchApi<Player>(`/api/jugadores/${id}`),
  create: (data: PlayerCreate) =>
    fetchApi<Player>("/api/jugadores/", {
      method: "POST",
      body: JSON.stringify({
        nombre: data.nombre,
        fecha_nacimiento: data.fecha_nacimiento,
        categoria_id: data.categoria_id,
        posicion_id: data.posicion_id,
        foto_url: data.foto_url,
      }),
    }),
  update: (id: number, data: Partial<PlayerCreate>) =>
    fetchApi<Player>(`/api/jugadores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/jugadores/${id}`, {
      method: "DELETE",
    }),
};

// =====================
// Gallery
// =====================
export interface GalleryImage {
  id: number;
  url: string;
  name?: string;
  title?: string;
  description?: string;
  created_at?: string;
}

export const galleryApi = {
  getAll: () => fetchApi<GalleryImage[]>("/api/galeria"),
  upload: (file: File, folder: string = "galeria"): Promise<ApiResponse<{ url: string }>> => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve) => {
      fetch(`${API_BASE_URL}/api/upload?folder=${folder}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
        .then(async (r) => {
          if (!r.ok) {
            const e = await r.json().catch(() => ({}));
            resolve({ error: e.detail || "Error" });
            return;
          }
          const d = await r.json();
          resolve({ data: d });
        })
        .catch((e) => resolve({ error: e.message }));
    });
  },
  delete: (id: number) =>
    fetchApi<void>(`/api/galeria/${id}`, { method: "DELETE" }),
};

// =====================
// Team
// =====================
export interface TeamMember {
  id: number;
  nombre?: string;
  name?: string;
  cargo?: string;
  role?: string;
  foto_url?: string;
  photo_url?: string;
  descripcion?: string;
  description?: string;
}

export const teamApi = {
  getAll: () => fetchApi<TeamMember[]>("/api/directiva"),
};

// =====================
// School
// =====================
export interface SchoolCategory {
  id: number;
  categoria?: string;
  category?: string;
  horario?: string;
  schedule?: string;
  entrada?: string;
  entry?: string;
  descripcion?: string;
  description?: string;
}

export const schoolApi = {
  getAll: () => fetchApi<SchoolCategory[]>("/api/escuelita"),
};

// =====================
// Club
// =====================
export interface ClubInfo {
  id: number;
  nombre?: string;
  name?: string;
  direccion?: string;
  address?: string;
  telefono?: string;
  phone?: string;
  email?: string;
  historia?: string;
  history?: string;
  mision?: string;
  vision?: string;
  logo_url?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export const clubApi = {
  getInfo: () => fetchApi<ClubInfo>("/api/club"),
};

// =====================
// Upload helper
// =====================
export const uploadFile = async (file: File, folder: string = "noticias"): Promise<ApiResponse<{ url: string }>> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("file", file);
  // Pass folder as query param
  formData.append("folder", folder);

  return new Promise((resolve) => {
    fetch(`${API_BASE_URL}/api/upload?folder=${folder}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
      .then(async (r) => {
        if (!r.ok) {
          const e = await r.json().catch(() => ({}));
          resolve({ error: e.detail || "Error" });
          return;
        }
        const d = await r.json();
        resolve({ data: d });
      })
      .catch((e) => resolve({ error: e.message }));
  });
};

// =====================
// Default export
// =====================
export default {
  auth: authApi,
  news: newsApi,
  events: eventsApi,
  matches: matchesApi,
  players: playersApi,
  gallery: galleryApi,
  team: teamApi,
  school: schoolApi,
  club: clubApi,
};