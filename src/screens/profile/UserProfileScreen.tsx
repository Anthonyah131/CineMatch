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
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/profile/useUserProfile';
import { mediaCacheService } from '../../services/mediaCacheService';
import UserProfileHeader from '../../components/profile/UserProfileHeader';
import MovieCarousel from '../../components/ui/carousel/MovieCarousel';
import ReviewCard from '../../components/profile/ReviewCard';
import type { TmdbMovie } from '../../types/tmdb.types';

interface UserProfileScreenProps {
  navigation: any;
  route: {
    params: {
      userId: string;
    };
  };
}

interface MovieCache {
  [tmdbId: number]: {
    title: string;
    posterPath: string | null;
  };
}

export default function UserProfileScreen({ navigation, route }: UserProfileScreenProps) {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const {
    user,
    favorites,
    recentLogs,
    recentReviews,
    stats,
    isFollowing,
    isLoading,
    error,
    refresh,
    toggleFollow,
    isTogglingFollow,
  } = useUserProfile(userId);

  const [refreshing, setRefreshing] = useState(false);
  const [movieCache, setMovieCache] = useState<MovieCache>({});

  // Verificar si estamos viendo nuestro propio perfil
  const isOwnProfile = currentUser?.id === userId;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleMoviePress = (movie: TmdbMovie) => {
    // Extract original tmdbId from the potentially modified ID
    const originalTmdbId = movie.id >= 1000000 ? movie.id % 1000000 : movie.id;
    navigation.navigate('MovieDetails', { movieId: originalTmdbId });
  };

  const handleFollowersPress = () => {
    if (userId) {
      navigation.navigate('FollowList', { type: 'followers', userId });
    }
  };

  const handleFollowingPress = () => {
    if (userId) {
      navigation.navigate('FollowList', { type: 'following', userId });
    }
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

  const recentlyWatchedMovies: TmdbMovie[] = recentlyWatchedLogs.map((log, index) => {
    const cached = movieCache[log.tmdbId];
    return {
      id: log.tmdbId + index * 1000000, // Create unique IDs to avoid collision
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

  const recentMoviesUserData: {
    [movieId: number]: { rating?: number; hadSeenBefore?: boolean };
  } = {};
  recentlyWatchedLogs.forEach((log, index) => {
    const uniqueId = log.tmdbId + index * 1000000; // Same unique ID system
    recentMoviesUserData[uniqueId] = {
      rating: log.rating,
      hadSeenBefore: log.hadSeenBefore,
    };
  });

  useEffect(() => {
    const loadMovieDetails = async () => {
      // Collect TMDb IDs from both recent logs and recent reviews
      const logsIds = recentLogs.map(log => log.tmdbId).slice(0, 10);
      const reviewsIds = recentReviews.map(review => review.tmdbId);
      const allTmdbIds = [...logsIds, ...reviewsIds];
      const uniqueIds = [...new Set(allTmdbIds)];

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

    if (recentLogs.length > 0 || recentReviews.length > 0) {
      loadMovieDetails();
    }
  }, [recentLogs, recentReviews]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.backButton} />
        </View>

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

            <TouchableOpacity style={styles.backButtonError} onPress={handleBack}>
              <Icon name="arrow-back" size={20} color={COLORS.text} />
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <UserProfileHeader
          displayName={user.displayName}
          photoURL={user.photoURL}
          bio={user.bio}
          followersCount={user.followersCount}
          followingCount={user.followingCount}
          stats={stats}
          favorites={favorites}
          isFollowing={isFollowing}
          isTogglingFollow={isTogglingFollow}
          onToggleFollow={toggleFollow}
          onFollowersPress={handleFollowersPress}
          onFollowingPress={handleFollowingPress}
          isOwnProfile={isOwnProfile}
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

        {recentReviews.length > 0 && (
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>{user.displayName}'s Recent Reviews</Text>
            {recentReviews.map(review => {
              const cached = movieCache[review.tmdbId];
              return (
                <ReviewCard
                  key={`${review.id}-${review.tmdbId}-${review.watchedAt._seconds}`}
                  log={review}
                  movieTitle={cached?.title || `Movie ${review.tmdbId}`}
                  posterPath={cached?.posterPath}
                  onPress={() => handleMoviePress({ 
                    id: review.tmdbId, 
                    title: cached?.title || `Movie ${review.tmdbId}`,
                    poster_path: cached?.posterPath,
                    backdrop_path: null,
                    overview: '',
                    release_date: '',
                    vote_average: review.rating || 0,
                    vote_count: 0,
                    genre_ids: [],
                    adult: false,
                    original_language: '',
                    original_title: cached?.title || `Movie ${review.tmdbId}`,
                    popularity: 0,
                    video: false,
                  })}
                />
              );
            })}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 233, 228, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
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
  backButtonError: {
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
  bottomPadding: {
    height: 40,
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
});
