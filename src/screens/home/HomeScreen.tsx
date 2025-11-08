import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Sidebar from '../../components/ui/sideBar/Sidebar';
import MovieCarousel from '../../components/ui/carousel/MovieCarousel';
import { useHomeMovies } from '../../hooks/home/useHomeMovies';
import { useAuth } from '../../context/AuthContext';
import type { TmdbMovie } from '../../types/tmdb.types';
import { COLORS } from '../../config/colors';

export default function HomeScreen({ navigation }: any) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user } = useAuth();

  const {
    trendingMovies,
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
        <TouchableOpacity style={styles.avatarButton}>
          {user?.photoUrl ? (
            <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={20} color="#C7A24C" />
            </View>
          )}
        </TouchableOpacity>
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
          <View style={styles.errorBanner}>
            <Icon name="alert-circle-outline" size={48} color={COLORS.accent} />
            <Text style={styles.errorBannerText}>{error}</Text>
            <Text style={styles.errorBannerSubtext}>
              No se pudieron cargar algunas películas
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Icon name="refresh" size={18} color={COLORS.text} />
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
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

        {/* Top Rated Movies */}
        {topRatedMovies.length > 0 && (
          <MovieCarousel
            title="🏆 Mejor Valoradas"
            movies={topRatedMovies}
            onMoviePress={handleMoviePress}
          />
        )}

        {/* Matches Call to Action */}
        <TouchableOpacity
          style={styles.matchesCard}
          onPress={() => navigation.navigate('Matches')}
          activeOpacity={0.8}
        >
          <View style={styles.matchesIconContainer}>
            <Icon name="people" size={48} color="#C7A24C" />
          </View>
          <View style={styles.matchesContent}>
            <Text style={styles.matchesTitle}>
              Encuentra Cinéfilos como Tú
            </Text>
            <Text style={styles.matchesSubtitle}>
              Conecta con personas que comparten tus mismos gustos cinematográficos
            </Text>
            <View style={styles.matchesButton}>
              <Text style={styles.matchesButtonText}>Explorar Matches</Text>
              <Icon name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Empty State */}
        {!error &&
          trendingMovies.length === 0 &&
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    padding: 8,
  },
  chatsButton: {
    padding: 8,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  headerTitle: {
    color: COLORS.text,
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
  errorBanner: {
    alignItems: 'center',
    backgroundColor: 'rgba(164, 37, 44, 0.1)',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 12,
  },
  errorBannerText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBannerSubtext: {
    color: COLORS.text,
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  matchesCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginVertical: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  matchesIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(199, 162, 76, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  matchesContent: {
    flex: 1,
  },
  matchesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  matchesSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  matchesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  matchesButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
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
    backgroundColor: COLORS.background,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1001,
  },
});
