export type EventType = "evento" | "entrenamiento" | "bingo" | "reunion" | "otro" | string;

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed" | "programado" | "en_vivo" | "finalizado" | "postergado" | string;

export const EVENT_TYPE_LABELS: Record<string, string> = {
  evento: "Evento",
  entrenamiento: "Entrenamiento",
  bingo: "Bingo",
  reunion: "Reunión",
  otro: "Otro",
};

export const MATCH_STATUS_LABELS: Record<string, string> = {
  scheduled: "Programado",
  live: "En Vivo",
  finished: "Finalizado",
  postponed: "Postergado",
  programado: "Programado",
  en_vivo: "En Vivo",
  finalizado: "Finalizado",
  postergado: "Postergado",
};

export const CATEGORIES = [
  "Sub-6",
  "Sub-8",
  "Sub-10",
  "Sub-12",
  "Sub-14",
  "Sub-16",
  "Primera",
];
