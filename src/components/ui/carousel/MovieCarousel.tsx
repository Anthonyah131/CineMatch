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
import type { TmdbMovie } from '../../../types/tmdb.types';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.28;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

interface MovieCarouselProps {
  title: string;
  movies: TmdbMovie[];
  onMoviePress?: (movie: TmdbMovie) => void;
}

export default function MovieCarousel({
  title,
  movies,
  onMoviePress,
}: MovieCarouselProps) {
  const getImageUrl = (posterPath: string | null) => {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/w342${posterPath}`;
  };

  const renderMovie = ({ item: movie }: { item: TmdbMovie }) => (
    <TouchableOpacity
      style={styles.posterContainer}
      onPress={() => onMoviePress?.(movie)}
      activeOpacity={0.8}
    >
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
    </TouchableOpacity>
  );

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
    color: '#F2E9E4', // texto blanco cálido
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
    backgroundColor: '#1A1412', // superficie marrón oscuro
  },
  placeholderPoster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    backgroundColor: '#1A1412', // superficie marrón oscuro
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7A24C', // dorado
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#C7A24C', // dorado
  },
});
