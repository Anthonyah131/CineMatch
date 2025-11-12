import { apiClient } from './api/apiClient';
import type {
  MediaCache,
  HybridResponse,
  CacheStats,
  CacheMessage,
  MediaType,
} from '../types/mediaCache.types';
import type { MediaDetailsWithReviews } from '../types/user.types';

/**
 * Service para gestionar el caché local de TMDB
 * Estrategia: Cache-first (consulta caché primero, TMDB después)
 */
class MediaCacheService {
  private readonly baseUrl = '/media-cache';

  /**
   * Buscar en caché por título
   * ⚡ Solo consulta caché local (no llama a TMDB)
   */
  async searchCache(query: string, type?: MediaType): Promise<MediaCache[]> {
    const params = new URLSearchParams({ query });
    if (type) params.append('type', type);

    return apiClient.get<MediaCache[]>(
      `${this.baseUrl}/cache/search?${params.toString()}`,
    );
  }

  /**
   * Obtener populares del caché ordenados por voto promedio
   */
  async getPopularCached(
    mediaType: MediaType,
    limit: number = 20,
  ): Promise<MediaCache[]> {
    return apiClient.get<MediaCache[]>(
      `${this.baseUrl}/cache/popular/${mediaType}?limit=${limit}`,
    );
  }

  /**
   * Obtener recientemente agregados/actualizados en caché
   */
  async getRecentCached(limit: number = 20): Promise<MediaCache[]> {
    return apiClient.get<MediaCache[]>(
      `${this.baseUrl}/cache/recent?limit=${limit}`,
    );
  }

  /**
   * Obtener media específico del caché
   * Retorna null si no existe en caché
   */
  async getCachedMedia(
    tmdbId: number,
    mediaType: MediaType,
  ): Promise<MediaCache | null> {
    try {
      return await apiClient.get<MediaCache>(
        `${this.baseUrl}/cache/${tmdbId}/${mediaType}`,
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Obtener estadísticas del caché
   */
  async getCacheStats(): Promise<CacheStats> {
    return apiClient.get<CacheStats>(`${this.baseUrl}/cache/stats`);
  }

  /**
   * Obtener película con estrategia cache-first
   * ⚡ RECOMENDADO: Usa este en lugar de getCachedMedia
   * Siempre retorna datos (del caché o de TMDB)
   */
  async getMovie(tmdbId: number): Promise<HybridResponse<MediaCache>> {
    return apiClient.get<HybridResponse<MediaCache>>(
      `${this.baseUrl}/hybrid/movie/${tmdbId}`,
    );
  }

  /**
   * Obtener serie con estrategia cache-first
   * ⚡ RECOMENDADO: Usa este en lugar de getCachedMedia
   * Siempre retorna datos (del caché o de TMDB)
   */
  async getTVShow(tmdbId: number): Promise<HybridResponse<MediaCache>> {
    return apiClient.get<HybridResponse<MediaCache>>(
      `${this.baseUrl}/hybrid/tv/${tmdbId}`,
    );
  }

  /**
   * Forzar guardado de película en caché
   */
  async saveMovieToCache(tmdbId: number): Promise<CacheMessage> {
    return apiClient.post<CacheMessage>(
      `${this.baseUrl}/cache/save-movie/${tmdbId}`,
    );
  }

  /**
   * Forzar guardado de serie en caché
   */
  async saveTVShowToCache(tmdbId: number): Promise<CacheMessage> {
    return apiClient.post<CacheMessage>(
      `${this.baseUrl}/cache/save-tv/${tmdbId}`,
    );
  }

  /**
   * Eliminar del caché
   */
  async deleteFromCache(
    tmdbId: number,
    mediaType: MediaType,
  ): Promise<CacheMessage> {
    return apiClient.delete<CacheMessage>(
      `${this.baseUrl}/cache/${tmdbId}/${mediaType}`,
    );
  }

  /**
   * Obtener detalles de una película/serie con reviews de usuarios
   */
  async getMediaDetailsWithReviews(
    tmdbId: number,
    mediaType: MediaType = 'movie',
  ): Promise<MediaDetailsWithReviews> {
    return apiClient.get<MediaDetailsWithReviews>(
      `${this.baseUrl}/${mediaType}/${tmdbId}/details-with-reviews`,
    );
  }

  /**
   * Verificar si el caché es reciente (< 1 día)
   */
  isCacheRecent(updatedAt: string): boolean {
    const cacheDate = new Date(updatedAt);
    const now = new Date();
    const daysDiff =
      (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < 1;
  }

  /**
   * Obtener nombres de géneros desde IDs
   */
  getGenreNames(genreIds: number[], mediaType: MediaType): string[] {
    const movieGenres: Record<number, string> = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western',
    };

    const tvGenres: Record<number, string> = {
      10759: 'Action & Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      10762: 'Kids',
      9648: 'Mystery',
      10763: 'News',
      10764: 'Reality',
      10765: 'Sci-Fi & Fantasy',
      10766: 'Soap',
      10767: 'Talk',
      10768: 'War & Politics',
      37: 'Western',
    };

    const genres = mediaType === 'movie' ? movieGenres : tvGenres;
    return genreIds.map(id => genres[id] || 'Unknown');
  }
}

export const mediaCacheService = new MediaCacheService();
