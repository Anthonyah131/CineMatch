import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMovieSearch } from '../../hooks/search/useMovieSearch';
import { useUserSearch } from '../../hooks/search/useUserSearch';
import { 
  SearchInput, 
  SearchResults, 
  UserSearchResults,
  SearchTabs,
  type SearchTabType 
} from '../../components/screens/search';
import { COLORS } from '../../config/colors';
import type { TmdbMovie } from '../../types/tmdb.types';
import type { User } from '../../types/user.types';

interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<SearchTabType>('movies');

  // Movie search hook
  const {
    query: movieQuery,
    movies,
    loading: moviesLoading,
    error: moviesError,
    hasSearched: hasMoviesSearched,
    hasMorePages,
    searchMovies,
    loadMoreMovies,
    clearSearch: clearMovieSearch,
    setQuery: setMovieQuery,
  } = useMovieSearch();

  // User search hook
  const {
    query: userQuery,
    users,
    loading: usersLoading,
    error: usersError,
    hasSearched: hasUsersSearched,
    searchUsers,
    clearSearch: clearUserSearch,
    setQuery: setUserQuery,
  } = useUserSearch();

  // Unified query state
  const currentQuery = activeTab === 'movies' ? movieQuery : userQuery;
  const currentLoading = activeTab === 'movies' ? moviesLoading : usersLoading;

  const handleQueryChange = (text: string) => {
    if (activeTab === 'movies') {
      setMovieQuery(text);
    } else {
      setUserQuery(text);
    }
  };

  const handleClearSearch = () => {
    if (activeTab === 'movies') {
      clearMovieSearch();
    } else {
      clearUserSearch();
    }
  };

  const handleTabChange = (tab: SearchTabType) => {
    setActiveTab(tab);
    // When switching tabs, if the other tab has a different query, sync them
    if (tab === 'movies' && userQuery && !movieQuery) {
      setMovieQuery(userQuery);
    } else if (tab === 'users' && movieQuery && !userQuery) {
      setUserQuery(movieQuery);
    }
  };

  const handleMoviePress = (movie: TmdbMovie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  const handleUserPress = (user: User) => {
    navigation.navigate('UserProfile', { userId: user.id });
  };

  const handleMovieRetry = () => {
    if (movieQuery.trim()) {
      searchMovies(movieQuery);
    }
  };

  const handleUserRetry = () => {
    if (userQuery.trim()) {
      searchUsers(userQuery);
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
            value={currentQuery}
            onChangeText={handleQueryChange}
            onClear={handleClearSearch}
            loading={currentLoading}
            placeholder={
              activeTab === 'movies' 
                ? 'Buscar películas...' 
                : 'Buscar usuarios...'
            }
          />
          
          <SearchTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            movieCount={hasMoviesSearched ? movies.length : undefined}
            userCount={hasUsersSearched ? users.length : undefined}
          />
        </View>

        <View style={styles.content}>
          {activeTab === 'movies' ? (
            <SearchResults
              movies={movies}
              loading={moviesLoading}
              error={moviesError}
              hasSearched={hasMoviesSearched}
              hasMorePages={hasMorePages}
              onMoviePress={handleMoviePress}
              onLoadMore={loadMoreMovies}
              onRetry={handleMovieRetry}
            />
          ) : (
            <UserSearchResults
              users={users}
              loading={usersLoading}
              error={usersError}
              hasSearched={hasUsersSearched}
              onUserPress={handleUserPress}
              onRetry={handleUserRetry}
            />
          )}
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
