import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import { forumsService } from '../../../services/forumsService';
import { useAuth } from '../../../context/AuthContext';
import type { PostWithAuthor } from '../../../types/forum.types';

interface PostCardProps {
  post: PostWithAuthor;
  onDeletePost: () => void;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: () => void;
  onCreateComment: (content: string) => Promise<boolean>;
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onDeletePost,
  onAddReaction,
  onRemoveReaction,
  onCreateComment,
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuth();

  const isMyPost = user?.id === post.authorId;
  const myReaction = forumsService.getMyReaction(post.reactions, user?.id || '');
  const reactionsCount = forumsService.countReactions(post.reactions);
  const formattedDate = forumsService.formatTimestamp(post.createdAt);

  const handleDeletePress = () => {
    Alert.alert(
      'Eliminar post',
      '¿Estás seguro de que quieres eliminar este post?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onDeletePost },
      ]
    );
  };

  const handleReactionPress = (emoji: string) => {
    setShowReactions(false);
    if (myReaction === emoji) {
      onRemoveReaction();
    } else {
      onAddReaction(emoji);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    const success = await onCreateComment(commentText.trim());
    if (success) {
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ 
            uri: post.authorPhotoURL || 'https://i.pravatar.cc/150?img=12' 
          }}
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>
            {post.authorDisplayName}
          </Text>
          <Text style={styles.timestamp}>{formattedDate}</Text>
        </View>

        {isMyPost && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePress}
          >
            <Icon name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          {/* Reactions */}
          <TouchableOpacity
            style={[styles.actionButton, myReaction && styles.reactionActive]}
            onPress={() => setShowReactions(!showReactions)}
          >
            <Icon 
              name={myReaction ? "heart" : "heart-outline"} 
              size={18} 
              color={myReaction ? COLORS.accent : COLORS.textSecondary} 
            />
            {reactionsCount > 0 && (
              <Text style={[
                styles.actionText,
                myReaction && styles.reactionActiveText
              ]}>
                {reactionsCount}
              </Text>
            )}
          </TouchableOpacity>

          {/* Comments */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowCommentInput(!showCommentInput)}
          >
            <Icon name="chatbox-outline" size={18} color={COLORS.textSecondary} />
            {post.commentsCount > 0 && (
              <Text style={styles.actionText}>{post.commentsCount}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Reaction Picker */}
      {showReactions && (
        <View style={styles.reactionPicker}>
          {REACTION_EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.reactionButton,
                myReaction === emoji && styles.selectedReaction
              ]}
              onPress={() => handleReactionPress(emoji)}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Comment Input */}
      {showCommentInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.commentInput}>
            <TextInput
              style={styles.commentTextInput}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Escribe un comentario..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.commentSubmitButton,
                !commentText.trim() && styles.commentSubmitDisabled
              ]}
              onPress={handleSubmitComment}
              disabled={!commentText.trim()}
            >
              <Icon 
                name="send" 
                size={16} 
                color={commentText.trim() ? COLORS.primary : COLORS.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  reactionActive: {
    backgroundColor: COLORS.background,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  reactionActiveText: {
    color: COLORS.accent,
  },
  reactionPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
  },
  reactionButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 4,
  },
  selectedReaction: {
    backgroundColor: COLORS.background,
  },
  reactionEmoji: {
    fontSize: 20,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
    paddingTop: 8,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
    color: COLORS.text,
    maxHeight: 80,
  },
  commentSubmitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSubmitDisabled: {
    opacity: 0.5,
  },
});