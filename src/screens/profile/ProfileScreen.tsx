import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useProfile } from '../../hooks/profile/useProfile';
import { mediaCacheService } from '../../services/mediaCacheService';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ReviewCard from '../../components/profile/ReviewCard';
import MovieCarousel from '../../components/ui/carousel/MovieCarousel';
import type { TmdbMovie } from '../../types/tmdb.types';

interface MovieCache {
  [tmdbId: number]: {
    title: string;
    posterPath: string | null;
  };
}

export default function ProfileScreen({ navigation }: any) {
  const { user, favorites, recentLogs, stats, isLoading, error, refresh } =
    useProfile();
  const [refreshing, setRefreshing] = useState(false);
  const [movieCache, setMovieCache] = useState<MovieCache>({});

  const handleBack = () => {
    navigation.goBack();
  };

  const favoritesAsMovies: TmdbMovie[] = favorites.map(fav => ({
    id: fav.tmdbId,
    title: fav.title,
    poster_path: fav.posterPath,
    backdrop_path: null,
    overview: '',
    release_date: '',
    vote_average: 0,
    vote_count: 0,
    genre_ids: [],
    adult: false,
    original_language: '',
    original_title: fav.title,
    popularity: 0,
    video: false,
  }));

  const recentlyWatchedLogs = recentLogs.slice(0, 10);

  const recentlyWatchedMovies: TmdbMovie[] = recentlyWatchedLogs.map(log => {
    const cached = movieCache[log.tmdbId];
    return {
      id: log.tmdbId,
      title: cached?.title || `Movie ${log.tmdbId}`,
      poster_path: cached?.posterPath || null,
      backdrop_path: null,
      overview: '',
      release_date: '',
      vote_average: log.rating || 0,
      vote_count: 0,
      genre_ids: [],
      adult: false,
      original_language: '',
      original_title: cached?.title || `Movie ${log.tmdbId}`,
      popularity: 0,
      video: false,
    };
  });

  // Construir datos de usuario para las películas recientes
  const recentMoviesUserData: {
    [movieId: number]: { rating?: number; hadSeenBefore?: boolean };
  } = {};
  recentlyWatchedLogs.forEach(log => {
    recentMoviesUserData[log.tmdbId] = {
      rating: log.rating,
      hadSeenBefore: log.hadSeenBefore,
    };
  });

  const logsWithReviews = recentLogs.filter(
    log => log.review && log.review.trim().length > 0,
  );

  // NO deduplicar - cada log/review es único y válido
  // Si el usuario vio la misma peli varias veces, mostramos todas las reviews

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleMoviePress = (movie: TmdbMovie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  useEffect(() => {
    const loadMovieDetails = async () => {
      const tmdbIds = recentLogs.map(log => log.tmdbId).slice(0, 10);
      const uniqueIds = [...new Set(tmdbIds)];

      const cache: MovieCache = {};

      await Promise.all(
        uniqueIds.map(async id => {
          try {
            const response = await mediaCacheService.getMovie(id);
            const movieData = response.data;
            cache[id] = {
              title: movieData.title,
              posterPath: movieData.posterPath,
            };
          } catch (err) {
            console.error(`Error loading movie ${id}:`, err);
            cache[id] = {
              title: `Movie ${id}`,
              posterPath: null,
            };
          }
        }),
      );

      setMovieCache(cache);
    };

    if (recentLogs.length > 0) {
      loadMovieDetails();
    }
  }, [recentLogs]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color={COLORS.accent} />
        <Text style={styles.errorText}>{error || 'Error loading profile'}</Text>
        <Text style={styles.errorSubtext}>
          No se pudo cargar la información del perfil
        </Text>

        <View style={styles.errorActions}>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Icon name="refresh" size={20} color={COLORS.text} />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={20} color={COLORS.text} />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
    >
      <ProfileHeader
        displayName={user.displayName}
        photoURL={user.photoURL}
        bio={user.bio}
        followersCount={user.followersCount}
        followingCount={user.followingCount}
        stats={stats}
        favorites={favorites}
      />

      {favorites.length > 0 && (
        <MovieCarousel
          title={`${user.displayName}'s Favorite Films`}
          movies={favoritesAsMovies}
          onMoviePress={handleMoviePress}
        />
      )}

      {recentlyWatchedMovies.length > 0 && (
        <MovieCarousel
          title={`${user.displayName}'s Recent Watched`}
          movies={recentlyWatchedMovies}
          onMoviePress={handleMoviePress}
          showUserRatings={true}
          movieUserData={recentMoviesUserData}
        />
      )}

      {logsWithReviews.length > 0 && (
        <View style={styles.reviewsSection}>
          <Text
            style={styles.sectionTitle}
          >{`${user.displayName}'s Recent Reviewed`}</Text>
          {logsWithReviews.map(log => {
            const cached = movieCache[log.tmdbId];
            return (
              <ReviewCard
                key={log.id}
                log={log}
                movieTitle={cached?.title || `Movie ${log.tmdbId}`}
                posterPath={cached?.posterPath || null}
                onPress={() =>
                  handleMoviePress({ id: log.tmdbId } as TmdbMovie)
                }
              />
            );
          })}
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  errorSubtext: {
    color: COLORS.text,
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
