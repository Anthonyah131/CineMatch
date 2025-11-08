import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { chatsService } from '../../../services/chatsService';
import type { MessageWithSender } from '../../../types/chat.types';
import { COLORS } from '../../../config/colors';

interface MessageBubbleProps {
  message: MessageWithSender;
  isOwn: boolean;
  onLongPress: () => void;
  onReactionPress?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  onLongPress,
  onReactionPress,
}) => {
  const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;

  return (
    <View style={[styles.container, isOwn ? styles.containerOwn : styles.containerOther]}>
      <TouchableOpacity
        style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, isOwn ? styles.textOwn : styles.textOther]}>
          {message.text}
        </Text>
        <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>
          {chatsService.formatMessageTime(message.createdAt)}
        </Text>
      </TouchableOpacity>

      {/* Reactions */}
      {hasReactions && (
        <TouchableOpacity
          style={[styles.reactions, isOwn ? styles.reactionsOwn : styles.reactionsOther]}
          onPress={onReactionPress}
          activeOpacity={0.7}
        >
          {/* Agrupar por emoji y contar */}
          {Object.entries(
            Object.values(message.reactions!).reduce((acc, emoji) => {
              acc[emoji] = (acc[emoji] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([emoji, count]) => (
            <View key={emoji} style={styles.reactionItem}>
              <Text style={styles.reactionEmoji}>{emoji}</Text>
              {count > 1 && (
                <Text style={styles.reactionCount}>{count}</Text>
              )}
            </View>
          ))}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  containerOwn: {
    alignItems: 'flex-end',
  },
  containerOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bubbleOwn: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 2,
  },
  textOwn: {
    color: COLORS.background,
  },
  textOther: {
    color: COLORS.text,
  },
  time: {
    fontSize: 11,
    marginTop: 2,
  },
  timeOwn: {
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'right',
  },
  timeOther: {
    color: COLORS.textSecondary,
    textAlign: 'left',
  },
  reactions: {
    flexDirection: 'row',
    marginTop: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reactionsOwn: {
    alignSelf: 'flex-end',
  },
  reactionsOther: {
    alignSelf: 'flex-start',
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 2,
    fontWeight: '600',
  },
});
