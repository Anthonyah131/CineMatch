import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import type { MediaLog } from '../../types/mediaLog.types';
import { formatWatchDate } from '../../utils/dateFormatter';

interface DiaryLogItemProps {
  log: MediaLog;
  onPress: (log: MediaLog) => void;
  movieTitle?: string;
  posterPath?: string;
}

export default function DiaryLogItem({
  log,
  onPress,
  movieTitle = 'Unknown Title',
  posterPath,
}: DiaryLogItemProps) {
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w200${posterPath}`
    : null;

  const watchDate = formatWatchDate(log.watchedAt);

  const renderStars = () => {
    if (!log.rating) return null;

    const fullStars = Math.floor(log.rating);
    const hasHalfStar = log.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Icon key={`full-${i}`} name="star" size={14} color={COLORS.warning} />
        ))}
        {hasHalfStar && (
          <Icon name="star-half" size={14} color={COLORS.warning} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Icon
            key={`empty-${i}`}
            name="star-outline"
            size={14}
            color={COLORS.warning}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(log)}
      activeOpacity={0.7}
    >
      {/* Poster */}
      <View style={styles.posterContainer}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Icon name="film-outline" size={32} color={COLORS.textSecondary} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {movieTitle}
        </Text>

        {/* Stars and Icons Row */}
        <View style={styles.bottomRow}>
          <View style={styles.leftContent}>
            {/* Stars */}
            {log.rating && (
              <View style={styles.ratingRow}>
                {renderStars()}
                <Text style={styles.ratingText}>{log.rating.toFixed(1)}</Text>
              </View>
            )}

            {/* Icons */}
            <View style={styles.iconsContainer}>
              {/* Rewatch Icon */}
              {log.hadSeenBefore && (
                <View style={styles.iconBadge}>
                  <Icon name="refresh" size={14} color={COLORS.info} />
                </View>
              )}

              {/* Review Icon */}
              {log.review && (
                <View style={styles.iconBadge}>
                  <Icon name="document-text" size={14} color={COLORS.primary} />
                </View>
              )}
            </View>
          </View>

          {/* Date - Now on the right, larger */}
          <Text style={styles.date}>{watchDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  posterContainer: {
    marginRight: 12,
  },
  poster: {
    width: 40,
    height: 70,
    borderRadius: 4,
  },
  posterPlaceholder: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.warning,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
