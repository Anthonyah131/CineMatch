import { useState, useEffect, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import { chatsService } from '../../services/chatsService';
import type { MessageWithSender } from '../../types/chat.types';

interface UseChatMessagesReturn {
  messages: MessageWithSender[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export const useChatMessages = (chatId: string): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Cargar mensajes desde la API (máximo 30)
  const loadMessages = useCallback(async () => {
    try {
      setError(null);
      const data = await chatsService.getChatMessages(chatId, 30);
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(
        err instanceof Error ? err.message : 'Error al cargar mensajes'
      );
    }
  }, [chatId]);

  // Cargar mensajes iniciales solo una vez desde el servicio
  useEffect(() => {
    const loadInitialMessages = async () => {
      setIsLoading(true);
      await loadMessages();
      setIsLoading(false);
      setInitialLoadDone(true);
    };

    loadInitialMessages();
  }, [chatId, loadMessages]); // Cuando cambia el chatId

  // Listener en tiempo real con React Native Firebase (solo después de carga inicial)
  useEffect(() => {
    if (!chatId || !initialLoadDone) return;

    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(30)
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const newMessage = {
                id: change.doc.id,
                ...change.doc.data(),
              } as MessageWithSender;

              setMessages((prevMessages) => {
                const exists = prevMessages.some(msg => msg.id === newMessage.id);
                if (exists) return prevMessages;
                return [newMessage, ...prevMessages];
              });
            }

            if (change.type === 'modified') {
              const updatedMessage = {
                id: change.doc.id,
                ...change.doc.data(),
              } as MessageWithSender;

              setMessages((prevMessages) =>
                prevMessages.map(msg =>
                  msg.id === updatedMessage.id ? updatedMessage : msg
                )
              );
            }

            if (change.type === 'removed') {
              setMessages((prevMessages) =>
                prevMessages.filter(msg => msg.id !== change.doc.id)
              );
            }
          });
        },
        (err) => {
          console.error('Firestore listener error:', err);
          setError('Error al escuchar mensajes en tiempo real');
        }
      );

    return () => unsubscribe();
  }, [chatId, initialLoadDone]);

  const sendMessage = useCallback(
    async (text: string) => {
      try {
        await chatsService.sendMessage(chatId, text);
        // El mensaje aparecerá automáticamente vía listener
      } catch (err) {
        console.error('Error sending message:', err);
        throw err;
      }
    },
    [chatId]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        await chatsService.deleteMessage(chatId, messageId);
        // El mensaje se eliminará automáticamente vía listener
      } catch (err) {
        console.error('Error deleting message:', err);
        throw err;
      }
    },
    [chatId]
  );

  const addReaction = useCallback(
    async (messageId: string, emoji: string) => {
      try {
        await chatsService.addReaction(chatId, messageId, emoji);
        // La reacción se actualizará automáticamente vía listener
      } catch (err) {
        console.error('Error adding reaction:', err);
        throw err;
      }
    },
    [chatId]
  );

  const removeReaction = useCallback(
    async (messageId: string) => {
      try {
        await chatsService.removeReaction(chatId, messageId);
        // La reacción se eliminará automáticamente vía listener
      } catch (err) {
        console.error('Error removing reaction:', err);
        throw err;
      }
    },
    [chatId]
  );

  const refreshMessages = useCallback(async () => {
    await loadMessages();
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    refreshMessages,
  };
};
