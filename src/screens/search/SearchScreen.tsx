import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchInput, SearchResults, UserSearchResults, ForumSearchResults, ListSearchResults, SearchTabs } from '../../components/screens/search';
import { useMovieSearch, useUserSearch, useForumSearch, useListSearch } from '../../hooks/search';
import type { SearchTabType } from '../../components/screens/search/SearchTabs';
import type { TmdbMovie } from '../../types/tmdb.types';
import type { User } from '../../types/user.types';
import type { ForumSummary } from '../../types/forum.types';
import type { ListWithOwner } from '../../types/list.types';
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
  const listSearch = useListSearch();

  // Efecto para sincronizar query con los hooks
  useEffect(() => {
    // Solo actualizar el hook del tab activo
    switch (activeTab) {
      case 'forums':
        forumSearch.setQuery(searchQuery);
        break;
      case 'users':
        userSearch.setQuery(searchQuery);
        break;
      case 'lists':
        listSearch.setQuery(searchQuery);
        break;
      // Para movies mantener la lógica anterior por ahora
    }
  }, [searchQuery, activeTab]);

  const handleTabChange = (tab: SearchTabType) => {
    setActiveTab(tab);
    
    // Activar la búsqueda en el nuevo tab si hay query
    if (searchQuery.trim()) {
      switch (tab) {
        case 'movies':
          movieSearch.searchMovies(searchQuery.trim());
          break;
        case 'users':
          userSearch.setQuery(searchQuery);
          break;
        case 'forums':
          forumSearch.setQuery(searchQuery);
          break;
        case 'lists':
          listSearch.setQuery(searchQuery);
          break;
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    movieSearch.clearSearch();
    userSearch.clearSearch();
    forumSearch.clearSearch();
    listSearch.clearSearch();
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
        case 'lists':
          listSearch.searchLists(searchQuery.trim());
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

  const handleListPress = (list: ListWithOwner) => {
    navigation.navigate('ListDetails', { listId: list.id });
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
      
      case 'lists':
        return (
          <ListSearchResults
            lists={listSearch.lists}
            loading={listSearch.loading}
            error={listSearch.error}
            hasSearched={listSearch.hasSearched}
            onListPress={handleListPress}
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
          activeTab === 'users' ? 'usuarios' : 
          activeTab === 'forums' ? 'foros' : 'listas'
        }...`}
      />
      
      <SearchTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        movieCount={movieSearch.movies.length}
        userCount={userSearch.users.length}
        forumCount={forumSearch.forums.length}
        listCount={listSearch.lists.length}
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