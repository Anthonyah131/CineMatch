import { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useMovieDetails } from '../../hooks/movies/useMovieDetails';
import { mediaCacheService } from '../../services/mediaCacheService';
import Icon from 'react-native-vector-icons/Ionicons';
import type { MediaDetailsWithReviews } from '../../types/user.types';
import {
  MovieHeader,
  MovieInfo,
  MovieActions,
  MovieRatings,
  MovieTabs,
  CastCarousel,
  CrewList,
  MovieDetailsTab,
  type MovieTab,
} from '../../components/screens/movie-details';
import { AddToListModal } from '../../components/screens/lists';
import ReviewsList from '../../components/movies/ReviewsList';
import { buildPosterUrl } from '../../utils/tmdbImageHelpers';
import { COLORS } from '../../config/colors';
('use client');

interface MovieDetailsScreenProps {
  route: {
    params: {
      movieId: number;
    };
  };
  navigation: any;
}

export default function MovieDetailsScreen({
  route,
  navigation,
}: MovieDetailsScreenProps) {
  const { movieId } = route.params;
  const [activeTab, setActiveTab] = useState<MovieTab>('cast');
  const [reviewsData, setReviewsData] = useState<MediaDetailsWithReviews | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [addToListModalVisible, setAddToListModalVisible] = useState(false);

  const {
    movieDetails,
    credits,
    isFavorite,
    userRating,
    error,
    refreshing,
    refresh,
    toggleFavorite,
  } = useMovieDetails(movieId);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddToWatchlist = () => {
    // TODO: Implementar watchlist
    console.log('Add to watchlist');
  };

  const handleShare = () => {
    // TODO: Implementar compartir
    console.log('Share movie');
  };

  const handleWriteReview = () => {
    navigation.navigate('WriteReview', { movieDetails });
  };

  const handleAddToList = () => {
    setAddToListModalVisible(true);
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const data = await mediaCacheService.getMediaDetailsWithReviews(movieId, 'movie');
      setReviewsData(data);
    } catch (err) {
      console.error('Error loading movie reviews:', err);
      // Reviews are optional, don't show error
    } finally {
      setLoadingReviews(false);
    }
  }, [movieId]);

  const refreshReviews = useCallback(async () => {
    await loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Director
  const director = credits?.crew.find(member => member.job === 'Director');

  // Loading state
  if (!movieDetails && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando película...</Text>
      </View>
    );
  }

  // Error state
  if (error && !movieDetails) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color={COLORS.accent} />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          No se pudo cargar la información de la película
        </Text>

        <View style={styles.errorActions}>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
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

  if (!movieDetails) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              refresh();
              refreshReviews();
            }}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Backdrop Image */}
        {movieDetails.backdrop_path && (
          <View style={styles.backdropContainer}>
            {/* Wrapper con borderRadius y overflow para evitar franjas negras en Android */}
            <View style={styles.backdropImageWrapper}>
              <Image
                source={{
                  uri: buildPosterUrl(movieDetails.backdrop_path, 'w780')!,
                }}
                style={styles.backdropImage}
                resizeMode="cover"
              />
              {/* Sombra difusa: varios niveles que se van desvaneciendo hacia arriba */}
              <LinearGradient
                colors={[
                  'rgba(0,0,0,0.9)',
                  'rgba(0,0,0,0.6)',
                  'rgba(0,0,0,0.35)',
                  'rgba(0,0,0,0)',
                ]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={styles.backdropGradient}
              />
            </View>
          </View>
        )}

        {/* Header con botón back */}
        <View style={styles.headerContainer}>
          <MovieHeader onBack={handleBack} />
        </View>

        {/* Layout principal: Poster a la izquierda + Info a la derecha */}
        <View style={styles.mainContent}>
          {/* Columna izquierda: Poster */}
          <View style={styles.leftColumn}>
            <View style={styles.posterContainer}>
              {movieDetails.poster_path &&
                buildPosterUrl(movieDetails.poster_path, 'w500') && (
                  <Image
                    source={{
                      uri: buildPosterUrl(movieDetails.poster_path, 'w500')!,
                    }}
                    style={styles.posterImage}
                    resizeMode="cover"
                  />
                )}
            </View>

            {/* Botones de acción debajo del poster */}
            <MovieActions
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onAddToWatchlist={handleAddToWatchlist}
              onAddToList={handleAddToList}
              onWriteReview={handleWriteReview}
              onShare={handleShare}
            />
          </View>

          {/* Columna derecha: Info + Ratings */}
          <View style={styles.rightColumn}>
            {/* Información principal */}
            <MovieInfo
              title={movieDetails.title}
              director={director?.name}
              releaseDate={movieDetails.release_date}
              runtime={movieDetails.runtime}
              tagline={movieDetails.tagline}
              overview={movieDetails.overview}
            />

            {/* Ratings */}
            <MovieRatings
              voteAverage={movieDetails.vote_average}
              voteCount={movieDetails.vote_count}
              userRating={userRating}
            />
          </View>
        </View>

        {/* Tabs */}
        <MovieTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Contenido según tab */}
        {activeTab === 'cast' && credits?.cast && (
          <CastCarousel cast={credits.cast.slice(0, 15)} />
        )}

        {activeTab === 'crew' && credits?.crew && (
          <CrewList crew={credits.crew} />
        )}

        {activeTab === 'details' && (
          <MovieDetailsTab movieDetails={movieDetails} />
        )}

        {/* Reviews Section */}
        {reviewsData && reviewsData.reviews && reviewsData.reviews.length > 0 && (
          <ReviewsList
            reviews={reviewsData.reviews}
            loading={loadingReviews}
            posterPath={movieDetails.poster_path ?? undefined}
            onUserPress={handleUserPress}
          />
        )}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <AddToListModal
        visible={addToListModalVisible}
        movie={movieDetails}
        onClose={() => setAddToListModalVisible(false)}
        onSuccess={() => {
          // Opcional: mostrar mensaje de éxito
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  backdropContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  backdropImageWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: COLORS.background, // color que se ve detrás de la imagen
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 200,
  },
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%', // ajusta si quieres más o menos degradado
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  mainContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
    marginTop: -80,
  },
  leftColumn: {
    width: 120,
  },
  rightColumn: {
    flex: 1,
  },
  posterContainer: {
    width: 120,
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    opacity: 0.7,
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
  bottomPadding: {
    height: 40,
  },
});
