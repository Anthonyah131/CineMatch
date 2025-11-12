/**
 * 🎬 Friends Activity Carousel
 * Carrusel horizontal de actividad reciente de amigos
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { formatRelativeDate } from '../../utils/dateFormatter';
import { buildPosterUrl } from '../../utils/tmdbImageHelpers';
import ReviewModal from '../ui/modals/ReviewModal';
import type { FriendActivity } from '../../types/user.types';

interface FriendsActivityCarouselProps {
  activities: FriendActivity[];
  loading?: boolean;
  onMoviePress: (tmdbId: number) => void;
  onUserPress: (userId: string) => void;
}

export default function FriendsActivityCarousel({
  activities,
  loading = false,
  onMoviePress,
  onUserPress,
}: FriendsActivityCarouselProps) {
  const [selectedReview, setSelectedReview] = useState<FriendActivity | null>(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  const renderActivityCard = ({ item }: { item: FriendActivity }) => {
    const posterUrl = buildPosterUrl(item.posterPath, 'w342');

    // Generate star rating like in MovieRatings
    const generateStarRating = (rating: number) => {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      return (
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => {
            const isFilled = index < fullStars;
            const isHalf = index === fullStars && hasHalfStar;

            return (
              <Icon
                key={index}
                name={isFilled ? 'star' : isHalf ? 'star-half' : 'star-outline'}
                size={12}
                color={COLORS.accent}
              />
            );
          })}
        </View>
      );
    };

    return (
      <View style={styles.card}>
        {/* Poster más pequeño */}
        <TouchableOpacity
          onPress={() => onMoviePress(item.tmdbId)}
          activeOpacity={0.8}
        >
          <View style={styles.posterContainer}>
            {posterUrl ? (
              <Image source={{ uri: posterUrl }} style={styles.poster} />
            ) : (
              <View style={styles.posterPlaceholder}>
                <Text style={styles.posterPlaceholderText}>?</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* User Info */}
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress(item.userId)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: item.userPhoto }} style={styles.userAvatar} />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.userName}
            </Text>
            <Text style={styles.timeAgo}>
              {formatRelativeDate(item.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Rating with Stars */}
        {item.rating && (
          <View style={styles.ratingContainer}>
            {generateStarRating(item.rating)}
            <Text style={styles.ratingText}>{item.rating}/5</Text>
          </View>
        )}

        {/* Ver más button only if has review */}
        {item.review && item.review.trim().length > 0 && (
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => setSelectedReview(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewMoreText}>Ver más</Text>
            <Icon name="chevron-forward" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 Actividad de Amigos</Text>
        <Text style={styles.subtitle}>Qué están viendo tus amigos</Text>
      </View>

      <FlatList
        data={activities}
        renderItem={renderActivityCard}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
      />

      {/* Review Modal */}
      {selectedReview && (
        <ReviewModal
          visible={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
          posterPath={selectedReview.posterPath}
          onUserPress={onUserPress}
          onMoviePress={onMoviePress}
          showMoviePoster={true}
        />
      )}
    </View>
  );
}

const CARD_WIDTH = 160;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  posterContainer: {
    width: 80,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 8,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterPlaceholderText: {
    fontSize: 48,
    color: COLORS.textSecondary,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#CCCCCC',
    fontWeight: '600',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 162, 76, 0.1)',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    lineHeight: 18,
  },
  reviewPreview: {
    padding: 12,
    paddingTop: 8,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  readMore: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
});
