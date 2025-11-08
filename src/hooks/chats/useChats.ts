import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { chatsService } from '../../services/chatsService';
import type { ChatSummary } from '../../types/chat.types';

interface UseChatsReturn {
  chats: ChatSummary[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deleteChats: (chatIds: string[]) => Promise<void>;
}

export const useChats = (): UseChatsReturn => {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChats = async () => {
    try {
      setError(null);
      const data = await chatsService.getMyChats(50);
      setChats(data);
    } catch (err) {
      console.error('Error loading chats:', err);
      setError(
        err instanceof Error ? err.message : 'Error al cargar los chats'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    setIsLoading(true);
    await loadChats();
  };

  const deleteChats = async (chatIds: string[]) => {
    try {
      // Eliminar chats en paralelo
      await Promise.all(chatIds.map(id => chatsService.deleteChat(id)));
      
      // Actualizar estado local removiendo los chats eliminados
      setChats(prevChats => prevChats.filter(chat => !chatIds.includes(chat.chatId)));
    } catch (err) {
      console.error('Error deleting chats:', err);
      throw err;
    }
  };

  // Cargar chats iniciales
  useEffect(() => {
    loadChats();
  }, []);

  // Listener en tiempo real para chats del usuario
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = firestore()
      .collection('chats')
      .where('members', 'array-contains', user.id)
      .orderBy('lastMessageAt', 'desc')
      .limit(50)
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const chatData = change.doc.data();
            const chatSummary: ChatSummary = {
              chatId: change.doc.id,
              members: chatData.members || [],
              lastMessage: chatData.lastMessage || null,
              lastMessageAt: chatData.lastMessageAt?.toDate?.() || null,
              unreadCount: chatData.unreadCount?.[user.id] || 0,
            };

            if (change.type === 'added') {
              setChats((prevChats) => {
                const exists = prevChats.some(chat => chat.chatId === chatSummary.chatId);
                if (exists) return prevChats;
                return [chatSummary, ...prevChats];
              });
            }

            if (change.type === 'modified') {
              setChats((prevChats) =>
                prevChats.map(chat =>
                  chat.chatId === chatSummary.chatId ? chatSummary : chat
                )
              );
            }

            if (change.type === 'removed') {
              setChats((prevChats) =>
                prevChats.filter(chat => chat.chatId !== change.doc.id)
              );
            }
          });
        },
        (err) => {
          console.error('Firestore listener error:', err);
          setError('Error al escuchar cambios en los chats');
        }
      );

    return () => unsubscribe();
  }, [user?.id]);

  return {
    chats,
    isLoading,
    error,
    refresh,
    deleteChats,
  };
};
