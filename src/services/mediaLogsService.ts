import { apiClient } from './api/apiClient';
import type {
  MediaLog,
  LogMediaViewDto,
  UpdateMediaLogDto,
  UserMediaStats,
  LogMessage,
  MediaType,
  FirestoreTimestamp,
} from '../types/mediaLog.types';

/**
 * Service para gestionar logs de visualización de películas y series
 */
class MediaLogsService {
  private readonly baseUrl = '/media-logs';

  /**
   * Registrar visualización de película o serie
   */
  async logView(logData: LogMediaViewDto): Promise<MediaLog> {
    return apiClient.post<MediaLog>(this.baseUrl, logData);
  }

  /**
   * Obtener mis logs de visualización
   */
  async getMyLogs(limit: number = 50): Promise<MediaLog[]> {
    return apiClient.get<MediaLog[]>(`${this.baseUrl}/my-logs?limit=${limit}`);
  }

  /**
   * Obtener logs de una película/serie específica
   */
  async getMediaLogs(
    tmdbId: number,
    mediaType: MediaType,
  ): Promise<MediaLog[]> {
    return apiClient.get<MediaLog[]>(
      `${this.baseUrl}/my-logs/${tmdbId}/${mediaType}`,
    );
  }

  /**
   * Obtener estadísticas de visualización
   */
  async getMyStats(): Promise<UserMediaStats> {
    return apiClient.get<UserMediaStats>(`${this.baseUrl}/stats/me`);
  }

  /**
   * Obtener log por ID
   */
  async getLogById(logId: string): Promise<MediaLog> {
    return apiClient.get<MediaLog>(`${this.baseUrl}/${logId}`);
  }

  /**
   * Actualizar log
   */
  async updateLog(
    logId: string,
    updateData: UpdateMediaLogDto,
  ): Promise<MediaLog> {
    return apiClient.put<MediaLog>(`${this.baseUrl}/${logId}`, updateData);
  }

  /**
   * Eliminar log
   */
  async deleteLog(logId: string): Promise<LogMessage> {
    return apiClient.delete<LogMessage>(`${this.baseUrl}/${logId}`);
  }

  /**
   * Verificar si el usuario ya vio este contenido
   */
  async hasWatched(tmdbId: number, mediaType: MediaType): Promise<boolean> {
    const logs = await this.getMediaLogs(tmdbId, mediaType);
    return logs.length > 0;
  }

  /**
   * Obtener última calificación para un contenido
   */
  async getLastRating(
    tmdbId: number,
    mediaType: MediaType,
  ): Promise<number | null> {
    const logs = await this.getMediaLogs(tmdbId, mediaType);
    if (logs.length === 0) return null;

    const lastLog = logs[0];
    return lastLog.rating || null;
  }

  /**
   * Formatear fecha de timestamp Firestore
   */
  formatWatchDate(timestamp: FirestoreTimestamp): string {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Renderizar estrellas de calificación
   */
  renderStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      '⭐'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars)
    );
  }

  /**
   * Calcular tiempo total visto (aproximado en minutos)
   */
  calculateTotalWatchTime(
    logs: MediaLog[],
    avgMovieMins: number = 120,
  ): number {
    const movies = logs.filter(log => log.mediaType === 'movie').length;
    const tvShows = logs.filter(log => log.mediaType === 'tv').length;

    return movies * avgMovieMins + tvShows * 600;
  }

  /**
   * Validar rating antes de enviar
   */
  validateRating(rating: number): number {
    return Math.max(0, Math.min(5, rating));
  }
}

export const mediaLogsService = new MediaLogsService();
