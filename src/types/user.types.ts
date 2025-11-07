/**
 * Types para el módulo de Users (gestión de usuarios y perfiles)
 */

export type MediaType = 'movie' | 'tv';
export type AuthProviderType = 'google' | 'facebook' | 'apple' | 'email';

/**
 * Item favorito de usuario
 */
export interface FavoriteItem {
  tmdbId: number;
  title: string;
  mediaType: MediaType;
  posterPath: string;
  addedAt: string;
}

/**
 * Configuración de privacidad
 */
export interface PrivacySettings {
  showEmail: boolean;
  showBirthdate: boolean;
}

/**
 * Configuración de usuario
 */
export interface UserSettings {
  language: string;
  region: string;
  privacy: PrivacySettings;
}

/**
 * Proveedor de autenticación
 */
export interface AuthProvider {
  provider: AuthProviderType;
  providerId: string;
  linkedAt: string;
}

/**
 * Usuario completo
 */
export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  birthdate: string;
  favorites: FavoriteItem[];
  followersCount: number;
  followingCount: number;
  settings: UserSettings;
  authProviders: AuthProvider[];
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Perfil público de usuario con estadísticas
 */
export interface UserProfile {
  user: {
    displayName: string;
    email: string;
    photoURL: string;
    bio: string;
    followersCount: number;
    followingCount: number;
  };
  stats: {
    totalFavorites: number;
    followersCount: number;
    followingCount: number;
  };
  recentFavorites: FavoriteItem[];
}

/**
 * DTO para crear usuario
 */
export interface CreateUserDto {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  birthdate?: string;
  authProvider?: {
    provider: AuthProviderType;
    providerId: string;
  };
  emailVerified?: boolean;
}

/**
 * DTO para actualizar perfil
 */
export interface UpdateUserDto {
  displayName?: string;
  photoURL?: string;
  bio?: string;
  birthdate?: string;
  settings?: Partial<UserSettings>;
}

/**
 * DTO para agregar favorito
 */
export interface AddFavoriteDto {
  tmdbId: number;
  title: string;
  mediaType: MediaType;
  posterPath: string;
}

/**
 * Seguidor con información básica
 */
export interface FollowerWithInfo {
  uid: string;
  displayName: string;
  photoURL: string;
  bio: string;
  followedAt: string;
}

/**
 * Usuario seguido con información básica
 */
export interface FollowingWithInfo {
  uid: string;
  displayName: string;
  photoURL: string;
  bio: string;
  followedAt: string;
}

/**
 * Respuesta de verificación de seguimiento
 */
export interface IsFollowingResponse {
  isFollowing: boolean;
}
