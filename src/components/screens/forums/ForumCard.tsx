import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import { forumsService } from '../../../services/forumsService';
import type { Forum, ForumSummary } from '../../../types/forum.types';

interface ForumCardProps {
  forum: Forum | ForumSummary;
  onPress: () => void;
  showOwner?: boolean;
}

export const ForumCard: React.FC<ForumCardProps> = ({
  forum,
  onPress,
  showOwner = true,
}) => {
  const isForumSummary = 'postsCount' in forum;
  const postsCount = isForumSummary ? forum.postsCount : 0;
  const ownerName = isForumSummary ? forum.ownerDisplayName : '';
  const lastPostAt = isForumSummary && forum.lastPostAt 
    ? forumsService.formatTimestamp(forum.lastPostAt)
    : null;

  const createdAt = isForumSummary 
    ? forumsService.formatTimestamp((forum as any).createdAt || new Date().toISOString())
    : forumsService.formatTimestamp(forum.createdAt);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="chatbubbles-outline" size={24} color={COLORS.primary} />
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {forum.title}
          </Text>
          {showOwner && ownerName && (
            <Text style={styles.owner}>
              por {ownerName}
            </Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Icon name="chatbox-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.statText}>{postsCount}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {forum.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          Creado {createdAt}
        </Text>
        {lastPostAt && (
          <Text style={styles.lastActivity}>
            Último post {lastPostAt}
          </Text>
        )}
      </View>
    </TouchableOpacity>
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  owner: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  lastActivity: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});