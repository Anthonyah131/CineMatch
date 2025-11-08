import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useAuth } from '../../context/AuthContext';
import { useChats } from '../../hooks/chats/useChats';
import { usersService } from '../../services/usersService';
import { ChatListItem } from '../../components/screens/chat/ChatListItem';
import { useModal } from '../../context/ModalContext';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppTabsParamList } from '../../navigation/tabs/AppTabs';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import type { ChatSummary } from '../../types/chat.types';

type ChatsListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabsParamList, 'ChatsTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface ChatWithUserInfo extends ChatSummary {
  otherUserName?: string;
  otherUserPhoto?: string;
}

export const ChatsListScreen: React.FC<ChatsListScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { chats, isLoading, error, refresh, deleteChats } = useChats();
  const { showModal } = useModal();
  const [chatsWithUserInfo, setChatsWithUserInfo] = useState<ChatWithUserInfo[]>([]);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const isSelectionMode = selectedChats.size > 0;

  // Cargar información de usuarios cuando cambian los chats
  useEffect(() => {
    const loadUserProfiles = async () => {
      if (!user || !chats.length) {
        setChatsWithUserInfo(chats);
        return;
      }

      try {
        const chatsWithInfo = await Promise.all(
          chats.map(async (chat) => {
            // Obtener el ID del otro usuario (el que NO soy yo)
            const otherUserId = chat.members.find(memberId => memberId !== user.id);
            
            if (!otherUserId) {
              return { ...chat };
            }

            try {
              const profile = await usersService.getUserProfile(otherUserId);
              return {
                ...chat,
                otherUserName: profile.user.displayName,
                otherUserPhoto: profile.user.photoURL,
              };
            } catch (err) {
              console.error(`Error loading profile for user ${otherUserId}:`, err);
              return { ...chat };
            }
          })
        );

        setChatsWithUserInfo(chatsWithInfo);
      } catch (err) {
        console.error('Error loading user profiles:', err);
        setChatsWithUserInfo(chats);
      }
    };

    loadUserProfiles();
  }, [chats, user]);

  const handleChatPress = (chatId: string) => {
    if (isSelectionMode) {
      // Modo selección: agregar/quitar de seleccionados
      setSelectedChats((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(chatId)) {
          newSet.delete(chatId);
        } else {
          newSet.add(chatId);
        }
        return newSet;
      });
    } else {
      // Modo normal: abrir chat
      navigation.navigate('Chat', { chatId });
    }
  };

  const handleChatLongPress = (chatId: string) => {
    // Iniciar modo selección
    setSelectedChats(new Set([chatId]));
  };

  const handleCancelSelection = () => {
    setSelectedChats(new Set());
  };

  const handleDeleteSelected = () => {
    showModal({
      type: 'confirm',
      title: 'Eliminar Chats',
      message: `¿Estás seguro de que quieres eliminar ${selectedChats.size} chat${selectedChats.size > 1 ? 's' : ''}?`,
      actions: [
        {
          text: 'Cancelar',
          style: 'default',
          onPress: () => {},
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteChats(Array.from(selectedChats));
              setSelectedChats(new Set());
            } catch (err) {
              console.error('Error deleting chats:', err);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    });
  };

  // Loading State
  if (isLoading && chats.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mensajes</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C7A24C" />
          <Text style={styles.loadingText}>Cargando chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mensajes</Text>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color="#FF453A" />
          <Text style={styles.errorText}>Error al cargar chats</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Icon name="refresh-outline" size={20} color="#FFF" />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Empty State
  if (chats.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mensajes</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="chatbubbles-outline" size={64} color="#8E8E93" />
          <Text style={styles.emptyText}>No tienes conversaciones</Text>
          <Text style={styles.emptySubtext}>
            Encuentra personas con tus mismos gustos en Matches
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Chats List
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {isSelectionMode ? (
          <>
            <TouchableOpacity onPress={handleCancelSelection} style={styles.backButton}>
              <Icon name="close" size={24} color="#C7A24C" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {selectedChats.size} seleccionado{selectedChats.size > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity
              onPress={handleDeleteSelected}
              style={styles.deleteButton}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FF453A" />
              ) : (
                <Icon name="trash-outline" size={24} color="#FF453A" />
              )}
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.headerTitle}>Mensajes</Text>
        )}
      </View>

      {/* Chats List */}
      <FlatList
        data={chatsWithUserInfo}
        keyExtractor={(item) => item.chatId}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            isSelected={selectedChats.has(item.chatId)}
            onPress={() => handleChatPress(item.chatId)}
            onLongPress={() => handleChatLongPress(item.chatId)}
            otherUserName={item.otherUserName}
            otherUserPhoto={item.otherUserPhoto}
          />
        )}
        onRefresh={refresh}
        refreshing={isLoading}
      />
    </SafeAreaView>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  errorButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  backButtonError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
