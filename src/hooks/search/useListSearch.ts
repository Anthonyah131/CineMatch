import { useState, useEffect, useCallback } from 'react';
import { listsService } from '../../services/listsService';
import type { ListWithOwner } from '../../types/list.types';

export interface UseListSearchReturn {
  query: string;
  lists: ListWithOwner[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchLists: (searchQuery: string) => Promise<void>;
  clearSearch: () => void;
  setQuery: (query: string) => void;
}

export const useListSearch = (): UseListSearchReturn => {
  const [query, setQuery] = useState('');
  const [lists, setLists] = useState<ListWithOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchLists = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setLists([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Usar el nuevo método del servicio para buscar en el servidor
      const filteredLists = await listsService.searchPublicLists(searchQuery.trim());
      
      setLists(filteredLists);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching lists:', err);
      setError('No se pudieron buscar las listas. Intenta nuevamente.');
      setLists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setLists([]);
    setHasSearched(false);
    setError(null);
  }, []);

  // Auto search with debounce effect - solo cuando query cambia internamente
  useEffect(() => {
    if (!query) {
      setLists([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchLists(query);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [query, searchLists]);
    
  return {
    query,
    lists,
    loading,
    error,
    hasSearched,
    searchLists,
    clearSearch,
    setQuery,
  };
};