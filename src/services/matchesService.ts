import { apiClient } from './api/apiClient';
import type { PotentialMatch, MatchesResponse } from '../types/match.types';

/**
 * Service para matching entre usuarios basado en películas vistas
 */
class MatchesService {
  private readonly baseUrl = '/matches';

  /**
   * Obtener matches potenciales
   */
  async getPotentialMatches(
    maxDaysAgo: number = 30,
    minRating?: number,
    limit: number = 50,
  ): Promise<MatchesResponse> {
    const params = new URLSearchParams();
    params.append('maxDaysAgo', maxDaysAgo.toString());
    if (minRating) {
      params.append('minRating', minRating.toString());
    }
    params.append('limit', limit.toString());

    return apiClient.get<MatchesResponse>(
      `${this.baseUrl}?${params.toString()}`,
    );
  }

  /**
   * Obtener matches para una película específica
   */
  async getMatchesForMovie(
    movieId: number,
    maxDaysAgo: number = 30,
  ): Promise<PotentialMatch[]> {
    return apiClient.get<PotentialMatch[]>(
      `${this.baseUrl}/movie/${movieId}?maxDaysAgo=${maxDaysAgo}`,
    );
  }

  /**
   * Construir URL de poster
   */
  buildPosterUrl(posterPath: string, size: string = 'w500'): string {
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  /**
   * Formatear tiempo relativo
   */
  formatDaysAgo(daysAgo: number): string {
    if (daysAgo === 0) return 'Hoy';
    if (daysAgo === 1) return 'Ayer';
    if (daysAgo < 7) return `Hace ${daysAgo} días`;
    if (daysAgo < 30) {
      const weeks = Math.floor(daysAgo / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    }
    const months = Math.floor(daysAgo / 30);
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  }

  /**
   * Agrupar matches por película
   */
  groupMatchesByMovie(
    matches: PotentialMatch[],
  ): Record<number, PotentialMatch[]> {
    const groups: Record<number, PotentialMatch[]> = {};

    matches.forEach(match => {
      if (!groups[match.movieId]) {
        groups[match.movieId] = [];
      }
      groups[match.movieId].push(match);
    });

    return groups;
  }

  /**
   * Obtener matches únicos (sin duplicar usuarios)
   */
  getUniqueUsers(matches: PotentialMatch[]): PotentialMatch[] {
    const seen = new Set<string>();
    return matches.filter(match => {
      if (seen.has(match.userId)) {
        return false;
      }
      seen.add(match.userId);
      return true;
    });
  }

  /**
   * Filtrar matches por rating mínimo
   */
  filterByRating(
    matches: PotentialMatch[],
    _minRating: number,
  ): PotentialMatch[] {
    // El backend ya filtra, pero útil para filtrado local
    return matches;
  }

  /**
   * Ordenar matches por más recientes
   */
  sortByRecent(matches: PotentialMatch[]): PotentialMatch[] {
    return [...matches].sort((a, b) => a.daysAgo - b.daysAgo);
  }
}

export const matchesService = new MatchesService();
