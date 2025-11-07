/**
 * Tipos para sistema de mensajería privada 1-a-1
 */

/**
 * Tipo de mensaje
 */
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

/**
 * Timestamp de Firestore
 */
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Chat entre dos usuarios
 */
export interface Chat {
  id: string;
  members: string[]; // Array de UIDs (siempre 2 miembros)
  lastMessage: string;
  createdAt: string | FirestoreTimestamp;
  updatedAt: string | FirestoreTimestamp;
}

/**
 * Resumen de chat con info adicional
 */
export interface ChatSummary {
  chatId: string;
  members: string[];
  lastMessage: string;
  lastMessageAt: string | FirestoreTimestamp;
  unreadCount: number;
}

/**
 * Mensaje en chat
 */
export interface Message {
  id: string;
  senderId: string;
  text: string;
  type: MessageType;
  reactions: Record<string, string>; // userId -> emoji
  createdAt: string | FirestoreTimestamp;
}

/**
 * Mensaje con información del remitente
 */
export interface MessageWithSender extends Message {
  senderDisplayName: string;
  senderPhotoURL: string;
}

/**
 * DTO para crear chat
 */
export interface CreateChatDto {
  recipientId: string;
  initialMessage?: string;
}

/**
 * DTO para enviar mensaje
 */
export interface SendMessageDto {
  text: string;
  type?: MessageType; // Default: 'text'
}

/**
 * DTO para agregar reacción
 */
export interface AddReactionDto {
  emoji: string; // Ej: '👍', '❤️', '😂', '🔥'
}

/**
 * Respuesta de éxito genérica
 */
export interface SuccessResponse {
  success: boolean;
}
