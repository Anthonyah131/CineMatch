import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListCard } from '../lists/ListCard';
import { COLORS } from '../../../config/colors';
import type { ListWithOwner } from '../../../types/list.types';

interface ListSearchResultsProps {
  lists: ListWithOwner[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  onListPress: (list: ListWithOwner) => void;
}

export const ListSearchResults: React.FC<ListSearchResultsProps> = ({
  lists,
  loading,
  error,
  hasSearched,
  onListPress,
}) => {
  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={64} color={COLORS.primary} />
          <Text style={styles.emptyTitle}>Busca listas públicas</Text>
          <Text style={styles.emptySubtitle}>
            Escribe el nombre de una lista para comenzar
          </Text>
        </View>
      );
    }

    if (lists.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="list-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No se encontraron listas</Text>
          <Text style={styles.emptySubtitle}>
            Intenta con otros términos de búsqueda
          </Text>
        </View>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Buscando listas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle-outline" size={64} color={COLORS.accent} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (lists.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <ListCard
              list={item}
              onPress={() => onListPress(item)}
            />
            <View style={styles.ownerInfo}>
              <Icon name="person-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.ownerText}>
                por {item.ownerDisplayName}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    lineHeight: 24,
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
  listContainer: {
    paddingBottom: 20,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 16,
  },
  ownerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  separator: {
    height: 16,
  },
});