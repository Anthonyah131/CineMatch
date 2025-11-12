import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import type { User } from '../../../types/user.types';

interface UserSearchResultsProps {
  users: User[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  onUserPress: (user: User) => void;
  onRetry: () => void;
}

export const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  users,
  loading,
  error,
  hasSearched,
  onUserPress,
  onRetry,
}) => {
  const renderUserItem: ListRenderItem<User> = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => onUserPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        {item.photoURL ? (
          <Image
            source={{ uri: item.photoURL }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>
              {getInitials(item.displayName)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.displayName} numberOfLines={1}>
          {item.displayName}
        </Text>
        
        {item.email && (
          <Text style={styles.email} numberOfLines={1}>
            {item.email}
          </Text>
        )}
        
        {item.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Icon name="heart" size={12} color={COLORS.accent} />
            <Text style={styles.statText}>
              {item.favorites?.length || 0}
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Icon name="people" size={12} color={COLORS.primary} />
            <Text style={styles.statText}>
              {item.followersCount || 0}
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Icon name="person-add" size={12} color={COLORS.success} />
            <Text style={styles.statText}>
              {item.followingCount || 0}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chevronContainer}>
        <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Icon name="people-outline" size={64} color={COLORS.primary} />
          <Text style={styles.emptyTitle}>Busca perfiles de usuarios</Text>
          <Text style={styles.emptySubtitle}>
            Escribe un nombre de usuario para comenzar
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorState}>
          <Icon name="alert-circle-outline" size={64} color={COLORS.accent} />
          <Text style={styles.errorTitle}>Error en la búsqueda</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Icon name="refresh" size={20} color={COLORS.text} />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (users.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="person-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No se encontraron usuarios</Text>
          <Text style={styles.emptySubtitle}>
            Intenta con otro término de búsqueda
          </Text>
        </View>
      );
    }

    return null;
  };

  if (users.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
      />
    </View>
  );
};

// Helper function to get initials
const getInitials = (displayName: string): string => {
  return displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.background,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 2,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  username: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  bio: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chevronContainer: {
    justifyContent: 'center',
    marginLeft: 12,
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
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    gap: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.accent,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});