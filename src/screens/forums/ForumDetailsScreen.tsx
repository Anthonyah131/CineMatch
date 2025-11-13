import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { PostCard } from '../../components/screens/forums/PostCard';
import { useForumDetails } from '../../hooks/forums/useForumDetails';
import { COLORS } from '../../config/colors';
import type { PostWithAuthor } from '../../types/forum.types';

interface ForumDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      forumId: string;
    };
  };
}

export const ForumDetailsScreen: React.FC<ForumDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { forumId } = route.params;
  const [newPostText, setNewPostText] = useState('');
  const [showPostInput, setShowPostInput] = useState(false);

  const {
    forum,
    posts,
    loading,
    error,
    refreshing,
    createPost,
    deletePost,
    addReaction,
    removeReaction,
    createComment,
    refreshForum,
  } = useForumDetails(forumId);

  const handleCreatePost = async () => {
    if (!newPostText.trim()) {
      Alert.alert('Error', 'El contenido del post no puede estar vacío');
      return;
    }

    const success = await createPost(newPostText.trim());
    if (success) {
      setNewPostText('');
      setShowPostInput(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deletePost(postId);
    if (!success && error) {
      Alert.alert('Error', error);
    }
  };

  const handleAddReaction = async (postId: string, emoji: string) => {
    const success = await addReaction(postId, emoji);
    if (!success && error) {
      Alert.alert('Error', error);
    }
  };

  const handleRemoveReaction = async (postId: string) => {
    const success = await removeReaction(postId);
    if (!success && error) {
      Alert.alert('Error', error);
    }
  };

  const handleCreateComment = async (postId: string, content: string): Promise<boolean> => {
    const success = await createComment(postId, content);
    if (!success && error) {
      Alert.alert('Error', error);
    }
    return success;
  };

  const renderHeader = () => {
    if (!forum) return null;

    return (
      <View style={styles.forumHeader}>
        <View style={styles.forumTitleContainer}>
          <Icon name="chatbubbles" size={32} color={COLORS.primary} />
          <View style={styles.forumInfo}>
            <Text style={styles.forumTitle}>{forum.title}</Text>
            <Text style={styles.forumDescription}>{forum.description}</Text>
          </View>
        </View>
        
        <View style={styles.forumStats}>
          <Text style={styles.statsText}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="chatbox-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No hay posts aún</Text>
      <Text style={styles.emptySubtitle}>
        Sé el primero en iniciar la conversación en este foro
      </Text>
      <TouchableOpacity
        style={styles.firstPostButton}
        onPress={() => setShowPostInput(true)}
      >
        <Text style={styles.firstPostButtonText}>Escribir primer post</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPostItem = ({ item }: { item: PostWithAuthor }) => (
    <PostCard
      post={item}
      onDeletePost={() => handleDeletePost(item.id)}
      onAddReaction={(emoji) => handleAddReaction(item.id, emoji)}
      onRemoveReaction={() => handleRemoveReaction(item.id)}
      onCreateComment={(content) => handleCreateComment(item.id, content)}
    />
  );

  const renderPostInput = () => {
    if (!showPostInput) return null;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.postInputContainer}
      >
        <View style={styles.postInput}>
          <TextInput
            style={styles.postTextInput}
            value={newPostText}
            onChangeText={setNewPostText}
            placeholder="¿Qué opinas sobre esto?"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={1000}
            textAlignVertical="top"
          />
          <View style={styles.postInputActions}>
            <TouchableOpacity
              style={styles.cancelPostButton}
              onPress={() => {
                setShowPostInput(false);
                setNewPostText('');
              }}
            >
              <Text style={styles.cancelPostButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.submitPostButton,
                !newPostText.trim() && styles.submitPostButtonDisabled
              ]}
              onPress={handleCreatePost}
              disabled={!newPostText.trim()}
            >
              <Text style={styles.submitPostButtonText}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando foro...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !forum) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="warning-outline" size={60} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshForum}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Text style={styles.screenTitle}>Foro</Text>
        
        <TouchableOpacity
          style={styles.addPostButton}
          onPress={() => setShowPostInput(true)}
        >
          <Icon name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={[
          styles.listContainer,
          posts.length === 0 && styles.emptyListContainer,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshForum}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {renderPostInput()}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  addPostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  forumHeader: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  forumTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  forumInfo: {
    flex: 1,
    marginLeft: 16,
  },
  forumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  forumDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  forumStats: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  statsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
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
  firstPostButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  firstPostButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  postInputContainer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  postInput: {
    padding: 16,
  },
  postTextInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  postInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelPostButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelPostButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  submitPostButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitPostButtonDisabled: {
    opacity: 0.5,
  },
  submitPostButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
  },
});