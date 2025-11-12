import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/stacks/HomeStack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useLogDetails } from '../../hooks/diary/useLogDetails';
import { useLoading } from '../../context/LoadingContext';
import { useModal } from '../../context/ModalContext';
import { formatWatchDate } from '../../utils/dateFormatter';
import { ActionModal } from '../../components/ui/ActionModal';

type LogDetailRouteProp = RouteProp<HomeStackParamList, 'LogDetail'>;
type LogDetailNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'LogDetail'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function LogDetailScreen() {
  const route = useRoute<LogDetailRouteProp>();
  const navigation = useNavigation<LogDetailNavigationProp>();
  const { logId } = route.params;
  const { log, mediaData, isLoading, error, refreshLog, deleteLog } = useLogDetails(logId);
  const { showLoading, hideLoading } = useLoading();
  const { showConfirm, showSuccess, showError } = useModal();
  const [showActionModal, setShowActionModal] = React.useState(false);

  const handleDelete = () => {
    showConfirm(
      'Delete Log',
      'Are you sure you want to delete this log entry? This action cannot be undone.',
      async () => {
        showLoading('Deleting log...');
        const success = await deleteLog();
        hideLoading();

        if (success) {
          showSuccess('Log deleted successfully');
          navigation.goBack();
        } else {
          showError('Failed to delete log');
        }
      }
    );
  };

  const handleEdit = () => {
    if (log && mediaData) {
      // Create movieDetails object for WriteReview screen
      const movieDetails = {
        id: log.tmdbId,
        title: mediaData.title || 'Unknown Title',
        overview: '',
        poster_path: mediaData.posterPath || null,
        backdrop_path: null,
        release_date: mediaData.releaseYear ? `${mediaData.releaseYear}-01-01` : '',
        vote_average: mediaData.voteAverage || 0,
        vote_count: 0,
        popularity: 0,
        adult: false,
        original_language: 'en',
        original_title: mediaData.title || 'Unknown Title',
        video: false,
        belongs_to_collection: null,
        budget: 0,
        genres: [],
        homepage: null,
        imdb_id: null,
        production_companies: [],
        production_countries: [],
        revenue: 0,
        runtime: null,
        spoken_languages: [],
        status: 'Released' as const,
        tagline: null,
      };

      navigation.navigate('WriteReview', { 
        movieDetails, 
        editLogId: logId 
      });
    }
  };

  const actionModalActions = [
    {
      title: 'Edit Log',
      icon: 'pencil-outline',
      color: COLORS.primary,
      onPress: handleEdit,
    },
    {
      title: 'Delete Log',
      icon: 'trash-outline',
      destructive: true,
      onPress: handleDelete,
    },
  ];

  const handlePosterPress = () => {
    if (log) {
      navigation.navigate('MovieDetails', { movieId: log.tmdbId });
    }
  };

  const renderStars = () => {
    if (!log?.rating) return null;

    const fullStars = Math.floor(log.rating);
    const hasHalfStar = log.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Icon key={`full-${i}`} name="star" size={18} color={COLORS.warning} />
        ))}
        {hasHalfStar && (
          <Icon name="star-half" size={18} color={COLORS.warning} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Icon
            key={`empty-${i}`}
            name="star-outline"
            size={18}
            color={COLORS.warning}
          />
        ))}
        <Text style={styles.ratingText}>{log.rating.toFixed(1)}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading log...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !log) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>
            {error || 'Failed to load log details'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshLog}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const posterUrl = mediaData?.posterPath
    ? `https://image.tmdb.org/t/p/w342${mediaData.posterPath}`
    : null;

  const watchDate = formatWatchDate(log.watchedAt);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Details</Text>
        <TouchableOpacity 
          onPress={() => setShowActionModal(true)} 
          style={styles.menuButton}
        >
          <Icon name="ellipsis-vertical" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.movieSection}>
          <TouchableOpacity onPress={handlePosterPress} activeOpacity={0.8}>
            {posterUrl ? (
              <Image source={{ uri: posterUrl }} style={styles.poster} />
            ) : (
              <View style={[styles.poster, styles.posterPlaceholder]}>
                <Icon name="film-outline" size={48} color={COLORS.textSecondary} />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.movieInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {mediaData?.title || 'Unknown Title'}
            </Text>

            <View style={styles.badge}>
              <Icon
                name={log.mediaType === 'movie' ? 'film' : 'tv'}
                size={12}
                color={COLORS.primary}
              />
              <Text style={styles.badgeText}>
                {log.mediaType === 'movie' ? 'Movie' : 'TV Show'}
              </Text>
            </View>

            {mediaData?.releaseYear && (
              <Text style={styles.releaseYear}>
                {mediaData.releaseYear}
              </Text>
            )}

            {mediaData?.voteAverage && (
              <View style={styles.tmdbRating}>
                <Icon name="star" size={14} color={COLORS.warning} />
                <Text style={styles.tmdbRatingText}>
                  {mediaData.voteAverage.toFixed(1)} TMDB
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Compact Info Section */}
        <View style={styles.section}>
          <View style={styles.compactInfoContainer}>
            {/* Rating */}
            {log.rating && (
              <View style={styles.compactInfoItem}>
                <Text style={styles.compactLabel}>My Rating</Text>
                {renderStars()}
              </View>
            )}

            {/* Watch Date */}
            <View style={styles.compactInfoItem}>
              <Text style={styles.compactLabel}>Watched On</Text>
              <View style={styles.infoRow}>
                <Icon name="calendar-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.compactInfoText}>{watchDate}</Text>
              </View>
            </View>

            {/* Rewatch Badge */}
            {log.hadSeenBefore && (
              <View style={styles.compactInfoItem}>
                <View style={styles.rewatchBadge}>
                  <Icon name="refresh" size={16} color={COLORS.info} />
                  <Text style={styles.rewatchText}>Rewatch</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {log.review && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Review</Text>
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>{log.review}</Text>
              {log.reviewLang && (
                <Text style={styles.reviewLang}>Language: {log.reviewLang}</Text>
              )}
            </View>
          </View>
        )}

        {log.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{log.notes}</Text>
          </View>
        )}
      </ScrollView>

      <ActionModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Log Actions"
        actions={actionModalActions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
  content: {
    padding: 20,
  },
  movieSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  posterPlaceholder: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  releaseYear: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  tmdbRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tmdbRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  compactInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
  },
  compactInfoItem: {
    minWidth: '45%',
    marginBottom: 12,
  },
  compactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  compactInfoText: {
    fontSize: 15,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.warning,
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.text,
  },
  rewatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.info}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  rewatchText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.info,
  },
  reviewContainer: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  reviewLang: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  notesText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
  },
});
