import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../../services/usersService';
import type { User } from '../../types/user.types';

export interface UseUserSearchReturn {
  query: string;
  users: User[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchUsers: (searchQuery: string) => Promise<void>;
  clearSearch: () => void;
  setQuery: (query: string) => void;
}

export const useUserSearch = (): UseUserSearchReturn => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchUsers = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setUsers([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await usersService.searchUsers(searchQuery.trim(), 20);
      setUsers(results);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('No se pudieron buscar los perfiles. Intenta nuevamente.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setUsers([]);
    setError(null);
    setHasSearched(false);
  }, []);

  // Auto search with debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchUsers(query);
      } else if (query.trim().length === 0) {
        clearSearch();
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [query, searchUsers, clearSearch]);

  return {
    query,
    users,
    loading,
    error,
    hasSearched,
    searchUsers,
    clearSearch,
    setQuery,
  };
};