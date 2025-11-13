import { useState, useEffect, useCallback } from 'react';
import { forumsService } from '../../services/forumsService';
import type { ForumSummary } from '../../types/forum.types';

export interface UseForumSearchReturn {
  query: string;
  forums: ForumSummary[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchForums: (searchQuery: string) => Promise<void>;
  clearSearch: () => void;
  setQuery: (query: string) => void;
}

export const useForumSearch = (): UseForumSearchReturn => {
  const [query, setQuery] = useState('');
  const [forums, setForums] = useState<ForumSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchForums = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setForums([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Obtener todos los foros y filtrar localmente
      const allForums = await forumsService.getAllForums(100);
      const filteredForums = allForums.filter(forum => 
        forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forum.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setForums(filteredForums);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching forums:', err);
      setError('No se pudieron buscar los foros. Intenta nuevamente.');
      setForums([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setForums([]);
    setHasSearched(false);
    setError(null);
  }, []);

  // Auto search with debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchForums(query);
      } else if (query.trim().length === 0) {
        clearSearch();
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [query, searchForums, clearSearch]);
    
  return {
    query,
    forums,
    loading,
    error,
    hasSearched,
    searchForums,
    clearSearch,
    setQuery,
  };
};