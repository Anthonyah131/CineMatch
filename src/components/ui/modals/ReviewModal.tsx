/**
 * 🎬 Review Modal Component
 * Modal para mostrar la review completa de un usuario
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import { formatLongDate } from '../../../utils/dateFormatter';
import { buildPosterUrl } from '../../../utils/tmdbImageHelpers';
import type { FriendActivity, UserReview } from '../../../types/user.types';

// Función para generar estrellas con iconos
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
            size={20}
            color={COLORS.accent}
          />
        );
      })}
    </View>
  );
};

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  review: FriendActivity | UserReview;
  movieTitle?: string;
  posterPath?: string;
  onUserPress?: (userId: string) => void;
  onMoviePress?: (tmdbId: number) => void;
  showMoviePoster?: boolean; // Si se puede presionar el poster
}

export default function ReviewModal({
  visible,
  onClose,
  review,
  posterPath,
  onUserPress,
  onMoviePress,
  showMoviePoster = true,
}: ReviewModalProps) {
  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress(review.userId);
      onClose();
    }
  };

  const handleMoviePress = () => {
    if (onMoviePress && 'tmdbId' in review) {
      onMoviePress(review.tmdbId);
      onClose();
    }
  };

  // Detectar si es FriendActivity (tiene tmdbId y posterPath) o UserReview
  const isFriendActivity = 'tmdbId' in review;

  const posterUrl = posterPath
    ? buildPosterUrl(posterPath, 'w342')
    : isFriendActivity && review.posterPath
    ? buildPosterUrl(review.posterPath, 'w342')
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Review</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Movie Info */}
            {posterUrl && (
              <TouchableOpacity
                onPress={showMoviePoster ? handleMoviePress : undefined}
                disabled={!showMoviePoster}
                activeOpacity={showMoviePoster ? 0.7 : 1}
              >
                <Image source={{ uri: posterUrl }} style={styles.poster} />
              </TouchableOpacity>
            )}

            {/* User Info */}
            <TouchableOpacity
              style={styles.userSection}
              onPress={handleUserPress}
              disabled={!onUserPress}
              activeOpacity={0.7}
            >
              {review.userPhoto ? (
                <Image
                  source={{ uri: review.userPhoto }}
                  style={styles.userAvatar}
                />
              ) : (
                <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
                  <Icon name="person" size={24} color={COLORS.primary} />
                </View>
              )}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {review.userName || 'Usuario'}
                </Text>
                {review.watchedAt && (
                  <Text style={styles.watchedDate}>
                    Visto el {formatLongDate(review.watchedAt)}
                  </Text>
                )}
              </View>
              {onUserPress && (
                <Icon name="chevron-forward" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>

            {/* Rating */}
            {review.rating && review.rating > 0 && (
              <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>Calificación</Text>
                {generateStarRating(review.rating)}
                <Text style={styles.ratingValue}>{review.rating}/5</Text>
              </View>
            )}

            {/* Review Text */}
            {review.review && review.review.trim().length > 0 && (
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Review</Text>
                <Text style={styles.reviewText}>{review.review.trim()}</Text>
              </View>
            )}

            {/* Metadata */}
            <View style={styles.metadata}>
              {review.createdAt && (
                <Text style={styles.metadataText}>
                  Publicado el {formatLongDate(review.createdAt)}
                </Text>
              )}
              {review.reviewLang && (
                <Text style={styles.metadataText}>
                  Idioma: {review.reviewLang.toUpperCase()}
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 162, 76, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  poster: {
    width: '60%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: COLORS.background,
    alignSelf: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userAvatarPlaceholder: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  watchedDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingSection: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  reviewSection: {
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  metadata: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(199, 162, 76, 0.2)',
    gap: 6,
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
