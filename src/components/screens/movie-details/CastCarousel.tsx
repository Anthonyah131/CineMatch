import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import type { TmdbCastMember } from '../../../types/tmdb.types';
import { buildProfileUrl } from '../../../utils/tmdbImageHelpers';

const COLORS = {
  background: '#0F0B0A',
  surface: '#1A1412',
  primary: '#C7A24C',
  accent: '#A4252C',
  text: '#F2E9E4',
};

interface CastCarouselProps {
  cast: TmdbCastMember[];
}

export function CastCarousel({ cast }: CastCarouselProps) {
  if (!cast || cast.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay información de reparto</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cast.map(member => (
          <View key={member.id} style={styles.castItem}>
            <Image
              source={{
                uri:
                  buildProfileUrl(member.profile_path, 'w185') ||
                  'https://via.placeholder.com/185x278/1A1412/F2E9E4?text=No+Photo',
              }}
              style={styles.castImage}
            />
            <Text style={styles.castName} numberOfLines={1}>
              {member.name}
            </Text>
            <Text style={styles.castCharacter} numberOfLines={1}>
              {member.character}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  castItem: {
    width: 100,
    alignItems: 'center',
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  castName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    width: '100%',
  },
  castCharacter: {
    fontSize: 10,
    color: COLORS.text,
    opacity: 0.6,
    textAlign: 'center',
    width: '100%',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.text,
    opacity: 0.6,
    fontSize: 14,
  },
});
