import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ForumCard } from '../forums/ForumCard';
import { COLORS } from '../../../config/colors';
import type { ForumSummary } from '../../../types/forum.types';

interface ForumSearchResultsProps {
  forums: ForumSummary[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  onForumPress: (forum: ForumSummary) => void;
}

export const ForumSearchResults: React.FC<ForumSearchResultsProps> = ({
  forums,
  loading,
  error,
  hasSearched,
  onForumPress,
}) => {
  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={64} color={COLORS.primary} />
          <Text style={styles.emptyTitle}>Busca foros de discusión</Text>
          <Text style={styles.emptySubtitle}>
            Escribe el nombre de un foro o tema para comenzar
          </Text>
        </View>
      );
    }

    if (forums.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="chatbubble-ellipses-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No se encontraron foros</Text>
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
        <Text style={styles.loadingText}>Buscando foros...</Text>
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

  if (forums.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={forums}
        keyExtractor={(item) => item.forumId}
        renderItem={({ item }) => (
          <ForumCard
            forum={item}
            onPress={() => onForumPress(item)}
            showOwner={true}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
});