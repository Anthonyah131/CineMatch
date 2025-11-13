import { apiClient } from './api/apiClient';
import type {
  List,
  ListWithOwner,
  ListItem,
  CreateListDto,
  UpdateListDto,
  AddListItemDto,
  UpdateListItemDto,
} from '../types/list.types';

/**
 * Service para gestionar listas de películas y series
 */
class ListsService {
  private readonly baseUrl = '/lists';

  /**
   * Crear una nueva lista
   */
  async createList(listData: CreateListDto): Promise<List> {
    return apiClient.post<List>(this.baseUrl, listData);
  }

  /**
   * Obtener mis listas (públicas y privadas)
   */
  async getMyLists(): Promise<List[]> {
    return apiClient.get<List[]>(`${this.baseUrl}/my-lists`);
  }

  /**
   * Obtener listas públicas de un usuario
   */
  async getUserLists(userId: string): Promise<List[]> {
    return apiClient.get<List[]>(`${this.baseUrl}/user/${userId}`);
  }

  /**
   * Obtener lista por ID
   */
  async getListById(listId: string): Promise<List> {
    return apiClient.get<List>(`${this.baseUrl}/${listId}`);
  }

  /**
   * Actualizar lista
   */
  async updateList(listId: string, updateData: UpdateListDto): Promise<List> {
    return apiClient.put<List>(`${this.baseUrl}/${listId}`, updateData);
  }

  /**
   * Eliminar lista
   */
  async deleteList(listId: string): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/${listId}`);
  }

  /**
   * Obtener items de una lista
   */
  async getListItems(listId: string): Promise<ListItem[]> {
    return apiClient.get<ListItem[]>(`${this.baseUrl}/${listId}/items`);
  }

  /**
   * Agregar item a lista
   */
  async addListItem(
    listId: string,
    itemData: AddListItemDto,
  ): Promise<ListItem> {
    return apiClient.post<ListItem>(
      `${this.baseUrl}/${listId}/items`,
      itemData,
    );
  }

  /**
   * Actualizar item de lista
   */
  async updateListItem(
    listId: string,
    itemId: string,
    updateData: UpdateListItemDto,
  ): Promise<ListItem> {
    return apiClient.put<ListItem>(
      `${this.baseUrl}/${listId}/items/${itemId}`,
      updateData,
    );
  }

  /**
   * Eliminar item de lista
   */
  async removeListItem(listId: string, itemId: string): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/${listId}/items/${itemId}`);
  }

  /**
   * Verificar si el usuario es dueño de la lista
   */
  isOwner(list: List, userId: string): boolean {
    return list.ownerId === userId;
  }

  /**
   * Buscar listas públicas por nombre
   */
  async searchPublicLists(
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ListWithOwner[]> {
    const params = new URLSearchParams({ q: query, page: page.toString(), limit: limit.toString() });
    const response = await apiClient.get<{ items: ListWithOwner[]; total: number; page: number; limit: number }>(`${this.baseUrl}/search?${params.toString()}`);
    return response.items;
  }
}

export const listsService = new ListsService();
