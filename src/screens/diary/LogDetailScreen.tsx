import React, { useState, useEffect } from 'react';
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
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useLogDetails } from '../../hooks/diary/useLogDetails';
import { mediaLogsService } from '../../services/mediaLogsService';
import { tmdbService } from '../../services/tmdbService';
import { useLoading } from '../../context/LoadingContext';
import { useModal } from '../../context/ModalContext';

type LogDetailRouteProp = RouteProp<RootStackParamList, 'LogDetail'>;

export default function LogDetailScreen() {
  const route = useRoute<LogDetailRouteProp>();
  const navigation = useNavigation();
  const { logId } = route.params;
  const { log, isLoading, error, refreshLog, deleteLog } = useLogDetails(logId);
  const { showLoading, hideLoading } = useLoading();
  const { showConfirm, showSuccess, showError } = useModal();
  
  const [mediaData, setMediaData] = useState<{
    title: string;
    posterPath?: string;
    overview?: string;
    releaseDate?: string;
  } | null>(null);

  // Fetch movie/show data
  useEffect(() => {
    const fetchMediaData = async () => {
      if (!log) return;

      try {
        if (log.mediaType === 'movie') {
          const data = await tmdbService.movies.getDetails(log.tmdbId);
          setMediaData({
            title: data.title || 'Unknown Title',
            posterPath: data.poster_path ?? undefined,
            overview: data.overview ?? undefined,
            releaseDate: data.release_date ?? undefined,
          });
        } else {
          const data = await tmdbService.tv.getDetails(log.tmdbId);
          setMediaData({
            title: data.name || 'Unknown Title',
            posterPath: data.poster_path ?? undefined,
            overview: data.overview ?? undefined,
            releaseDate: data.first_air_date ?? undefined,
          });
        }
      } catch (err) {
        console.error('Error fetching media data:', err);
      }
    };

    fetchMediaData();
  }, [log]);

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

  const renderStars = () => {
    if (!log?.rating) return null;

    const fullStars = Math.floor(log.rating);
    const hasHalfStar = log.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Icon key={`full-${i}`} name="star" size={24} color={COLORS.warning} />
        ))}
        {hasHalfStar && (
          <Icon name="star-half" size={24} color={COLORS.warning} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Icon
            key={`empty-${i}`}
            name="star-outline"
            size={24}
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
    ? `https://image.tmdb.org/t/p/w500${mediaData.posterPath}`
    : null;

  const watchDate = mediaLogsService.formatWatchDate(log.watchedAt);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Details</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Icon name="trash-outline" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Poster */}
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Icon name="film-outline" size={80} color={COLORS.textSecondary} />
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>{mediaData?.title || 'Unknown Title'}</Text>

        {/* Media Type Badge */}
        <View style={styles.badge}>
          <Icon
            name={log.mediaType === 'movie' ? 'film' : 'tv'}
            size={14}
            color={COLORS.primary}
          />
          <Text style={styles.badgeText}>
            {log.mediaType === 'movie' ? 'Movie' : 'TV Show'}
          </Text>
        </View>

        {/* Rating */}
        {log.rating && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            {renderStars()}
          </View>
        )}

        {/* Watch Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Watched On</Text>
          <View style={styles.infoRow}>
            <Icon name="calendar-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{watchDate}</Text>
          </View>
        </View>

        {/* Rewatch Badge */}
        {log.hadSeenBefore && (
          <View style={styles.section}>
            <View style={styles.rewatchBadge}>
              <Icon name="refresh" size={20} color={COLORS.info} />
              <Text style={styles.rewatchText}>Rewatch</Text>
            </View>
          </View>
        )}

        {/* Review */}
        {log.review && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review</Text>
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>{log.review}</Text>
              {log.reviewLang && (
                <Text style={styles.reviewLang}>Language: {log.reviewLang}</Text>
              )}
            </View>
          </View>
        )}

        {/* Notes */}
        {log.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{log.notes}</Text>
          </View>
        )}

        {/* Overview */}
        {mediaData?.overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overviewText}>{mediaData.overview}</Text>
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
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
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    marginBottom: 20,
  },
  posterPlaceholder: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.warning,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
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
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.info,
  },
  reviewContainer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  reviewLang: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  notesText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
  },
  overviewText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
