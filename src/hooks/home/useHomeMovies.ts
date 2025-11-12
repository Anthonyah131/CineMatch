import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../../services/tmdbService';
import { usersService } from '../../services/usersService';
import { matchesService } from '../../services/matchesService';
import { useLoading } from '../../context/LoadingContext';
import type { TmdbMovie } from '../../types/tmdb.types';
import type { FriendActivity } from '../../types/user.types';
import type { MatchesResponse } from '../../types/match.types';

interface UseHomeMoviesReturn {
  trendingMovies: TmdbMovie[];
  topRatedMovies: TmdbMovie[];
  friendsActivity: FriendActivity[];
  matches: MatchesResponse | null;
  loadingActivity: boolean;
  loadingMatches: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

export const useHomeMovies = (): UseHomeMoviesReturn => {
  const { showLoading, hideLoading } = useLoading();

  // Estado para cada sección (solo las que se muestran)
  const [trendingMovies, setTrendingMovies] = useState<TmdbMovie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<TmdbMovie[]>([]);
  const [friendsActivity, setFriendsActivity] = useState<FriendActivity[]>([]);
  const [matches, setMatches] = useState<MatchesResponse | null>(null);

  // Estados de carga y error
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

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
   * Cargar actividad de amigos
   */
  const loadFriendsActivity = useCallback(async () => {
    setLoadingActivity(true);
    try {
      const activity = await usersService.getFollowingActivity(10);
      setFriendsActivity(activity as FriendActivity[]);
    } catch (err) {
      console.error('Error loading friends activity:', err);
      setError('Error al cargar actividad de amigos');
    } finally {
      setLoadingActivity(false);
    }
  }, []);

  /**
   * Cargar matches
   */
  const loadMatches = useCallback(async () => {
    setLoadingMatches(true);
    try {
      const matchesData = await matchesService.getPotentialMatches(30, undefined, 20);
      setMatches(matchesData);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Error al cargar matches');
    } finally {
      setLoadingMatches(false);
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
        loadTrendingMovies(),
        loadTopRatedMovies(),
        loadFriendsActivity(),
        loadMatches(),
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Error al actualizar datos');
    } finally {
      setRefreshing(false);
    }
  }, [
    loadTrendingMovies,
    loadTopRatedMovies,
    loadFriendsActivity,
    loadMatches,
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
          loadTrendingMovies(),
          loadTopRatedMovies(),
          loadFriendsActivity(),
          loadMatches(),
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
    trendingMovies,
    topRatedMovies,
    friendsActivity,
    matches,
    loadingActivity,
    loadingMatches,
    error,
    refreshing,
    refresh,
  };
};
