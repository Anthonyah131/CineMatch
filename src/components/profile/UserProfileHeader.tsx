import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { FavoriteItem } from '../../types/user.types';
import { COLORS } from '../../config/colors';

const { width } = Dimensions.get('window');
const BACKDROP_HEIGHT = 180;
const AVATAR_SIZE = 100;
const AVATAR_OVERLAP = AVATAR_SIZE / 2;

interface UserStats {
  totalMovies: number;
  totalShows: number;
  totalLogs: number;
  averageRating: number;
}

interface UserProfileHeaderProps {
  displayName: string;
  photoURL?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  stats: UserStats | null;
  favorites: FavoriteItem[];
  isFollowing: boolean;
  isTogglingFollow: boolean;
  onToggleFollow: () => void;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
  isOwnProfile?: boolean; // Nueva prop para ocultar el botón de follow
}

export default function UserProfileHeader({
  displayName,
  photoURL,
  bio,
  followersCount,
  followingCount,
  stats,
  favorites,
  isFollowing,
  isTogglingFollow,
  onToggleFollow,
  onFollowersPress,
  onFollowingPress,
  isOwnProfile = false,
}: UserProfileHeaderProps) {
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);

  const posterUrls = favorites
    .filter(fav => fav.posterPath)
    .map(fav => `https://image.tmdb.org/t/p/w780${fav.posterPath}`)
    .slice(0, 5);

  useEffect(() => {
    if (posterUrls.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPosterIndex(prev => (prev + 1) % posterUrls.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [posterUrls.length]);

  const currentPoster =
    posterUrls.length > 0 ? posterUrls[currentPosterIndex] : null;

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      {currentPoster ? (
        <ImageBackground
          source={{ uri: currentPoster }}
          style={styles.backdrop}
          blurRadius={8}
        >
          <View style={styles.backdropOverlay} />
        </ImageBackground>
      ) : (
        <View style={styles.backdropPlaceholder}>
          <View style={styles.backdropOverlay} />
        </View>
      )}

      {/* Avatar superpuesto */}
      <View style={styles.avatarContainer}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {displayName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Información del perfil */}
      <View style={styles.profileInfo}>
        <Text style={styles.displayName}>{displayName}</Text>
        {bio ? <Text style={styles.bio}>{bio}</Text> : null}

        <View style={styles.followRow}>
          <TouchableOpacity 
            style={styles.followItem}
            onPress={onFollowersPress}
            activeOpacity={0.7}
          >
            <Text style={styles.followCount}>{followersCount}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.followItem}
            onPress={onFollowingPress}
            activeOpacity={0.7}
          >
            <Text style={styles.followCount}>{followingCount}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Follow/Unfollow - solo si NO es nuestro propio perfil */}
        {!isOwnProfile && (
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing && styles.followingButton,
            ]}
            onPress={onToggleFollow}
            disabled={isTogglingFollow}
            activeOpacity={0.7}
          >
            {isTogglingFollow ? (
              <ActivityIndicator size="small" color={isFollowing ? COLORS.text : COLORS.background} />
            ) : (
              <>
                <Icon 
                  name={isFollowing ? 'person-remove-outline' : 'person-add-outline'} 
                  size={20} 
                  color={isFollowing ? COLORS.text : COLORS.background}
                />
                <Text style={[
                  styles.followButtonText,
                  isFollowing && styles.followingButtonText,
                ]}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Estadísticas */}
        {stats && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalLogs}</Text>
              <Text style={styles.statLabel}>Films</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
              </Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  backdrop: {
    width: width,
    height: BACKDROP_HEIGHT,
  },
  backdropPlaceholder: {
    width: width,
    height: BACKDROP_HEIGHT,
    backgroundColor: COLORS.surface,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 28, 0.7)',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -AVATAR_OVERLAP,
    marginBottom: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  profileInfo: {
    paddingHorizontal: 20,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  followRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 16,
  },
  followItem: {
    alignItems: 'center',
  },
  followCount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  followLabel: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
    marginTop: 4,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
    minWidth: 140,
  },
  followingButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  followingButtonText: {
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(242, 233, 228, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
    marginTop: 4,
  },
});
