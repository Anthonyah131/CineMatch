import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import { buildPosterUrl } from '../../../utils/tmdbImageHelpers';
import type { TmdbMovie } from '../../../types/tmdb.types';

interface SearchResultsProps {
  movies: TmdbMovie[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  hasMorePages: boolean;
  onMoviePress: (movie: TmdbMovie) => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  movies,
  loading,
  error,
  hasSearched,
  hasMorePages,
  onMoviePress,
  onLoadMore,
  onRetry,
}) => {
  const renderMovieItem: ListRenderItem<TmdbMovie> = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieItem}
      onPress={() => onMoviePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.posterContainer}>
        {item.poster_path && buildPosterUrl(item.poster_path, 'w342') ? (
          <Image
            source={{ uri: buildPosterUrl(item.poster_path, 'w342')! }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Icon name="film-outline" size={32} color={COLORS.textSecondary} />
          </View>
        )}
      </View>
      
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        {item.release_date && (
          <Text style={styles.movieYear}>
            {new Date(item.release_date).getFullYear()}
          </Text>
        )}
        
        {item.overview && (
          <Text style={styles.movieOverview} numberOfLines={3}>
            {item.overview}
          </Text>
        )}
        
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color={COLORS.primary} />
          <Text style={styles.rating}>
            {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
          </Text>
          <Text style={styles.voteCount}>
            ({item.vote_count || 0} votos)
          </Text>
        </View>
      </View>
      
      <View style={styles.chevronContainer}>
        <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading || movies.length === 0) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingFooterText}>Cargando más películas...</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={64} color={COLORS.primary} />
          <Text style={styles.emptyTitle}>Busca tu película favorita</Text>
          <Text style={styles.emptySubtitle}>
            Escribe el nombre de una película para comenzar
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorState}>
          <Icon name="alert-circle-outline" size={64} color={COLORS.accent} />
          <Text style={styles.errorTitle}>Error en la búsqueda</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Icon name="refresh" size={20} color={COLORS.text} />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (movies.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="film-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No se encontraron películas</Text>
          <Text style={styles.emptySubtitle}>
            Intenta con otro término de búsqueda
          </Text>
        </View>
      );
    }

    return null;
  };

  if (movies.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={hasMorePages ? onLoadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  posterContainer: {
    width: 80,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    marginRight: 12,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  movieYear: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  movieOverview: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  voteCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chevronContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingFooterText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    gap: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.accent,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});