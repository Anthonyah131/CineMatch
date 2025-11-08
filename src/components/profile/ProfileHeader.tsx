import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import type { FavoriteItem } from '../../types/user.types';
import type { UserMediaStats } from '../../types/mediaLog.types';
import { COLORS } from '../../config/colors';

const { width } = Dimensions.get('window');
const BACKDROP_HEIGHT = 180;
const AVATAR_SIZE = 100;
const AVATAR_OVERLAP = AVATAR_SIZE / 2;

interface ProfileHeaderProps {
  displayName: string;
  photoURL?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  stats: UserMediaStats | null;
  favorites: FavoriteItem[];
}

export default function ProfileHeader({
  displayName,
  photoURL,
  bio,
  followersCount,
  followingCount,
  stats,
  favorites,
}: ProfileHeaderProps) {
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
          <View style={styles.followItem}>
            <Text style={styles.followCount}>{followersCount}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </View>
          <View style={styles.followItem}>
            <Text style={styles.followCount}>{followingCount}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {stats ? stats.totalMoviesWatched + stats.totalTvShowsWatched : 0}
          </Text>
          <Text style={styles.statLabel}>Total Films</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats ? stats.totalViews : 0}</Text>
          <Text style={styles.statLabel}>Film This Year</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Lists</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {stats ? stats.totalReviews : 0}
          </Text>
          <Text style={styles.statLabel}>Review</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    marginBottom: 20,
    backgroundColor: COLORS.background,
  },
  backdrop: {
    width: '100%',
    height: BACKDROP_HEIGHT,
  },
  backdropPlaceholder: {
    width: '100%',
    height: BACKDROP_HEIGHT,
    backgroundColor: COLORS.surface,
  },
  backdropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 11, 10, 0.5)',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -AVATAR_OVERLAP,
    zIndex: 10,
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
    backgroundColor: COLORS.surface,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  bio: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  followRow: {
    flexDirection: 'row',
    gap: 40,
    marginTop: 8,
  },
  followItem: {
    alignItems: 'center',
  },
  followCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  followLabel: {
    fontSize: 13,
    color: COLORS.text,
    opacity: 0.6,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: 20,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(199, 162, 76, 0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.text,
    opacity: 0.6,
  },
});
