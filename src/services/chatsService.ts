import { apiClient } from './api/apiClient';
import type {
  Chat,
  ChatSummary,
  Message,
  MessageWithSender,
  CreateChatDto,
  SendMessageDto,
  AddReactionDto,
  FirestoreTimestamp,
} from '../types/chat.types';

/**
 * Service para mensajería privada 1-a-1
 */
class ChatsService {
  private readonly baseUrl = '/chats';

  /**
   * Crear o obtener chat con un usuario
   */
  async createOrGetChat(
    recipientId: string,
    initialMessage?: string,
  ): Promise<Chat> {
    const data: CreateChatDto = { recipientId, initialMessage };
    return apiClient.post<Chat>(this.baseUrl, data);
  }

  /**
   * Obtener todos mis chats
   */
  async getMyChats(limit: number = 50): Promise<ChatSummary[]> {
    return apiClient.get<ChatSummary[]>(`${this.baseUrl}?limit=${limit}`);
  }

  /**
   * Obtener chat por ID
   */
  async getChatById(chatId: string): Promise<Chat> {
    return apiClient.get<Chat>(`${this.baseUrl}/${chatId}`);
  }

  /**
   * Eliminar chat
   */
  async deleteChat(chatId: string): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/${chatId}`);
  }

  /**
   * Enviar mensaje
   */
  async sendMessage(
    chatId: string,
    text: string,
    type: string = 'text',
  ): Promise<Message> {
    const data: SendMessageDto = { text, type: type as any };
    return apiClient.post<Message>(`${this.baseUrl}/${chatId}/messages`, data);
  }

  /**
   * Obtener mensajes del chat
   */
  async getChatMessages(
    chatId: string,
    limit: number = 100,
  ): Promise<MessageWithSender[]> {
    return apiClient.get<MessageWithSender[]>(
      `${this.baseUrl}/${chatId}/messages?limit=${limit}`,
    );
  }

  /**
   * Eliminar mensaje
   */
  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    return apiClient.delete<void>(
      `${this.baseUrl}/${chatId}/messages/${messageId}`,
    );
  }

  /**
   * Agregar reacción a mensaje
   */
  async addReaction(
    chatId: string,
    messageId: string,
    emoji: string,
  ): Promise<void> {
    const data: AddReactionDto = { emoji };
    return apiClient.post<void>(
      `${this.baseUrl}/${chatId}/messages/${messageId}/reactions`,
      data,
    );
  }

  /**
   * Eliminar reacción de mensaje
   */
  async removeReaction(chatId: string, messageId: string): Promise<void> {
    return apiClient.delete<void>(
      `${this.baseUrl}/${chatId}/messages/${messageId}/reactions`,
    );
  }

  /**
   * Obtener el otro usuario en un chat 1-a-1
   */
  getOtherUser(chat: Chat, myUserId: string): string {
    return chat.members.find(uid => uid !== myUserId) || '';
  }

  /**
   * Formatear timestamp de mensaje
   */
  formatMessageTime(timestamp: string | FirestoreTimestamp): string {
    const date =
      typeof timestamp === 'string'
        ? new Date(timestamp)
        : new Date(timestamp._seconds * 1000);

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Agrupar mensajes por fecha
   */
  groupMessagesByDate(
    messages: MessageWithSender[],
  ): Record<string, MessageWithSender[]> {
    const groups: Record<string, MessageWithSender[]> = {};

    messages.forEach(msg => {
      const date =
        typeof msg.createdAt === 'string'
          ? new Date(msg.createdAt)
          : new Date(msg.createdAt._seconds * 1000);

      const key = date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(msg);
    });

    return groups;
  }
}

export const chatsService = new ChatsService();
