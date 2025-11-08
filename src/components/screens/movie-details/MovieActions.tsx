import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const COLORS = {
  background: '#0F0B0A',
  surface: '#1A1412',
  primary: '#C7A24C',
  accent: '#E69CA3',
  text: '#F2E9E4',
};

interface MovieActionsProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToWatchlist?: () => void;
  onShare?: () => void;
  onWriteReview?: () => void;
}

export function MovieActions({
  isFavorite,
  onToggleFavorite,
  onAddToWatchlist,
  onShare,
  onWriteReview,
}: MovieActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onToggleFavorite}>
        <Icon
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          color={isFavorite ? COLORS.accent : COLORS.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onAddToWatchlist}>
        <Icon name="bookmark-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onWriteReview}>
        <Icon name="create-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onShare}>
        <Icon name="share-social-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});
