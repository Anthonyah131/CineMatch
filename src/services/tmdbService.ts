/**
 * 🎬 TMDB Service
 * Servicio para consumir la API de TMDB a través del backend de CineMatch
 */

import { apiClient } from './api/apiClient';
import type {
  TmdbMovie,
  TmdbTVShow,
  TmdbMovieDetails,
  TmdbTVShowDetails,
  TmdbPaginatedResponse,
  TmdbCreditsResponse,
  TmdbWatchProvidersResponse,
  TmdbConfiguration,
  TmdbGenresResponse,
  TmdbDiscoverMovieParams,
  TmdbTimeWindow,
} from '../types/tmdb.types';

const TMDB_BASE_PATH = '/tmdb';

/**
 * 🎥 MOVIES - Servicios de Películas
 */
class TmdbMovieService {
  /**
   * Obtiene películas populares
   * @param page - Número de página (default: 1)
   */
  async getPopular(
    page: number = 1,
  ): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>(
      `${TMDB_BASE_PATH}/movies/popular`,
      { page },
    );
  }

  /**
   * Busca películas por término
   * @param query - Término de búsqueda
   * @param page - Número de página (default: 1)
   */
  async search(
    query: string,
    page: number = 1,
  ): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>(
      `${TMDB_BASE_PATH}/movies/search`,
      { query, page },
    );
  }

  /**
   * Obtiene películas en tendencia
   * @param timeWindow - Ventana de tiempo: "day" | "week" (default: "week")
   */
  async getTrending(
    timeWindow: TmdbTimeWindow = 'week',
  ): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>(
      `${TMDB_BASE_PATH}/movies/trending`,
      { timeWindow },
    );
  }

  /**
   * Obtiene próximos estrenos
   * @param page - Número de página (default: 1)
   */
  async getUpcoming(
    page: number = 1,
  ): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>(
      `${TMDB_BASE_PATH}/movies/upcoming`,
      { page },
    );
  }

  /**
   * Obtiene películas mejor valoradas
   * @param page - Número de página (default: 1)
   */
  async getTopRated(
    page: number = 1,
  ): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>(
      `${TMDB_BASE_PATH}/movies/top-rated`,
      { page },
    );
  }

  /**
   * Descubre películas con filtros avanzados
   * @param filters - Parámetros de filtrado
   * @example
   * ```typescript
   * const action2023 = await tmdbService.movies.discover({
   *   with_genres: '28',
   *   primary_release_year: 2023,
   *   sort_by: 'popularity.desc'
   * });
   * ```
   */
  async discover(
    filters: TmdbDiscoverMovieParams = {},
  ): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>(
      `${TMDB_BASE_PATH}/movies/discover`,
      filters,
    );
  }

  /**
   * Obtiene detalles completos de una película
   * @param id - ID de TMDB de la película
   */
  async getDetails(id: number): Promise<TmdbMovieDetails> {
    return await apiClient.get<TmdbMovieDetails>(
      `${TMDB_BASE_PATH}/movies/${id}`,
    );
  }

  /**
   * Obtiene el cast y crew de una película
   * @param id - ID de TMDB de la película
   */
  async getCredits(id: number): Promise<TmdbCreditsResponse> {
    return await apiClient.get<TmdbCreditsResponse>(
      `${TMDB_BASE_PATH}/movies/${id}/credits`,
    );
  }

  /**
   * Obtiene proveedores de streaming para una película
   * @param id - ID de TMDB de la película
   * @example
   * ```typescript
   * const providers = await tmdbService.movies.getWatchProviders(27205);
   * const mxProviders = providers.results.MX; // Proveedores en México
   * ```
   */
  async getWatchProviders(id: number): Promise<TmdbWatchProvidersResponse> {
    return await apiClient.get<TmdbWatchProvidersResponse>(
      `${TMDB_BASE_PATH}/movies/${id}/watch/providers`,
    );
  }
}

/**
 * 📺 TV SHOWS - Servicios de Series TV
 */
