/**
 * Types para el módulo de Media Logs (historial de visualización)
 */

export type MediaType = 'movie' | 'tv';

/**
 * Timestamp de Firestore
 */
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Log de visualización completo
 */
export interface MediaLog {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  watchedAt: FirestoreTimestamp;
  hadSeenBefore: boolean;
  rating?: number;
  review?: string;
  reviewLang?: string;
  notes?: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

/**
 * DTO para registrar visualización
 */
export interface LogMediaViewDto {
  tmdbId: number;
  mediaType: MediaType;
  hadSeenBefore: boolean;
  watchedAt?: FirestoreTimestamp;
  rating?: number;
  review?: string;
  reviewLang?: string;
  notes?: string;
}

/**
 * DTO para actualizar log
 */
export interface UpdateMediaLogDto {
  rating?: number;
  review?: string;
  reviewLang?: string;
  notes?: string;
}

/**
 * Estadísticas de visualización del usuario
 */
export interface UserMediaStats {
  totalMoviesWatched: number;
  totalTvShowsWatched: number;
  totalViews: number;
  totalReviews: number;
  averageRating: number;
  lastWatchedAt?: FirestoreTimestamp;
}

/**
 * Mensaje de respuesta genérico
 */
export interface LogMessage {
  message: string;
}
