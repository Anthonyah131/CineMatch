import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const COLORS = {
  background: '#0F0B0A',
  surface: '#1A1412',
  primary: '#C7A24C',
  accent: '#A4252C',
  text: '#F2E9E4',
};

interface MovieRatingsProps {
  voteAverage: number;
  voteCount: number;
  userRating?: number | null;
}

export function MovieRatings({
  voteAverage,
  voteCount,
  userRating,
}: MovieRatingsProps) {
  // Convert vote average (0-10) to 5-star scale
  const starRating = voteAverage / 2;
  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating % 1 >= 0.5;

  // Generate bar heights based on voteAverage (simulate distribution)
  // Higher rating = bars rise towards the right
  const generateBarHeights = (rating: number) => {
    const normalizedRating = rating / 10; // 0-1 scale
    return [
      Math.max(0.2, (1 - normalizedRating) * 0.4),
      Math.max(0.25, (1 - normalizedRating) * 0.5 + normalizedRating * 0.2),
      Math.max(0.3, (1 - normalizedRating) * 0.6 + normalizedRating * 0.3),
      Math.max(0.4, (1 - normalizedRating) * 0.5 + normalizedRating * 0.5),
      Math.max(0.5, normalizedRating * 0.65),
      Math.max(0.65, normalizedRating * 0.8),
      Math.max(0.8, normalizedRating * 0.95),
      normalizedRating,
    ];
  };

  const barHeights = generateBarHeights(voteAverage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ratings</Text>

      <View style={styles.ratingsContent}>
        <View style={styles.barsContainer}>
          <Icon
            name="star"
            size={10}
            color={COLORS.accent}
            style={styles.starIcon}
          />
          <View style={styles.bars}>
            {barHeights.map((height, index) => (
              <View
                key={index}
                style={[styles.bar, { height: `${height * 100}%` }]}
              />
            ))}
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.voteAverage}>{voteAverage.toFixed(1)}/10</Text>
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
                  size={14}
                  color={COLORS.accent}
                  style={styles.star}
                />
              );
            })}
          </View>
        </View>
      </View>

      {/* Vote Count */}
      <Text style={styles.voteCount}>{voteCount.toLocaleString()} votes</Text>

      {/* User Rating (if exists) */}
      {userRating && (
        <View style={styles.userRatingContainer}>
          <Icon name="heart" size={16} color="#E69CA3" />
          <Text style={styles.userRatingText}>Your rating: {userRating}/5</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.primary,
    marginBottom: 12,
  },
  ratingsContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    flex: 1,
  },
  starIcon: {
    marginBottom: 4,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 60,
    flex: 1,
  },
  bar: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    minHeight: 8,
  },
  rightSection: {
    alignItems: 'center',
    gap: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  star: {
    // Star styling
  },
  voteAverage: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  voteCount: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.5,
  },
  userRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  userRatingText: {
    fontSize: 12,
    color: '#E69CA3',
    fontWeight: '600',
  },
});
