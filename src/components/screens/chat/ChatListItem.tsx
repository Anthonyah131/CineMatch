import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { chatsService } from '../../../services/chatsService';
import type { ChatSummary } from '../../../types/chat.types';
import { COLORS } from '../../../config/colors';

interface ChatListItemProps {
  chat: ChatSummary;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  otherUserName?: string;
  otherUserPhoto?: string;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isSelected,
  onPress,
  onLongPress,
  otherUserName,
  otherUserPhoto,
}) => {
  const hasUnread = chat.unreadCount > 0;

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <View style={styles.selectionIndicator}>
          <Icon name="checkmark-circle" size={24} color={COLORS.primary} />
        </View>
      )}

      {/* User Photo */}
      {otherUserPhoto ? (
        <Image source={{ uri: otherUserPhoto }} style={styles.userPhoto} />
      ) : (
        <View style={[styles.userPhoto, styles.userPhotoPlaceholder]}>
          <Icon name="person" size={28} color="#C7A24C" />
        </View>
      )}

      {/* Chat Info */}
      <View style={styles.chatInfo}>
        <View style={styles.headerRow}>
          <Text style={[styles.userName, hasUnread && styles.userNameUnread]}>
            {otherUserName || 'Chat'}
          </Text>
          <Text style={[styles.time, hasUnread && styles.timeUnread]}>
            {chat.lastMessageAt
              ? chatsService.formatMessageTime(chat.lastMessageAt)
              : ''}
          </Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[styles.lastMessage, hasUnread && styles.lastMessageUnread]}
            numberOfLines={1}
          >
            {chat.lastMessage || 'Sin mensajes'}
          </Text>
          {hasUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  containerSelected: {
    backgroundColor: 'rgba(199, 162, 76, 0.1)',
  },
  selectionIndicator: {
    marginRight: 12,
  },
  userPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  userPhotoPlaceholder: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  userNameUnread: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timeUnread: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  lastMessageUnread: {
    color: COLORS.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.background,
  },
});
