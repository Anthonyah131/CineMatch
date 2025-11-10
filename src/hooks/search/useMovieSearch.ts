import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../../services/tmdbService';
import type { TmdbMovie } from '../../types/tmdb.types';

export interface UseMovieSearchReturn {
  query: string;
  movies: TmdbMovie[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  currentPage: number;
  totalPages: number;
  hasMorePages: boolean;
  searchMovies: (searchQuery: string) => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  clearSearch: () => void;
  setQuery: (query: string) => void;
}

export const useMovieSearch = (): UseMovieSearchReturn => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const hasMorePages = currentPage < totalPages;

  const searchMovies = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const response = await tmdbService.movies.search(searchQuery.trim(), 1);
      setMovies(response.results);
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('No se pudieron buscar las películas. Intenta nuevamente.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreMovies = useCallback(async () => {
    if (!query.trim() || loading || !hasMorePages) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await tmdbService.movies.search(query.trim(), nextPage);
      
      setMovies(prev => [...prev, ...response.results]);
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error('Error loading more movies:', err);
      setError('No se pudieron cargar más películas.');
    } finally {
      setLoading(false);
    }
  }, [query, loading, hasMorePages, currentPage]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setMovies([]);
    setError(null);
    setHasSearched(false);
    setCurrentPage(1);
    setTotalPages(0);
  }, []);

  // Auto search with debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchMovies(query);
      } else if (query.trim().length === 0) {
        clearSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, searchMovies, clearSearch]);

  return {
    query,
    movies,
    loading,
    error,
    hasSearched,
    currentPage,
    totalPages,
    hasMorePages,
    searchMovies,
    loadMoreMovies,
    clearSearch,
    setQuery,
  };
};