/**
 * 🎬 Reviews List Component
 * Lista de reviews de usuarios para MovieDetailsScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { formatRelativeDate } from '../../utils/dateFormatter';
import ReviewModal from '../ui/modals/ReviewModal';
import type { UserReview } from '../../types/user.types';

interface ReviewsListProps {
  reviews: UserReview[];
  loading?: boolean;
  posterPath?: string;
  onUserPress: (userId: string) => void;
}

export default function ReviewsList({
  reviews,
  loading = false,
  posterPath,
  onUserPress,
}: ReviewsListProps) {
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);

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
              name={
                isFilled ? 'star' : isHalf ? 'star-half' : 'star-outline'
              }
              size={12}
              color={COLORS.accent}
              style={styles.star}
            />
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando reviews...</Text>
      </View>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        💬 Reviews de Usuarios ({reviews.length})
      </Text>

      <View style={styles.reviewsList}>
        {reviews.map((review) => (
          <TouchableOpacity
            key={review.id || `${review.userId}-${review.createdAt}`}
            style={styles.reviewCard}
            onPress={() => setSelectedReview(review)}
            activeOpacity={0.7}
          >
            {/* User Info Header */}
            <View style={styles.userHeader}>
              <TouchableOpacity
                style={styles.userInfo}
                onPress={(e) => {
                  e.stopPropagation();
                  onUserPress(review.userId);
                }}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: review.userPhoto }}
                  style={styles.userAvatar}
                />
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>{review.userName}</Text>
                  <Text style={styles.timeAgo}>
                    {formatRelativeDate(review.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <Icon name="chevron-forward" size={16} color={COLORS.primary} />
            </View>

            {/* Rating */}
            {review.rating && (
              <View style={styles.ratingRow}>
                {generateStarRating(review.rating)}
                <Text style={styles.ratingValue}>{review.rating}/5</Text>
              </View>
            )}

            {/* Review Text Preview */}
            {review.review && (
              <View style={styles.reviewPreview}>
                <Text style={styles.reviewText} numberOfLines={3}>
                  {review.review}
                </Text>
                <Text style={styles.readMore}>Leer review completa</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Review Modal */}
      {selectedReview && (
        <ReviewModal
          visible={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
          posterPath={posterPath}
          onUserPress={onUserPress}
          showMoviePoster={false} // No navegar a la película desde aquí
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(199, 162, 76, 0.2)',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  star: {
    // Star styling
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  reviewPreview: {
    marginTop: 4,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});