class TmdbTVService {
  /**
   * Obtiene series TV populares
   * @param page - Número de página (default: 1)
   */
  async getPopular(
    page: number = 1,
  ): Promise<TmdbPaginatedResponse<TmdbTVShow>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbTVShow>>(
      `${TMDB_BASE_PATH}/tv/popular`,
      { page },
    );
  }

  /**
   * Busca series TV por término
   * @param query - Término de búsqueda
   * @param page - Número de página (default: 1)
   */
  async search(
    query: string,
    page: number = 1,
  ): Promise<TmdbPaginatedResponse<TmdbTVShow>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbTVShow>>(
      `${TMDB_BASE_PATH}/tv/search`,
      { query, page },
    );
  }

  /**
   * Obtiene series TV en tendencia
   * @param timeWindow - Ventana de tiempo: "day" | "week" (default: "week")
   */
  async getTrending(
    timeWindow: TmdbTimeWindow = 'week',
  ): Promise<TmdbPaginatedResponse<TmdbTVShow>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbTVShow>>(
      `${TMDB_BASE_PATH}/tv/trending`,
      { timeWindow },
    );
  }

  /**
   * Obtiene series TV mejor valoradas
   * @param page - Número de página (default: 1)
   */
  async getTopRated(
    page: number = 1,
  ): Promise<TmdbPaginatedResponse<TmdbTVShow>> {
    return await apiClient.get<TmdbPaginatedResponse<TmdbTVShow>>(
      `${TMDB_BASE_PATH}/tv/top-rated`,
      { page },
    );
  }

  /**
   * Obtiene detalles completos de una serie TV
   * @param id - ID de TMDB de la serie
   */
  async getDetails(id: number): Promise<TmdbTVShowDetails> {
    return await apiClient.get<TmdbTVShowDetails>(`${TMDB_BASE_PATH}/tv/${id}`);
  }

  /**
   * Obtiene el cast y crew de una serie TV
   * @param id - ID de TMDB de la serie
   */
  async getCredits(id: number): Promise<TmdbCreditsResponse> {
    return await apiClient.get<TmdbCreditsResponse>(
      `${TMDB_BASE_PATH}/tv/${id}/credits`,
    );
  }

  /**
   * Obtiene proveedores de streaming para una serie TV
   * @param id - ID de TMDB de la serie
   */
  async getWatchProviders(id: number): Promise<TmdbWatchProvidersResponse> {
    return await apiClient.get<TmdbWatchProvidersResponse>(
      `${TMDB_BASE_PATH}/tv/${id}/watch/providers`,
    );
  }
}

/**
 * ⚙️ CONFIGURATION - Servicios de Configuración
 */
class TmdbConfigService {
  /**
   * Obtiene la configuración de TMDB
   * Incluye URLs base para imágenes y tamaños disponibles
   */
  async getConfiguration(): Promise<TmdbConfiguration> {
    return await apiClient.get<TmdbConfiguration>(
      `${TMDB_BASE_PATH}/configuration`,
    );
  }

  /**
   * Obtiene la lista de géneros de películas
   */
  async getMovieGenres(): Promise<TmdbGenresResponse> {
    return await apiClient.get<TmdbGenresResponse>(
      `${TMDB_BASE_PATH}/genres/movies`,
    );
  }

  /**
   * Obtiene la lista de géneros de series TV
   */
  async getTVGenres(): Promise<TmdbGenresResponse> {
    return await apiClient.get<TmdbGenresResponse>(
      `${TMDB_BASE_PATH}/genres/tv`,
    );
  }
}

/**
 * 🎬 TMDB Service Principal
 * Exporta todos los servicios organizados por categoría
 */
class TmdbService {
  public movies: TmdbMovieService;
  public tv: TmdbTVService;
  public config: TmdbConfigService;

  constructor() {
    this.movies = new TmdbMovieService();
    this.tv = new TmdbTVService();
    this.config = new TmdbConfigService();
  }
}

// Exportar instancia única (singleton)
export const tmdbService = new TmdbService();

// Exportar también las clases por si se necesitan múltiples instancias
export { TmdbMovieService, TmdbTVService, TmdbConfigService };

/**
 * EJEMPLOS DE USO:
 *
 * // Películas populares
 * const popular = await tmdbService.movies.getPopular(1);
 *
 * // Buscar película
 * const results = await tmdbService.movies.search('Inception');
 *
 * // Detalles de película
 * const details = await tmdbService.movies.getDetails(27205);
 *
 * // Películas en tendencia
 * const trending = await tmdbService.movies.getTrending('week');
 *
 * // Descubrir películas de acción de 2023
 * const action = await tmdbService.movies.discover({
 *   with_genres: '28',
 *   primary_release_year: 2023,
 *   sort_by: 'popularity.desc'
 * });
 *
 * // Proveedores de streaming
 * const providers = await tmdbService.movies.getWatchProviders(27205);
 * const mxProviders = providers.results.MX;
 *
 * // Series populares
 * const tvPopular = await tmdbService.tv.getPopular();
 *
 * // Géneros de películas
 * const genres = await tmdbService.config.getMovieGenres();
 *
 * // Configuración (para URLs de imágenes)
 * const config = await tmdbService.config.getConfiguration();
 */
