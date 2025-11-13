import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  ListRenderItem,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import { buildPosterUrl } from '../../../utils/tmdbImageHelpers';
import { useAddToList } from '../../../hooks/lists/useAddToList';
import type { List } from '../../../types/list.types';
import type { TmdbMovieDetails } from '../../../types/tmdb.types';

interface AddToListModalProps {
  visible: boolean;
  movie: TmdbMovieDetails | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddToListModal: React.FC<AddToListModalProps> = ({
  visible,
  movie,
  onClose,
  onSuccess,
}) => {
  const { userLists, loading, error, addToList, loadUserLists } = useAddToList();
  const [addingToList, setAddingToList] = useState<string | null>(null);

  useEffect(() => {
    if (visible && movie) {
      loadUserLists();
    }
  }, [visible, movie, loadUserLists]);

  const handleAddToList = async (list: List) => {
    if (!movie) return;

    setAddingToList(list.id);
    
    const success = await addToList(list.id, movie);
    
    if (success) {
      Alert.alert(
        'Éxito',
        `"${movie.title}" se agregó a "${list.title}"`,
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess?.();
              onClose();
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', 'No se pudo agregar la película a la lista');
    }
    
    setAddingToList(null);
  };

  const renderListItem: ListRenderItem<List> = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleAddToList(item)}
      disabled={addingToList !== null}
      activeOpacity={0.8}
    >
      <View style={styles.listCover}>
        {item.cover.posterPath && buildPosterUrl(item.cover.posterPath, 'w154') ? (
          <Image
            source={{ uri: buildPosterUrl(item.cover.posterPath, 'w154')! }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderCover}>
            <Icon name="list-outline" size={20} color={COLORS.textSecondary} />
          </View>
        )}
      </View>

      <View style={styles.listInfo}>
        <Text style={styles.listTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.listStats}>
          {item.itemsCount} {item.itemsCount === 1 ? 'película' : 'películas'}
        </Text>

        <View style={styles.privacyContainer}>
          <Icon 
            name={item.isPublic ? 'globe' : 'lock-closed'} 
            size={12} 
            color={item.isPublic ? COLORS.success : COLORS.warning} 
          />
          <Text style={[
            styles.privacyText,
            { color: item.isPublic ? COLORS.success : COLORS.warning }
          ]}>
            {item.isPublic ? 'Pública' : 'Privada'}
          </Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {addingToList === item.id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Icon name="add-circle" size={24} color={COLORS.primary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="list-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No tienes listas</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primera lista para guardar películas
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Agregar a Lista</Text>
          
          <View style={styles.placeholder} />
        </View>

        {movie && (
          <View style={styles.movieInfo}>
            <View style={styles.moviePoster}>
              {movie.poster_path && buildPosterUrl(movie.poster_path, 'w154') ? (
                <Image
                  source={{ uri: buildPosterUrl(movie.poster_path, 'w154')! }}
                  style={styles.posterImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderPoster}>
                  <Icon name="film-outline" size={24} color={COLORS.textSecondary} />
                </View>
              )}
            </View>
            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.title}
              </Text>
              {movie.release_date && (
                <Text style={styles.movieYear}>
                  {new Date(movie.release_date).getFullYear()}
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Cargando listas...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={48} color={COLORS.accent} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadUserLists}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={userLists}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
              contentContainerStyle={userLists.length === 0 ? styles.emptyContainer : undefined}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

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
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  movieInfo: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.surface,
    marginBottom: 8,
  },
  moviePoster: {
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
  placeholderPoster: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
  },
  listCover: {
    width: 40,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    marginRight: 12,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
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
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  listStats: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  privacyText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionContainer: {
    marginLeft: 12,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
});