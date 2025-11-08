import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../config/colors';

const MAX_OVERVIEW_LENGTH = 150;

interface MovieInfoProps {
  title: string;
  director?: string;
  releaseDate: string;
  runtime: number | null;
  tagline: string | null;
  overview: string;
}

export function MovieInfo({
  title,
  director,
  releaseDate,
  runtime,
  tagline,
  overview,
}: MovieInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const runtimeFormatted = runtime ? `${runtime} min` : 'N/A';

  const shouldTruncate = overview.length > MAX_OVERVIEW_LENGTH;
  const displayedOverview =
    expanded || !shouldTruncate
      ? overview
      : overview.slice(0, MAX_OVERVIEW_LENGTH) + '...';

  return (
    <View style={styles.container}>
      {/* Título y meta info */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>{title}</Text>
        {director && (
          <Text style={styles.director}>
            Directed by <Text style={styles.directorName}>{director}</Text>
          </Text>
        )}
        <Text style={styles.meta}>
          {year} · {runtimeFormatted}
        </Text>
      </View>

      {/* Tagline */}
      {tagline && <Text style={styles.tagline}>{tagline}</Text>}

      {/* Overview */}
      <View>
        <Text style={styles.overview}>{displayedOverview}</Text>
        {shouldTruncate && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMoreButton}>
              {expanded ? 'Ver menos' : 'Ver más'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 24,
  },
  director: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 2,
  },
  directorName: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },
  tagline: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 8,
    lineHeight: 18,
  },
  overview: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    opacity: 0.9,
  },
  readMoreButton: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
