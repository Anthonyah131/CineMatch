/**
 * Types para el módulo de Media Cache (caché local de TMDB)
 */

export type MediaType = 'movie' | 'tv';

/**
 * Media cacheado en Firestore
 */
export interface MediaCache {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string;
  releaseYear: number;
  genres: number[];
  voteAverage: number;
  updatedAt: string;
  overview?: string;
  backdropPath?: string;
  originalLanguage?: string;
  popularity?: number;
  adult?: boolean;
  runtime?: number;
  budget?: number;
  revenue?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  episodeRunTime?: number[];
  firstAirDate?: string;
  lastAirDate?: string;
  status?: string;
}

/**
 * Respuesta de endpoint híbrido
 */
export interface HybridResponse<T> {
  source: 'cache' | 'tmdb';
  data: T;
}

/**
 * Estadísticas del caché
 */
export interface CacheStats {
  totalCached: number;
  moviesCached: number;
  tvCached: number;
}

/**
 * Filtros de búsqueda en caché
 */
export interface MediaSearchFilters {
  mediaType?: MediaType;
  genres?: number[];
  releaseYear?: number;
  minVoteAverage?: number;
  maxVoteAverage?: number;
  limit?: number;
}

/**
 * Mensaje de respuesta genérico
 */
export interface CacheMessage {
  message: string;
}
