import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../../config/colors';

const { width } = Dimensions.get('window');

// Emojis ordenados por uso esperado (más usados a la izquierda)
const EMOJIS = ['😂', '❤️', '🔥', '😎', '🍿', '🎞️', '😭', '🧐', '😱', '😨', '💩', '🚬'];

interface ReactionPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  visible,
  onClose,
  onSelectEmoji,
}) => {
  const handleSelect = (emoji: string) => {
    onSelectEmoji(emoji);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Reacciona al mensaje</Text>
          <View style={styles.emojiGrid}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiButton}
                onPress={() => handleSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    width: width - 64,
    maxWidth: 320,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
});
