import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import type { ModalConfig } from '../../../types/modal.types';

interface CustomModalProps {
  visible: boolean;
  config: ModalConfig | null;
  onClose: () => void;
}

const ICON_MAP = {
  success: { name: 'checkmark-circle', color: COLORS.success },
  error: { name: 'close-circle', color: COLORS.error },
  warning: { name: 'warning', color: COLORS.warning },
  info: { name: 'information-circle', color: COLORS.info },
  confirm: { name: 'help-circle', color: COLORS.primary },
};

export function CustomModal({ visible, config, onClose }: CustomModalProps) {
  if (!config) return null;

  const iconConfig = ICON_MAP[config.type];
  const dismissable = config.dismissable !== false;

  const handleBackdropPress = () => {
    if (dismissable) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismissable ? onClose : undefined}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Icon name={iconConfig.name} size={48} color={iconConfig.color} />
            </View>

            {/* Title */}
            <Text style={styles.title}>{config.title}</Text>

            {/* Message */}
            {config.message && (
              <Text style={styles.message}>{config.message}</Text>
            )}

            {/* Actions */}
            <View style={styles.actionsContainer}>
              {config.actions && config.actions.length > 0 ? (
                config.actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.actionButton,
                      action.style === 'primary' && styles.actionButtonPrimary,
                      action.style === 'destructive' &&
                        styles.actionButtonDestructive,
                    ]}
                    onPress={() => {
                      action.onPress();
                      onClose();
                    }}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        action.style === 'primary' && styles.actionTextPrimary,
                        action.style === 'destructive' &&
                          styles.actionTextDestructive,
                      ]}
                    >
                      {action.text}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={onClose}
                >
                  <Text style={[styles.actionText, styles.actionTextPrimary]}>
                    OK
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width - 48,
    maxWidth: 400,
  },
  content: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 24,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.text + '20',
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actionButtonDestructive: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  actionTextPrimary: {
    color: COLORS.background,
  },
  actionTextDestructive: {
    color: COLORS.text,
  },
});
