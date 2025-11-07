/**
 * Tipos para sistema de foros de discusión
 */

/**
 * Timestamp de Firestore
 */
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Foro de discusión
 */
export interface Forum {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  createdAt: string | FirestoreTimestamp;
  updatedAt: string | FirestoreTimestamp;
}

/**
 * Resumen de foro con estadísticas
 */
export interface ForumSummary {
  forumId: string;
  title: string;
  description: string;
  ownerId: string;
  ownerDisplayName: string;
  postsCount: number;
  lastPostAt?: string | FirestoreTimestamp;
}

/**
 * Post en foro
 */
export interface Post {
  id: string;
  authorId: string;
  content: string;
  reactions: Record<string, string>; // userId -> emoji
  createdAt: string | FirestoreTimestamp;
}

/**
 * Post con información del autor
 */
export interface PostWithAuthor extends Post {
  authorDisplayName: string;
  authorPhotoURL: string;
  commentsCount: number;
}

/**
 * Comentario en post
 */
export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string | FirestoreTimestamp;
}

/**
 * Comentario con información del autor
 */
export interface CommentWithAuthor extends Comment {
  authorDisplayName: string;
  authorPhotoURL: string;
}

/**
 * DTO para crear foro
 */
export interface CreateForumDto {
  title: string;
  description: string;
}

/**
 * DTO para actualizar foro
 */
export interface UpdateForumDto {
  title?: string;
  description?: string;
}

/**
 * DTO para crear post
 */
export interface CreatePostDto {
  content: string;
}

/**
 * DTO para actualizar post
 */
export interface UpdatePostDto {
  content: string;
}

/**
 * DTO para crear comentario
 */
export interface CreateCommentDto {
  content: string;
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
