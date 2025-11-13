import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActionSheetIOS,
  Platform,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useUserLists } from '../../hooks/lists/useUserLists';
import { ListCard, CreateListModal } from '../../components/screens/lists';
import type { List, CreateListDto } from '../../types/list.types';

interface ListsScreenProps {
  navigation: any;
}

export default function ListsScreen({ navigation }: ListsScreenProps) {
  const { lists, loading, error, refreshing, refresh, deleteList, createList } = useUserLists();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleListPress = (list: List) => {
    navigation.navigate('ListDetails', { listId: list.id });
  };

  const handleCreateList = async (listData: CreateListDto): Promise<boolean> => {
    const newList = await createList(listData);  // llama al hook

    if (newList) {
      Alert.alert('Éxito', 'Lista creada correctamente');
      
      // Si quieres, aquí puedes navegar a los detalles:
      // navigation.navigate('ListDetails', { listId: newList.id });

      return true; // el modal se cerrará porque CreateListModal hace handleClose() cuando success es true
    }

    Alert.alert('Error', 'No se pudo crear la lista');
    return false;
  };

  const showListOptions = (list: List) => {
    const options = [
      { text: 'Ver Lista', onPress: () => handleListPress(list) },
      { text: 'Editar', onPress: () => handleEditList(list) },
      { text: 'Eliminar', onPress: () => confirmDeleteList(list), isDestructive: true },
      { text: 'Cancelar', style: 'cancel' },
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: options.map(opt => opt.text),
          destructiveButtonIndex: 2,
          cancelButtonIndex: 3,
        },
        (buttonIndex) => {
          if (buttonIndex < options.length - 1) {
            options[buttonIndex].onPress?.();
          }
        }
      );
    } else {
      // Para Android, mostrar Alert con opciones
      Alert.alert(
        list.title,
        'Selecciona una opción',
        [
          { text: 'Ver Lista', onPress: () => handleListPress(list) },
          { text: 'Editar', onPress: () => handleEditList(list) },
          { text: 'Eliminar', onPress: () => confirmDeleteList(list), style: 'destructive' },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    }
  };

  const handleEditList = (list: List) => {
    // TODO: Implementar edición de listas
    Alert.alert('Próximamente', 'La edición de listas estará disponible pronto');
  };

  const confirmDeleteList = (list: List) => {
    Alert.alert(
      'Eliminar Lista',
      `¿Estás seguro de que quieres eliminar "${list.title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDeleteList(list.id),
        },
      ]
    );
  };

  const handleDeleteList = async (listId: string) => {
    const success = await deleteList(listId);
    if (success) {
      Alert.alert('Éxito', 'Lista eliminada correctamente');
    }
  };

  const renderListItem: ListRenderItem<List> = ({ item }) => (
    <ListCard
      list={item}
      onPress={handleListPress}
      onOptionsPress={showListOptions}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="list-outline" size={80} color={COLORS.primary} />
      <Text style={styles.emptyTitle}>No tienes listas</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primera lista para organizar tus películas favoritas
      </Text>
      <TouchableOpacity
        style={styles.createFirstListButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Icon name="add" size={20} color={COLORS.background} />
        <Text style={styles.createFirstListText}>Crear Mi Primera Lista</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Icon name="alert-circle-outline" size={64} color={COLORS.accent} />
      <Text style={styles.errorTitle}>Error al cargar listas</Text>
      <Text style={styles.errorSubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refresh}>
        <Icon name="refresh" size={18} color={COLORS.text} />
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Mis Listas</Text>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Icon name="add" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {error && !loading ? (
          renderErrorState()
        ) : (
          <FlatList
            data={lists}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            ListEmptyComponent={!loading ? renderEmptyState : null}
            contentContainerStyle={lists.length === 0 ? styles.emptyContainer : styles.listContainer}
          />
        )}
      </View>

      <CreateListModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreateList={handleCreateList}
      />
    </SafeAreaView>
  );
}

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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  addButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  createFirstListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createFirstListText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.accent,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});