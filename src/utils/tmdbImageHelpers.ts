/**
 * 🖼️ TMDB Image Helpers
 * Utilidades para construir URLs de imágenes de TMDB
 */

import type {
  TmdbImageSize,
  TmdbBackdropSize,
  TmdbProfileSize,
  TmdbLogoSize,
} from '../types/tmdb.types';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Construye la URL completa para un poster de película/serie
 * @param path - Path del poster (ej: "/abc123.jpg")
 * @param size - Tamaño deseado (default: w500)
 */
export const buildPosterUrl = (
  path: string | null,
  size: TmdbImageSize = 'w500',
): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Construye la URL completa para un backdrop (fondo)
 * @param path - Path del backdrop
 * @param size - Tamaño deseado (default: w1280)
 */
export const buildBackdropUrl = (
  path: string | null,
  size: TmdbBackdropSize = 'w1280',
): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Construye la URL completa para una foto de perfil (actor/director)
 * @param path - Path del perfil
 * @param size - Tamaño deseado (default: w185)
 */
export const buildProfileUrl = (
  path: string | null,
  size: TmdbProfileSize = 'w185',
): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Construye la URL completa para un logo (compañía, proveedor)
 * @param path - Path del logo
 * @param size - Tamaño deseado (default: w185)
 */
export const buildLogoUrl = (
  path: string | null,
  size: TmdbLogoSize = 'w185',
): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Construye la URL completa para cualquier imagen en su tamaño original
 * @param path - Path de la imagen
 */
export const buildOriginalImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/original${path}`;
};

/**
 * Obtiene múltiples URLs para un poster en diferentes tamaños
 * Útil para implementar srcset en imágenes responsivas
 */
export const buildPosterSrcSet = (
  path: string | null,
): { [key in TmdbImageSize]: string | null } | null => {
  if (!path) return null;

  return {
    w92: buildPosterUrl(path, 'w92'),
    w154: buildPosterUrl(path, 'w154'),
    w185: buildPosterUrl(path, 'w185'),
    w342: buildPosterUrl(path, 'w342'),
    w500: buildPosterUrl(path, 'w500'),
    w780: buildPosterUrl(path, 'w780'),
    original: buildOriginalImageUrl(path),
  };
};

/**
 * Obtiene múltiples URLs para un backdrop en diferentes tamaños
 */
export const buildBackdropSrcSet = (
  path: string | null,
): { [key in TmdbBackdropSize]: string | null } | null => {
  if (!path) return null;

  return {
    w300: buildBackdropUrl(path, 'w300'),
    w780: buildBackdropUrl(path, 'w780'),
    w1280: buildBackdropUrl(path, 'w1280'),
    original: buildOriginalImageUrl(path),
  };
};

/**
 * Construye URL de YouTube para un trailer
 * @param key - Key del video de YouTube
 */
export const buildYouTubeUrl = (key: string): string => {
  return `https://www.youtube.com/watch?v=${key}`;
};

/**
 * Construye URL de thumbnail de YouTube
 * @param key - Key del video de YouTube
 * @param quality - Calidad (default, mqdefault, hqdefault, sddefault, maxresdefault)
 */
export const buildYouTubeThumbnailUrl = (
  key: string,
  quality:
    | 'default'
    | 'mqdefault'
    | 'hqdefault'
    | 'sddefault'
    | 'maxresdefault' = 'hqdefault',
): string => {
  return `https://img.youtube.com/vi/${key}/${quality}.jpg`;
};
