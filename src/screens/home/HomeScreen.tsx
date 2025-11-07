import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Sidebar from '../../components/ui/sideBar/Sidebar';
import MovieCarousel from '../../components/ui/carousel/MovieCarousel';
import { useHomeMovies } from '../../hooks/home/useHomeMovies';
import type { TmdbMovie } from '../../types/tmdb.types';

export default function HomeScreen({ navigation }: any) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const {
    popularMovies,
    trendingMovies,
    upcomingMovies,
    topRatedMovies,
    error,
    refreshing,
    refresh,
  } = useHomeMovies();

  const openSidebar = () => setSidebarVisible(true);
  const closeSidebar = () => setSidebarVisible(false);

  const handleMoviePress = (movie: TmdbMovie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
          <Icon name="menu" size={24} color="#F2E9E4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CineMatch</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#C7A24C"
            colors={['#C7A24C']}
          />
        }
      >
        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={24} color="#A4252C" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Trending Movies */}
        {trendingMovies.length > 0 && (
          <MovieCarousel
            title="🔥 En Tendencia Esta Semana"
            movies={trendingMovies}
            onMoviePress={handleMoviePress}
          />
        )}

        {/* Popular Movies */}
        {popularMovies.length > 0 && (
          <MovieCarousel
            title="⭐ Películas Populares"
            movies={popularMovies}
            onMoviePress={handleMoviePress}
          />
        )}

        {/* Upcoming Movies */}
        {upcomingMovies.length > 0 && (
          <MovieCarousel
            title="🎬 Próximos Estrenos"
            movies={upcomingMovies}
            onMoviePress={handleMoviePress}
          />
        )}

        {/* Top Rated Movies */}
        {topRatedMovies.length > 0 && (
          <MovieCarousel
            title="🏆 Mejor Valoradas"
            movies={topRatedMovies}
            onMoviePress={handleMoviePress}
          />
        )}

        {/* Empty State */}
        {!error &&
          popularMovies.length === 0 &&
          trendingMovies.length === 0 &&
          upcomingMovies.length === 0 &&
          topRatedMovies.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="film-outline" size={64} color="#C7A24C" />
              <Text style={styles.emptyText}>No hay películas disponibles</Text>
              <Text style={styles.emptySubtext}>
                Desliza hacia abajo para actualizar
              </Text>
            </View>
          )}

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            onPress={closeSidebar}
            activeOpacity={1}
          />
          <View style={styles.sidebar}>
            <Sidebar navigation={navigation} onClose={closeSidebar} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0B0A', // Negro cálido
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1412', // Superficie marrón oscuro
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#F2E9E4', // Blanco cálido
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(164, 37, 44, 0.1)',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A4252C',
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: '#A4252C',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#F2E9E4',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#C9ADA7',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#1B1730',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1001,
  },
});
