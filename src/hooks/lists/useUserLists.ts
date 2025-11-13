import { useState, useEffect, useCallback } from 'react';
import { listsService } from '../../services/listsService';
import type { List, CreateListDto } from '../../types/list.types';

export interface UseUserListsReturn {
  lists: List[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  createList: (listData: CreateListDto) => Promise<List | null>;
  deleteList: (listId: string) => Promise<boolean>;
}

export const useUserLists = (): UseUserListsReturn => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadLists = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      const userLists = await listsService.getMyLists();
      setLists(userLists);
    } catch (err) {
      console.error('Error loading user lists:', err);
      setError('No se pudieron cargar las listas. Intenta nuevamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadLists(true);
  }, [loadLists]);

  const createList = useCallback(async (listData: CreateListDto): Promise<List | null> => {
    try {
      const newList = await listsService.createList(listData);
      setLists(prev => [newList, ...prev]);
      return newList;
    } catch (err) {
      console.error('Error creating list:', err);
      setError('No se pudo crear la lista. Intenta nuevamente.');
      return null;
    }
  }, []);

  const deleteList = useCallback(async (listId: string): Promise<boolean> => {
    try {
      await listsService.deleteList(listId);
      setLists(prev => prev.filter(list => list.id !== listId));
      return true;
    } catch (err) {
      console.error('Error deleting list:', err);
      setError('No se pudo eliminar la lista. Intenta nuevamente.');
      return false;
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  return {
    lists,
    loading,
    error,
    refreshing,
    refresh,
    createList,
    deleteList,
  };
};