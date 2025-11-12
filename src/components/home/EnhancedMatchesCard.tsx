/**
 * 🎯 Enhanced Matches Card
 * Card de matches mejorado con ratings de compatibilidad
 */

import React from 'react';
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
import type { MatchesResponse, PotentialMatch } from '../../types/match.types';
import { matchesService } from '../../services/matchesService';

interface EnhancedMatchesCardProps {
  matches: MatchesResponse | null;
  loading?: boolean;
  onMatchPress: (userId: string) => void;
  onViewAllPress: () => void;
}

// Función para generar estrellas con iconos (como en MovieRatings)
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

export default function EnhancedMatchesCard({
  matches,
  loading = false,
  onMatchPress,
  onViewAllPress,
}: EnhancedMatchesCardProps) {
  if (loading) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Buscando matches...</Text>
      </View>
    );
  }

  if (!matches || matches.matches.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Icon name="people-outline" size={64} color={COLORS.primary} />
        <Text style={styles.emptyTitle}>No hay matches aún</Text>
        <Text style={styles.emptySubtitle}>
          Empieza a calificar películas para encontrar personas con gustos
          similares
        </Text>
      </View>
    );
  }

  // Mostrar solo el primer match
  const displayMatches = matches.matches.slice(0, 1);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="people" size={32} color={COLORS.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>🎯 Encuentra Tu Match</Text>
            <Text style={styles.subtitle}>
              {matches.total}{' '}
              {matches.total === 1
                ? 'persona compatible'
                : 'personas compatibles'}
            </Text>
          </View>
        </View>
      </View>

      {/* Matches List */}
      <View style={styles.matchesList}>
        {displayMatches.map((match: PotentialMatch, index: number) => {
          // Calcular compatibilidad basado en ratings similares y recencia
          let compatibilityPercent = 70; // Base compatibility

          if (match.myRating && match.theirRating) {
            // Bonus por ratings similares (±1 estrella = buena compatibilidad)
            const ratingDiff = Math.abs(match.myRating - match.theirRating);
            const ratingBonus = Math.max(0, 30 - ratingDiff * 15);
            compatibilityPercent += ratingBonus;
          }

          // Bonus por recencia (más reciente = más compatible)
          const recencyBonus = Math.max(0, 15 - match.daysAgo);
          compatibilityPercent += recencyBonus;

          // Cap at 100%
          compatibilityPercent = Math.min(
            100,
            Math.round(compatibilityPercent),
          );

          return (
            <TouchableOpacity
              key={match.userId}
              style={[
                styles.matchCard,
                index < displayMatches.length - 1 && styles.matchCardBorder,
              ]}
              onPress={() => onMatchPress(match.userId)}
              activeOpacity={0.7}
            >
              {/* User Info */}
              <View style={styles.matchUser}>
                <Image
                  source={{
                    uri: match.photoURL || 'https://via.placeholder.com/48x48',
                  }}
                  style={styles.matchAvatar}
                />
                <View style={styles.matchUserInfo}>
                  <Text style={styles.matchUserName}>
                    {match.displayName || 'Usuario'}
                  </Text>
                  <Text style={styles.matchUserBio} numberOfLines={1}>
                    {`Vio ${matchesService.formatDaysAgo(
                      match.daysAgo,
                    )}`}
                  </Text>
                  <Text style={styles.matchScore}>
                    Compatibilidad {compatibilityPercent}%
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} color={COLORS.primary} />
              </View>

              {/* Rating Compatibility */}
              {compatibilityPercent !== null && (
                <View style={styles.compatibilityBar}>
                  <View style={styles.compatibilityInfo}>
                    <Text style={styles.compatibilityLabel}>
                      Compatibilidad
                    </Text>
                    <Text style={styles.compatibilityPercent}>
                      {compatibilityPercent}%
                    </Text>
                  </View>
                  <View style={styles.ratingsComparison}>
                    <View style={styles.ratingItem}>
                      <Text style={styles.ratingLabel}>Tu rating</Text>
                      <View style={styles.ratingStarsContainer}>
                        {match.myRating ? (
                          generateStarRating(match.myRating)
                        ) : (
                          <Text style={styles.noRatingText}>Sin rating</Text>
                        )}
                      </View>
                    </View>
                    <Icon
                      name="swap-horizontal"
                      size={20}
                      color={COLORS.primary}
                    />
                    <View style={styles.ratingItem}>
                      <Text style={styles.ratingLabel}>Su rating</Text>
                      <View style={styles.ratingStarsContainer}>
                        {match.theirRating ? (
                          generateStarRating(match.theirRating)
                        ) : (
                          <Text style={styles.noRatingText}>Sin rating</Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* View All Button */}
      {matches.total > 1 && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={onViewAllPress}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>
            Ver todos los matches ({matches.total})
          </Text>
          <Icon name="arrow-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  matchesList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  matchCard: {
    paddingVertical: 16,
  },
  matchCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 162, 76, 0.2)',
  },
  matchUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  matchUserInfo: {
    flex: 1,
  },
  matchUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  matchUserBio: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  matchScore: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  compatibilityBar: {
    backgroundColor: 'rgba(199, 162, 76, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  compatibilityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compatibilityLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  compatibilityPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ratingsComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingItem: {
    flex: 1,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 14,
  },
  sharedMovies: {
    flexDirection: 'row',
    gap: 8,
  },
  moviePoster: {
    width: 50,
    aspectRatio: 2 / 3,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  moreMovies: {
    width: 50,
    aspectRatio: 2 / 3,
    borderRadius: 6,
    backgroundColor: 'rgba(199, 162, 76, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreMoviesText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(199, 162, 76, 0.2)',
    gap: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  movieSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  noRatingText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
