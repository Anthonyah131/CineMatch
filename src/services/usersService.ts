import { apiClient } from './api/apiClient';
import type {
  User,
  UserProfile,
  CreateUserDto,
  UpdateUserDto,
  FavoriteItem,
  AddFavoriteDto,
  FollowerWithInfo,
  FollowingWithInfo,
  IsFollowingResponse,
  MediaType,
} from '../types/user.types';

/**
 * Service para gestión de usuarios, perfiles, favoritos y funcionalidades sociales
 */
class UsersService {
  private readonly baseUrl = '/users';

  /**
   * Obtener usuario por UID
   */
  async getUserById(uid: string): Promise<User> {
    return apiClient.get<User>(`${this.baseUrl}/${uid}`);
  }

  /**
   * Obtener perfil completo con estadísticas
   */
  async getUserProfile(uid: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`${this.baseUrl}/${uid}/profile`);
  }

  /**
   * Actualizar mi perfil
   */
  async updateMyProfile(data: UpdateUserDto): Promise<User> {
    return apiClient.put<User>(`${this.baseUrl}/me`, data);
  }

  /**
   * Crear usuario (normalmente llamado por auth service)
   */
  async createUser(data: CreateUserDto): Promise<User> {
    return apiClient.post<User>(this.baseUrl, data);
  }

  /**
   * Eliminar mi cuenta
   */
  async deleteMyAccount(): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/me`);
  }

  /**
   * Obtener mis favoritos
   */
  async getMyFavorites(): Promise<FavoriteItem[]> {
    return apiClient.get<FavoriteItem[]>(`${this.baseUrl}/me/favorites`);
  }

  /**
   * Obtener favoritos de usuario
   */
  async getUserFavorites(uid: string): Promise<FavoriteItem[]> {
    return apiClient.get<FavoriteItem[]>(`${this.baseUrl}/${uid}/favorites`);
  }

  /**
   * Agregar a favoritos
   */
  async addToFavorites(favorite: AddFavoriteDto): Promise<void> {
    return apiClient.post<void>(`${this.baseUrl}/me/favorites`, favorite);
  }

  /**
   * Eliminar de favoritos
   */
  async removeFromFavorites(
    tmdbId: number,
    mediaType: MediaType,
  ): Promise<void> {
    return apiClient.delete<void>(
      `${this.baseUrl}/me/favorites/${tmdbId}/${mediaType}`,
    );
  }

  /**
   * Seguir usuario
   */
  async followUser(targetUid: string): Promise<void> {
    return apiClient.post<void>(`${this.baseUrl}/follow/${targetUid}`);
  }

  /**
   * Dejar de seguir usuario
   */
  async unfollowUser(targetUid: string): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/follow/${targetUid}`);
  }

  /**
   * Verificar si sigo a usuario
   */
  async isFollowing(targetUid: string): Promise<boolean> {
    const response = await apiClient.get<IsFollowingResponse>(
      `${this.baseUrl}/me/following/${targetUid}`,
    );
    return response.isFollowing;
  }

  /**
   * Obtener mis seguidores
   */
  async getMyFollowers(limit: number = 50): Promise<FollowerWithInfo[]> {
    return apiClient.get<FollowerWithInfo[]>(
      `${this.baseUrl}/me/followers?limit=${limit}`,
    );
  }

  /**
   * Obtener a quién sigo
   */
  async getMyFollowing(limit: number = 50): Promise<FollowingWithInfo[]> {
    return apiClient.get<FollowingWithInfo[]>(
      `${this.baseUrl}/me/following?limit=${limit}`,
    );
  }

  /**
   * Obtener seguidores de usuario
   */
  async getUserFollowers(
    uid: string,
    limit: number = 50,
  ): Promise<FollowerWithInfo[]> {
    return apiClient.get<FollowerWithInfo[]>(
      `${this.baseUrl}/${uid}/followers?limit=${limit}`,
    );
  }

  /**
   * Obtener siguiendo de usuario
   */
  async getUserFollowing(
    uid: string,
    limit: number = 50,
  ): Promise<FollowingWithInfo[]> {
    return apiClient.get<FollowingWithInfo[]>(
      `${this.baseUrl}/${uid}/following?limit=${limit}`,
    );
  }

  /**
   * Buscar usuarios
   */
  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    if (!query.trim()) return [];

    return apiClient.get<User[]>(
      `${this.baseUrl}?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
  }

  /**
   * Verificar si está en favoritos
   */
  async isFavorite(tmdbId: number, mediaType: MediaType): Promise<boolean> {
    const favorites = await this.getMyFavorites();
    return favorites.some(
      fav => fav.tmdbId === tmdbId && fav.mediaType === mediaType,
    );
  }

  /**
   * Construir URL de poster
   */
  buildPosterUrl(posterPath: string, size: string = 'w500'): string {
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  /**
   * Formatear fecha
   */
  formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Obtener iniciales del nombre
   */
  getInitials(displayName: string): string {
    return displayName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

export const usersService = new UsersService();
