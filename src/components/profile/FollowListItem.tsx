import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../config/colors';
import type { FollowerWithInfo, FollowingWithInfo } from '../../types/user.types';

interface FollowListItemProps {
  user: FollowerWithInfo | FollowingWithInfo;
  onPress: (userId: string) => void;
}

export default function FollowListItem({ user, onPress }: FollowListItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(user.uid)}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: user.photoURL || 'https://i.pravatar.cc/150?img=12',
        }}
        style={styles.avatar}
      />
      
      <View style={styles.userInfo}>
        <Text style={styles.displayName} numberOfLines={1}>
          {user.displayName}
        </Text>
        {user.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 233, 228, 0.1)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: COLORS.background,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    lineHeight: 18,
  },
});
