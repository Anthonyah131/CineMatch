import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import { buildPosterUrl } from '../../../utils/tmdbImageHelpers';
import type { List, ListWithOwner } from '../../../types/list.types';

interface ListCardProps {
  list: List | ListWithOwner;
  onPress: (list: List | ListWithOwner) => void;
  onOptionsPress?: (list: List | ListWithOwner) => void;
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onPress,
  onOptionsPress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(list)}
      activeOpacity={0.8}
    >
      <View style={styles.coverContainer}>
        {list.cover.posterPath && buildPosterUrl(list.cover.posterPath, 'w342') ? (
          <Image
            source={{ uri: buildPosterUrl(list.cover.posterPath, 'w342')! }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderCover}>
            <Icon name="list-outline" size={32} color={COLORS.textSecondary} />
          </View>
        )}

        {/* Indicador de privacidad */}
        <View style={[
          styles.privacyBadge,
          { backgroundColor: list.isPublic ? COLORS.success : COLORS.warning }
        ]}>
          <Icon 
            name={list.isPublic ? 'globe' : 'lock-closed'} 
            size={12} 
            color={COLORS.background} 
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {list.title}
          </Text>
          
          {onOptionsPress && (
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={(e) => {
                e.stopPropagation();
                onOptionsPress(list);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="ellipsis-vertical" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {list.description && (
          <Text style={styles.description} numberOfLines={2}>
            {list.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.stats}>
            <Icon name="film" size={14} color={COLORS.primary} />
            <Text style={styles.statsText}>
              {list.itemsCount} {list.itemsCount === 1 ? 'película' : 'películas'}
            </Text>
          </View>

          <Text style={styles.date}>
            {formatDate(list.updatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverContainer: {
    width: 80,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    marginRight: 12,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  privacyBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
    marginRight: 8,
  },
  optionsButton: {
    padding: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  date: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
});