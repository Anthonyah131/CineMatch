import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { MediaLog } from '../../types/mediaLog.types';
import { formatShortDate } from '../../utils/dateFormatter';
import { COLORS } from '../../config/colors';

interface ReviewCardProps {
  log: MediaLog;
  movieTitle: string;
  posterPath: string | null;
  onPress?: () => void;
}

export default function ReviewCard({
  log,
  movieTitle,
  posterPath,
  onPress,
}: ReviewCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`full-${i}`} name="star" size={14} color={COLORS.primary} />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={14} color={COLORS.primary} />,
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-${i}`}
          name="star-outline"
          size={14}
          color={COLORS.primary}
        />,
      );
    }

    return stars;
  };

  const getPosterUrl = (path: string | null) => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/w185${path}`;
  };

  const watchedDate =
    log.watchedAt &&
    typeof log.watchedAt === 'object' &&
    '_seconds' in log.watchedAt
      ? new Date(log.watchedAt._seconds * 1000)
      : null;

  const formattedDate = watchedDate ? formatShortDate(watchedDate) : null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {posterPath ? (
          <Image
            source={{ uri: getPosterUrl(posterPath)! }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderText}>
              {movieTitle.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {movieTitle}
          </Text>

          {log.rating && (
            <View style={styles.ratingRow}>{renderStars(log.rating)}</View>
          )}

          {log.review && (
            <Text style={styles.reviewText} numberOfLines={3}>
              {log.review}
            </Text>
          )}

          {formattedDate && <Text style={styles.date}>{formattedDate}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  posterPlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.text,
    opacity: 0.8,
    lineHeight: 18,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: COLORS.primary,
    opacity: 0.7,
  },
});
