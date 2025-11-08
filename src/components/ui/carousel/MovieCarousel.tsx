import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { TmdbMovie } from '../../../types/tmdb.types';
import { COLORS } from '../../../config/colors';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.28;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

interface MovieCarouselProps {
  title: string;
  movies: TmdbMovie[];
  onMoviePress?: (movie: TmdbMovie) => void;
  showUserRatings?: boolean;
  movieUserData?: {
    [movieId: number]: { rating?: number; hadSeenBefore?: boolean };
  };
}

export default function MovieCarousel({
  title,
  movies,
  onMoviePress,
  showUserRatings = false,
  movieUserData = {},
}: MovieCarouselProps) {
  const getImageUrl = (posterPath: string | null) => {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/w342${posterPath}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`full-${i}`} name="star" size={12} color={COLORS.primary} />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={12} color={COLORS.primary} />,
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-${i}`}
          name="star-outline"
          size={12}
          color={COLORS.primary}
        />,
      );
    }

    return stars;
  };

  const renderMovie = ({ item: movie }: { item: TmdbMovie }) => {
    const userData = movieUserData[movie.id];
    const userRating = userData?.rating;
    const hadSeenBefore = userData?.hadSeenBefore;

    return (
      <TouchableOpacity
        style={styles.posterContainer}
        onPress={() => onMoviePress?.(movie)}
        activeOpacity={0.8}
      >
        <View>
          {movie.poster_path ? (
            <Image
              source={{ uri: getImageUrl(movie.poster_path)! }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderPoster}>
              <Text style={styles.placeholderText}>
                {movie.title.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}

          {/* Rewatch icon */}
          {showUserRatings && hadSeenBefore && (
            <View style={styles.rewatchBadge}>
              <Icon name="refresh" size={14} color={COLORS.text} />
            </View>
          )}

          {/* User rating */}
          {showUserRatings && userRating !== undefined && userRating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsRow}>{renderStars(userRating)}</View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: POSTER_WIDTH + 12,
          offset: (POSTER_WIDTH + 12) * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F2E9E4',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  posterContainer: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    backgroundColor: '#1A1412',
  },
  placeholderPoster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    backgroundColor: '#1A1412',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7A24C',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#C7A24C',
  },
  rewatchBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(164, 37, 44, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 11, 10, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
});
