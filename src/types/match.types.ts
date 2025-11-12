/**
 * Tipos para sistema de matching entre usuarios
 */

/**
 * Timestamp de Firestore
 */
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Match potencial con otro usuario
 */
export interface PotentialMatch {
  userId: string; // UID del otro usuario
  displayName?: string; // Nombre del usuario
  photoURL?: string; // Foto de perfil
  movieId: number; // ID de TMDb de la película
  movieTitle?: string; // Título de la película
  moviePosterPath?: string; // Path del poster
  theirWatchedAt: string | FirestoreTimestamp; // Cuándo la vio el otro usuario
  myWatchedAt: string | FirestoreTimestamp; // Cuándo la viste tú
  daysAgo: number; // Hace cuántos días (para ordenar)
  myRating?: number; // Mi rating de 1-5 estrellas
  theirRating?: number; // Su rating de 1-5 estrellas
}

/**
 * Respuesta de matches
 */
export interface MatchesResponse {
  matches: PotentialMatch[]; // Array de matches
  total: number; // Total de matches encontrados
}

/**
 * Filtros para búsqueda de matches
 */
export interface MatchFilters {
  maxDaysAgo?: number; // Default: 30 días
  minRating?: number; // Rating mínimo (1-5)
  limit?: number; // Default: 50
}
