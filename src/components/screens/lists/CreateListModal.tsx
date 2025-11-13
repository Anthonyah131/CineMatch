import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';
import type { CreateListDto } from '../../../types/list.types';

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateList: (listData: CreateListDto) => Promise<boolean>;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
  visible,
  onClose,
  onCreateList,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }

    setLoading(true);
    
    const listData: CreateListDto = {
      title: title.trim(),
      description: description.trim() || undefined,
      isPublic,
    };

    const success = await onCreateList(listData);
    
    if (success) {
      handleClose();
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setIsPublic(false);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
            disabled={loading}
          >
            <Icon name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Nueva Lista</Text>
          
          <TouchableOpacity 
            style={[
              styles.createButton,
              (!title.trim() || loading) && styles.createButtonDisabled
            ]} 
            onPress={handleCreate}
            disabled={!title.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.background} />
            ) : (
              <Text style={[
                styles.createButtonText,
                (!title.trim() || loading) && styles.createButtonTextDisabled
              ]}>
                Crear
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Nombre de la lista"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={100}
              editable={!loading}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción opcional de la lista"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
              editable={!loading}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.label}>Lista Pública</Text>
                <Text style={styles.switchDescription}>
                  {isPublic 
                    ? 'Otros usuarios pueden ver esta lista' 
                    : 'Solo tú puedes ver esta lista'
                  }
                </Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={isPublic ? COLORS.background : COLORS.textSecondary}
                disabled={loading}
              />
            </View>
          </View>

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>💡 Consejos</Text>
            <Text style={styles.tip}>• Elige un título descriptivo para tu lista</Text>
            <Text style={styles.tip}>• Las listas públicas pueden ser vistas por otros usuarios</Text>
            <Text style={styles.tip}>• Puedes cambiar la configuración más tarde</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  createButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tips: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
});