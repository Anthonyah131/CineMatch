import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';

interface EmptyDiaryProps {
  message?: string;
}

export default function EmptyDiary({
  message = "You haven't logged any movies or shows yet",
}: EmptyDiaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="book-outline" size={64} color={COLORS.textSecondary} />
      </View>
      <Text style={styles.title}>No Entries Yet</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.hint}>
        Start watching and logging your favorite content!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
