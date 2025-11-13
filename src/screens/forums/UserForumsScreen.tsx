import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { ForumCard } from '../../components/screens/forums/ForumCard';
import { CreateForumModal } from '../../components/screens/forums/CreateForumModal';
import { useUserForums } from '../../hooks/forums/useUserForums';
import { COLORS } from '../../config/colors';
import type { ForumSummary } from '../../types/forum.types';

interface UserForumsScreenProps {
  navigation: any;
}

export const UserForumsScreen: React.FC<UserForumsScreenProps> = ({
  navigation,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    forums,
    loading,
    error,
    refreshing,
    createForum,
    deleteForum,
    refreshForums,
  } = useUserForums();

  const handleCreateForum = async (title: string, description: string): Promise<boolean> => {
    const success = await createForum(title, description);
    if (success) {
      setShowCreateModal(false);
    }
    return success;
  };

  const handleForumPress = (forum: ForumSummary) => {
    navigation.navigate('ForumDetails', { forumId: forum.forumId });
  };

  const handleDeleteForum = (forum: ForumSummary) => {
    Alert.alert(
      'Eliminar foro',
      `¿Estás seguro de que quieres eliminar "${forum.title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteForum(forum.forumId),
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="chatbubbles-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No tienes foros aún</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primer foro para discutir temas de películas con otros usuarios
      </Text>
      <TouchableOpacity
        style={styles.createFirstButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.createFirstButtonText}>Crear mi primer foro</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Icon name="warning-outline" size={60} color={COLORS.error} />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={refreshForums}
      >
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Mis Foros</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Icon name="add" size={24} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );

  const renderForumItem = ({ item }: { item: ForumSummary }) => (
    <View>
      <ForumCard
        forum={item}
        onPress={() => handleForumPress(item)}
        showOwner={false}
      />
      
      {/* Botón de opciones para el foro */}
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => handleDeleteForum(item)}
      >
        <Icon name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando tus foros...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      {error && !refreshing ? (
        renderErrorState()
      ) : (
        <FlatList
          data={forums}
          keyExtractor={(item) => item.forumId}
          renderItem={renderForumItem}
          contentContainerStyle={[
            styles.listContainer,
            forums.length === 0 && styles.emptyListContainer,
          ]}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshForums}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <CreateForumModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateForum={handleCreateForum}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  optionsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 16,
    backgroundColor: COLORS.background,
  },
});