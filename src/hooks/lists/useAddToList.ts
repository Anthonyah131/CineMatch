import { useState, useCallback } from 'react';
import { listsService } from '../../services/listsService';
import type { List, AddListItemDto } from '../../types/list.types';
import type { TmdbMovieDetails } from '../../types/tmdb.types';

export interface UseAddToListReturn {
  userLists: List[];
  loading: boolean;
  error: string | null;
  addToList: (listId: string, movie: TmdbMovieDetails) => Promise<boolean>;
  loadUserLists: () => Promise<void>;
}

export const useAddToList = (): UseAddToListReturn => {
  const [userLists, setUserLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserLists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const lists = await listsService.getMyLists();
      setUserLists(lists);
    } catch (err) {
      console.error('Error loading user lists:', err);
      setError('No se pudieron cargar las listas.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToList = useCallback(async (
    listId: string, 
    movie: TmdbMovieDetails
  ): Promise<boolean> => {
    try {
      const itemData: AddListItemDto = {
        tmdbId: movie.id,
        mediaType: 'movie',
        title: movie.title,
        posterPath: movie.poster_path || '',
        notes: '',
      };

      await listsService.addListItem(listId, itemData);

      // Actualizar el contador de la lista localmente
      setUserLists(prev => 
        prev.map(list => 
          list.id === listId 
            ? { ...list, itemsCount: list.itemsCount + 1 }
            : list
        )
      );

      return true;
    } catch (err) {
      console.error('Error adding movie to list:', err);
      setError('No se pudo agregar la película a la lista.');
      return false;
    }
  }, []);

  return {
    userLists,
    loading,
    error,
    addToList,
    loadUserLists,
  };
};