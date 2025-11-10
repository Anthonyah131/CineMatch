import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMovieSearch } from '../../hooks/search/useMovieSearch';
import { SearchInput, SearchResults } from '../../components/screens/search';
import { COLORS } from '../../config/colors';
import type { TmdbMovie } from '../../types/tmdb.types';

interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const {
    query,
    movies,
    loading,
    error,
    hasSearched,
    hasMorePages,
    searchMovies,
    loadMoreMovies,
    clearSearch,
    setQuery,
  } = useMovieSearch();

  const handleMoviePress = (movie: TmdbMovie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  const handleRetry = () => {
    if (query.trim()) {
      searchMovies(query);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            onClear={clearSearch}
            loading={loading}
            placeholder="Buscar películas..."
          />
        </View>

        <View style={styles.content}>
          <SearchResults
            movies={movies}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
            hasMorePages={hasMorePages}
            onMoviePress={handleMoviePress}
            onLoadMore={loadMoreMovies}
            onRetry={handleRetry}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
});
