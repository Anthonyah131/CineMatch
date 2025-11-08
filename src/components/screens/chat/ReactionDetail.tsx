import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import type { MessageWithSender } from '../../../types/chat.types';

interface ReactionDetailProps {
  visible: boolean;
  message: MessageWithSender | null;
  currentUserId: string;
  onClose: () => void;
  onRemoveReaction: () => void;
}

export const ReactionDetail: React.FC<ReactionDetailProps> = ({
  visible,
  message,
  currentUserId,
  onClose,
  onRemoveReaction,
}) => {
  if (!message || !message.reactions || Object.keys(message.reactions).length === 0) {
    return null;
  }

  const reactionItems = Object.entries(message.reactions).map(([userId, emoji]) => ({
    emoji,
    userId,
    isOwn: userId === currentUserId,
  }));

  const renderItem = ({ item }: { item: typeof reactionItems[0] }) => (
    <View style={[
      styles.reactionRow,
      item.isOwn && styles.reactionRowOwn
    ]}>
      <View style={styles.reactionInfo}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={[styles.userId, item.isOwn && styles.userIdOwn]}>
          {item.isOwn ? 'Tú' : 'Usuario'}
        </Text>
      </View>
      {item.isOwn && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            onRemoveReaction();
            onClose();
          }}
        >
          <Icon name="trash-outline" size={18} color="#FF453A" />
          <Text style={styles.removeText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View 
          style={styles.container}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Reacciones</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={reactionItems}
            keyExtractor={(item, index) => `${item.emoji}-${item.userId}-${index}`}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay reacciones</Text>
              </View>
            }
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    maxHeight: '50%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 8,
  },
  reactionRowOwn: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  reactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
  userId: {
    fontSize: 16,
    color: COLORS.text,
  },
  userIdOwn: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    borderRadius: 8,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
