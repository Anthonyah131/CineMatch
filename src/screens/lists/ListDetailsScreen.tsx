import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { buildPosterUrl } from '../../utils/tmdbImageHelpers';
import { useListDetails } from '../../hooks/lists/useListDetails';
import type { ListItem } from '../../types/list.types';

interface ListDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      listId: string;
    };
  };
}

export default function ListDetailsScreen({ navigation, route }: ListDetailsScreenProps) {
  const { listId } = route.params;
  const { list, items, loading, error, refreshing, refresh, removeItem } = useListDetails(listId);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  const handleMoviePress = (item: ListItem) => {
    navigation.navigate('MovieDetails', { movieId: item.tmdbId });
  };

  const handleAddMovies = () => {
    // Navegar a la pantalla de búsqueda con un parámetro para saber que debe agregar a esta lista
    navigation.navigate('Search', {
      screen: 'SearchMain',
      params: { addToListId: listId }
    });
  };

  const confirmRemoveItem = (item: ListItem) => {
    Alert.alert(
      'Eliminar Película',
      `¿Quieres eliminar "${item.title}" de esta lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleRemoveItem(item.id),
        },
      ]
    );
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItem(itemId);
    const success = await removeItem(itemId);
    
    if (success) {
      Alert.alert('Éxito', 'Película eliminada de la lista');
    }
    
    setRemovingItem(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderMovieItem: ListRenderItem<ListItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.posterContainer}>
        {item.posterPath && buildPosterUrl(item.posterPath, 'w342') ? (
          <Image
            source={{ uri: buildPosterUrl(item.posterPath, 'w342')! }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Icon name="film-outline" size={28} color={COLORS.textSecondary} />
          </View>
        )}
      </View>

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {item.notes && (
          <Text style={styles.movieNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}

        <Text style={styles.addedDate}>
          Agregada el {formatDate(item.addedAt)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={(e) => {
          e.stopPropagation();
          confirmRemoveItem(item);
        }}
        disabled={removingItem === item.id}
      >
        {removingItem === item.id ? (
          <ActivityIndicator size="small" color={COLORS.accent} />
        ) : (
          <Icon name="close-circle" size={20} color={COLORS.accent} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="film-outline" size={80} color={COLORS.primary} />
      <Text style={styles.emptyTitle}>Lista vacía</Text>
      <Text style={styles.emptySubtitle}>
        Agrega películas para comenzar a construir tu lista
      </Text>
      <TouchableOpacity
        style={styles.addMoviesButton}
        onPress={handleAddMovies}
      >
        <Icon name="search" size={20} color={COLORS.background} />
        <Text style={styles.addMoviesText}>Buscar Películas</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Icon name="alert-circle-outline" size={64} color={COLORS.accent} />
      <Text style={styles.errorTitle}>Error al cargar la lista</Text>
      <Text style={styles.errorSubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refresh}>
        <Icon name="refresh" size={18} color={COLORS.text} />
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    if (!list) return null;

    return (
      <View style={styles.listHeader}>
        <View style={styles.listCover}>
          {list.cover.posterPath && buildPosterUrl(list.cover.posterPath, 'w342') ? (
            <Image
              source={{ uri: buildPosterUrl(list.cover.posterPath, 'w342')! }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Icon name="list-outline" size={32} color={COLORS.textSecondary} />
            </View>
          )}
        </View>

        <View style={styles.listInfo}>
          <Text style={styles.listTitle}>{list.title}</Text>
          
          {list.description && (
            <Text style={styles.listDescription}>{list.description}</Text>
          )}

          <View style={styles.listMeta}>
            <View style={styles.metaItem}>
              <Icon name="film" size={16} color={COLORS.primary} />
              <Text style={styles.metaText}>
                {list.itemsCount} {list.itemsCount === 1 ? 'película' : 'películas'}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Icon 
                name={list.isPublic ? 'globe' : 'lock-closed'} 
                size={14} 
                color={list.isPublic ? COLORS.success : COLORS.warning} 
              />
              <Text style={[
                styles.metaText,
                { color: list.isPublic ? COLORS.success : COLORS.warning }
              ]}>
                {list.isPublic ? 'Pública' : 'Privada'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddMovies}
          >
            <Icon name="add" size={18} color={COLORS.background} />
            <Text style={styles.addButtonText}>Agregar Películas</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !list) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando lista...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {list?.title || 'Lista'}
        </Text>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {
            // TODO: Implementar compartir lista
            Alert.alert('Próximamente', 'Compartir lista estará disponible pronto');
          }}
        >
          <Icon name="share-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {error ? (
          renderErrorState()
        ) : (
          <FlatList
            data={items}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={!loading ? renderEmptyState : null}
            contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.listContainer}
          />
        )}
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.surface,
    marginBottom: 8,
  },
  listCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    marginRight: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  listDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  listMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  posterContainer: {
    width: 60,
    height: 90,
    borderRadius: 6,
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
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  movieNotes: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  addedDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addMoviesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addMoviesText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.accent,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});