/**
 * Types para el módulo de Lists (Listas de películas y series)
 */

export type MediaType = 'movie' | 'tv';

/**
 * Portada de una lista
 */
export interface ListCover {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string;
  customTitle?: string;
}

/**
 * Lista completa (respuesta del backend)
 */
export interface List {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  isPublic: boolean;
  cover: ListCover;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lista con información del dueño (para búsquedas)
 */
export interface ListWithOwner extends List {
  ownerDisplayName: string;
}

/**
 * Item de una lista
 */
export interface ListItem {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string;
  notes: string;
  addedAt: string;
}

/**
 * DTO para crear una lista
 */
export interface CreateListDto {
  title: string;
  description?: string;
  isPublic?: boolean;
  cover?: ListCover;
}

/**
 * DTO para actualizar una lista
 */
export interface UpdateListDto {
  title?: string;
  description?: string;
  isPublic?: boolean;
  cover?: ListCover;
}

/**
 * DTO para agregar un item a una lista
 */
export interface AddListItemDto {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string;
  notes?: string;
}

/**
 * DTO para actualizar un item de una lista
 */
export interface UpdateListItemDto {
  notes?: string;
}
