import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchInput, SearchResults, UserSearchResults, ForumSearchResults, SearchTabs } from '../../components/screens/search';
import { useMovieSearch, useUserSearch, useForumSearch } from '../../hooks/search';
import type { SearchTabType } from '../../components/screens/search/SearchTabs';
import type { TmdbMovie } from '../../types/tmdb.types';
import type { User } from '../../types/user.types';
import type { ForumSummary } from '../../types/forum.types';
import { COLORS } from '../../config/colors';

interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<SearchTabType>('movies');
  const [searchQuery, setSearchQuery] = useState('');

  // Hooks de búsqueda
  const movieSearch = useMovieSearch();
  const userSearch = useUserSearch();
  const forumSearch = useForumSearch();

  // Efecto para búsqueda automática con debounce de 1.5 segundos
  useEffect(() => {
    if (searchQuery.trim()) {
      // Ejecutar búsqueda solo en el tab activo
      switch (activeTab) {
        case 'movies':
          movieSearch.searchMovies(searchQuery.trim());
          break;
        case 'users':
          userSearch.searchUsers(searchQuery.trim());
          break;
        case 'forums':
          forumSearch.searchForums(searchQuery.trim());
          break;
      }
    } else {
      // Limpiar todas las búsquedas si no hay query
      movieSearch.clearSearch();
      userSearch.clearSearch();
      forumSearch.clearSearch();
    }
  }, [searchQuery, activeTab]);

  const handleTabChange = (tab: SearchTabType) => {
    setActiveTab(tab);
    // El useEffect se encargará de ejecutar la búsqueda cuando cambie activeTab
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    movieSearch.clearSearch();
    userSearch.clearSearch();
    forumSearch.clearSearch();
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // Ejecutar búsqueda inmediata sin esperar debounce
      switch (activeTab) {
        case 'movies':
          movieSearch.searchMovies(searchQuery.trim());
          break;
        case 'users':
          userSearch.searchUsers(searchQuery.trim());
          break;
        case 'forums':
          forumSearch.searchForums(searchQuery.trim());
          break;
      }
    }
  };

  const handleMoviePress = (movie: TmdbMovie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  const handleUserPress = (user: User) => {
    navigation.navigate('UserProfile', { userId: user.id });
  };

  const handleForumPress = (forum: ForumSummary) => {
    navigation.navigate('ForumDetails', { forumId: forum.forumId });
  };

  const renderResults = () => {
    switch (activeTab) {
      case 'movies':
        return (
          <SearchResults
            movies={movieSearch.movies}
            loading={movieSearch.loading}
            error={movieSearch.error}
            hasSearched={movieSearch.hasSearched}
            onMoviePress={handleMoviePress}
            onLoadMore={movieSearch.loadMoreMovies}
            hasMorePages={movieSearch.hasMorePages}
            onRetry={() => movieSearch.searchMovies(searchQuery)}
          />
        );
      
      case 'users':
        return (
          <UserSearchResults
            users={userSearch.users}
            loading={userSearch.loading}
            error={userSearch.error}
            hasSearched={userSearch.hasSearched}
            onUserPress={handleUserPress}
            onRetry={() => userSearch.searchUsers(searchQuery)}
          />
        );
      
      case 'forums':
        return (
          <ForumSearchResults
            forums={forumSearch.forums}
            loading={forumSearch.loading}
            error={forumSearch.error}
            hasSearched={forumSearch.hasSearched}
            onForumPress={handleForumPress}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
        onSubmitEditing={handleSearchSubmit}
        placeholder={`Buscar ${
          activeTab === 'movies' ? 'películas' : 
          activeTab === 'users' ? 'usuarios' : 'foros'
        }...`}
      />
      
      <SearchTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        movieCount={movieSearch.movies.length}
        userCount={userSearch.users.length}
        forumCount={forumSearch.forums.length}
      />

      <View style={styles.resultsContainer}>
        {renderResults()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  resultsContainer: {
    flex: 1,
  },
});