import { useState, useEffect, useCallback } from 'react';
import { listsService } from '../../services/listsService';
import type { List, ListItem, UpdateListDto, AddListItemDto } from '../../types/list.types';

export interface UseListDetailsReturn {
  list: List | null;
  items: ListItem[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  updateList: (updateData: UpdateListDto) => Promise<boolean>;
  addItem: (itemData: AddListItemDto) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
}

export const useListDetails = (listId: string): UseListDetailsReturn => {
  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadListDetails = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      // Cargar detalles de la lista y sus items en paralelo
      const [listDetails, listItems] = await Promise.all([
        listsService.getListById(listId),
        listsService.getListItems(listId)
      ]);

      setList(listDetails);
      setItems(listItems);
    } catch (err) {
      console.error('Error loading list details:', err);
      setError('No se pudieron cargar los detalles de la lista.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [listId]);

  const refresh = useCallback(async () => {
    await loadListDetails(true);
  }, [loadListDetails]);

  const updateList = useCallback(async (updateData: UpdateListDto): Promise<boolean> => {
    try {
      const updatedList = await listsService.updateList(listId, updateData);
      setList(updatedList);
      return true;
    } catch (err) {
      console.error('Error updating list:', err);
      setError('No se pudo actualizar la lista.');
      return false;
    }
  }, [listId]);

  const addItem = useCallback(async (itemData: AddListItemDto): Promise<boolean> => {
    try {
      const newItem = await listsService.addListItem(listId, itemData);
      setItems(prev => [newItem, ...prev]);
      
      // Actualizar el contador de items en la lista
      if (list) {
        setList(prev => prev ? { ...prev, itemsCount: prev.itemsCount + 1 } : null);
      }
      
      return true;
    } catch (err) {
      console.error('Error adding item to list:', err);
      setError('No se pudo agregar el item a la lista.');
      return false;
    }
  }, [listId, list]);

  const removeItem = useCallback(async (itemId: string): Promise<boolean> => {
    try {
      await listsService.removeListItem(listId, itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      // Actualizar el contador de items en la lista
      if (list) {
        setList(prev => prev ? { ...prev, itemsCount: prev.itemsCount - 1 } : null);
      }
      
      return true;
    } catch (err) {
      console.error('Error removing item from list:', err);
      setError('No se pudo eliminar el item de la lista.');
      return false;
    }
  }, [listId, list]);

  useEffect(() => {
    if (listId) {
      loadListDetails();
    }
  }, [listId, loadListDetails]);

  return {
    list,
    items,
    loading,
    error,
    refreshing,
    refresh,
    updateList,
    addItem,
    removeItem,
  };
};