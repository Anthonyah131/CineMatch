import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { matchesService } from '../../services/matchesService';
import { mediaCacheService } from '../../services/mediaCacheService';
import type { PotentialMatch } from '../../types/match.types';
import { COLORS } from '../../config/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // 16px margin on each side

interface MatchCardProps {
  match: PotentialMatch;
  onChatPress: (userId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onChatPress }) => {
  const [movieTitle, setMovieTitle] = useState(match.movieTitle || 'Película');
  const [posterPath, setPosterPath] = useState(match.moviePosterPath || '');

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const response = await mediaCacheService.getMovie(match.movieId);
        if (response.data) {
          setMovieTitle(response.data.title || 'Película');
          setPosterPath(response.data.posterPath || '');
        }
      } catch (error) {
        console.error('Error loading movie data:', error);
      }
    };

    loadMovieData();
  }, [match.movieId]);

  const posterUrl = matchesService.buildPosterUrl(posterPath);
  const timeAgo = matchesService.formatDaysAgo(match.daysAgo);

  return (
    <View style={styles.card}>
      {/* Movie Poster */}
      <Image
        source={{ uri: posterUrl }}
        style={styles.poster}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        {/* User Info */}
        <View style={styles.userRow}>
          {match.photoURL ? (
            <Image
              source={{ uri: match.photoURL }}
              style={styles.userPhoto}
            />
          ) : (
            <View style={[styles.userPhoto, styles.userPhotoPlaceholder]}>
              <Icon name="person" size={24} color={COLORS.primary} />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{match.displayName || 'Usuario'}</Text>
            <Text style={styles.matchInfo}>Vio la misma película</Text>
          </View>
        </View>

        {/* Movie Info */}
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movieTitle}
          </Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>

        {/* Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => onChatPress(match.userId)}
        >
          <Icon name="chatbubble-outline" size={18} color="#FFF" />
          <Text style={styles.chatButtonText}>Iniciar Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  poster: {
    width: 100,
    height: 150,
    backgroundColor: COLORS.border,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userPhotoPlaceholder: {
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  matchInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  movieInfo: {
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 6,
  },
});
