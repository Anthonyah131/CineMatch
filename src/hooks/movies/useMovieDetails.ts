import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../../services/tmdbService';
import { usersService } from '../../services/usersService';
import { useLoading } from '../../context/LoadingContext';
import type {
  TmdbMovieDetails,
  TmdbCreditsResponse,
  TmdbWatchProvidersResponse,
} from '../../types/tmdb.types';
import { mediaLogsService } from '../../services/mediaLogsService';

interface UseMovieDetailsReturn {
  movieDetails: TmdbMovieDetails | null;
  credits: TmdbCreditsResponse | null;
  watchProviders: TmdbWatchProvidersResponse | null;
  isFavorite: boolean;
  userRating: number | null;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  toggleFavorite: () => Promise<void>;
}

export const useMovieDetails = (movieId: number): UseMovieDetailsReturn => {
  const { showLoading, hideLoading } = useLoading();

  // Estados principales
  const [movieDetails, setMovieDetails] = useState<TmdbMovieDetails | null>(
    null,
  );
  const [credits, setCredits] = useState<TmdbCreditsResponse | null>(null);
  const [watchProviders, setWatchProviders] =
    useState<TmdbWatchProvidersResponse | null>(null);

  // Estados del usuario
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  // Estados de UI
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Cargar detalles de la película
   */
  const loadMovieDetails = useCallback(async () => {
    try {
      const details = await tmdbService.movies.getDetails(movieId);
      setMovieDetails(details);
    } catch (err) {
      console.error('Error loading movie details:', err);
      setError('Error al cargar detalles de la película');
    }
  }, [movieId]);

  /**
   * Cargar créditos (cast & crew)
   */
  const loadCredits = useCallback(async () => {
    try {
      const creditsData = await tmdbService.movies.getCredits(movieId);
      setCredits(creditsData);
    } catch (err) {
      console.error('Error loading credits:', err);
      // No mostrar error crítico, los créditos son opcionales
    }
  }, [movieId]);

  /**
   * Cargar proveedores de streaming
   */
  const loadWatchProviders = useCallback(async () => {
    try {
      const providers = await tmdbService.movies.getWatchProviders(movieId);
      setWatchProviders(providers);
    } catch (err) {
      console.error('Error loading watch providers:', err);
      // No mostrar error crítico, los proveedores son opcionales
    }
  }, [movieId]);

  /**
   * Verificar si está en favoritos
   */
  const checkFavorite = useCallback(async () => {
    try {
      const favorite = await usersService.isFavorite(movieId, 'movie');
      setIsFavorite(favorite);
    } catch (err) {
      console.error('Error checking favorite:', err);
      // Silencioso si el usuario no está autenticado
    }
  }, [movieId]);

  /**
   * Obtener rating del usuario
   */
  const loadUserRating = useCallback(async () => {
    try {
      const rating = await mediaLogsService.getLastRating(movieId, 'movie');
      setUserRating(rating);
    } catch (err) {
      console.error('Error loading user rating:', err);
      // Silencioso si no hay rating
    }
  }, [movieId]);

  /**
   * Alternar favorito
   */
  const toggleFavorite = useCallback(async () => {
    try {
      if (isFavorite) {
        await usersService.removeFromFavorites(movieId, 'movie');
        setIsFavorite(false);
      } else {
        await usersService.addToFavorites({
          tmdbId: movieId,
          mediaType: 'movie',
          title: movieDetails?.title || '',
          posterPath: movieDetails?.poster_path ?? '',
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Error al actualizar favoritos');
    }
  }, [isFavorite, movieId, movieDetails]);

  /**
   * Refrescar todos los datos
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      await Promise.all([
        loadMovieDetails(),
        loadCredits(),
        loadWatchProviders(),
        checkFavorite(),
        loadUserRating(),
      ]);
    } catch (err) {
      console.error('Error refreshing movie data:', err);
      setError('Error al actualizar datos');
    } finally {
      setRefreshing(false);
    }
  }, [
    loadMovieDetails,
    loadCredits,
    loadWatchProviders,
    checkFavorite,
    loadUserRating,
  ]);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    const loadInitialData = async () => {
      showLoading('Cargando película...');
      setError(null);

      try {
        // Cargar datos principales en paralelo
        await Promise.all([
          loadMovieDetails(),
          loadCredits(),
          loadWatchProviders(),
        ]);

        // Cargar datos del usuario (pueden fallar si no está autenticado)
        try {
          await Promise.all([checkFavorite(), loadUserRating()]);
        } catch (userErr) {
          // Silencioso si no está autenticado
        }

        // 🎬 LOG CONSOLIDADO - Toda la info de la película en un solo lugar
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎬 MOVIE DETAILS SCREEN DATA', {
          movieId,
          movieDetails: {
            title: movieDetails?.title,
            originalTitle: movieDetails?.original_title,
            releaseDate: movieDetails?.release_date,
            runtime: movieDetails?.runtime,
            voteAverage: movieDetails?.vote_average,
            genres: movieDetails?.genres,
            overview: movieDetails?.overview,
            posterPath: movieDetails?.poster_path,
            backdropPath: movieDetails?.backdrop_path,
          },
          credits: {
            castCount: credits?.cast?.length || 0,
            topCast: credits?.cast?.slice(0, 5).map(actor => ({
              name: actor.name,
              character: actor.character,
            })),
            director: credits?.crew?.find(member => member.job === 'Director')
              ?.name,
          },
          watchProviders: {
            availableRegions: watchProviders?.results
              ? Object.keys(watchProviders.results).length
              : 0,
            regions: watchProviders?.results
              ? Object.keys(watchProviders.results)
              : [],
          },
          userData: {
            isFavorite,
            userRating,
          },
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Error al cargar película');
      } finally {
        hideLoading();
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]); // Solo recargar si cambia el movieId

  return {
    movieDetails,
    credits,
    watchProviders,
    isFavorite,
    userRating,
    error,
    refreshing,
    refresh,
    toggleFavorite,
  };
};
