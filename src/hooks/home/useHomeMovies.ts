import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../../services/tmdbService';
import { useLoading } from '../../context/LoadingContext';
import type { TmdbMovie } from '../../types/tmdb.types';

interface UseHomeMoviesReturn {
  popularMovies: TmdbMovie[];
  trendingMovies: TmdbMovie[];
  upcomingMovies: TmdbMovie[];
  topRatedMovies: TmdbMovie[];
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

export const useHomeMovies = (): UseHomeMoviesReturn => {
  const { showLoading, hideLoading } = useLoading();

  // Estado para cada sección
  const [popularMovies, setPopularMovies] = useState<TmdbMovie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TmdbMovie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<TmdbMovie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<TmdbMovie[]>([]);

  // Estados de carga y error
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Cargar películas populares
   */
  const loadPopularMovies = useCallback(async () => {
    try {
      const response = await tmdbService.movies.getPopular(1);
      setPopularMovies(response.results);
    } catch (err) {
      console.error('Error loading popular movies:', err);
      setError('Error al cargar películas populares');
    }
  }, []);

  /**
   * Cargar películas en tendencia
   */
  const loadTrendingMovies = useCallback(async () => {
    try {
      const response = await tmdbService.movies.getTrending('week');
      setTrendingMovies(response.results);
    } catch (err) {
      console.error('Error loading trending movies:', err);
      setError('Error al cargar películas en tendencia');
    }
  }, []);

  /**
   * Cargar próximos estrenos
   */
  const loadUpcomingMovies = useCallback(async () => {
    try {
      const response = await tmdbService.movies.getUpcoming(1);
      setUpcomingMovies(response.results);
    } catch (err) {
      console.error('Error loading upcoming movies:', err);
      setError('Error al cargar próximos estrenos');
    }
  }, []);

  /**
   * Cargar películas mejor valoradas
   */
  const loadTopRatedMovies = useCallback(async () => {
    try {
      const response = await tmdbService.movies.getTopRated(1);
      setTopRatedMovies(response.results);
    } catch (err) {
      console.error('Error loading top rated movies:', err);
      setError('Error al cargar películas mejor valoradas');
    }
  }, []);

  /**
   * Refrescar todas las secciones
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      // Cargar todas las secciones en paralelo
      await Promise.all([
        loadPopularMovies(),
        loadTrendingMovies(),
        loadUpcomingMovies(),
        loadTopRatedMovies(),
      ]);
    } catch (err) {
      console.error('Error refreshing movies:', err);
      setError('Error al actualizar películas');
    } finally {
      setRefreshing(false);
    }
  }, [
    loadPopularMovies,
    loadTrendingMovies,
    loadUpcomingMovies,
    loadTopRatedMovies,
  ]);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    const loadInitialData = async () => {
      showLoading('Cargando películas...');
      setError(null);

      try {
        await Promise.all([
          loadPopularMovies(),
          loadTrendingMovies(),
          loadUpcomingMovies(),
          loadTopRatedMovies(),
        ]);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Error al cargar películas');
      } finally {
        hideLoading();
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo cargar una vez al montar

  return {
    popularMovies,
    trendingMovies,
    upcomingMovies,
    topRatedMovies,
    error,
    refreshing,
    refresh,
  };
};
