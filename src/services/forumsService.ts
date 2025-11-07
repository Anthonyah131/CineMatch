import { apiClient } from './api/apiClient';
import type {
  Forum,
  ForumSummary,
  Post,
  PostWithAuthor,
  Comment,
  CommentWithAuthor,
  CreateForumDto,
  UpdateForumDto,
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  AddReactionDto,
  FirestoreTimestamp,
} from '../types/forum.types';

/**
 * Service para foros de discusión
 */
class ForumsService {
  private readonly baseUrl = '/forums';

  /**
   * Crear foro
   */
  async createForum(title: string, description: string): Promise<Forum> {
    const data: CreateForumDto = { title, description };
    return apiClient.post<Forum>(this.baseUrl, data);
  }

  /**
   * Obtener todos los foros
   */
  async getAllForums(limit: number = 50): Promise<ForumSummary[]> {
    return apiClient.get<ForumSummary[]>(`${this.baseUrl}?limit=${limit}`);
  }

  /**
   * Obtener foro por ID
   */
  async getForumById(forumId: string): Promise<Forum> {
    return apiClient.get<Forum>(`${this.baseUrl}/${forumId}`);
  }

  /**
   * Actualizar foro
   */
  async updateForum(forumId: string, data: UpdateForumDto): Promise<Forum> {
    return apiClient.put<Forum>(`${this.baseUrl}/${forumId}`, data);
  }

  /**
   * Eliminar foro
   */
  async deleteForum(forumId: string): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/${forumId}`);
  }

  /**
   * Crear post en foro
   */
  async createPost(forumId: string, content: string): Promise<Post> {
    const data: CreatePostDto = { content };
    return apiClient.post<Post>(`${this.baseUrl}/${forumId}/posts`, data);
  }

  /**
   * Obtener posts de foro
   */
  async getForumPosts(
    forumId: string,
    limit: number = 50,
  ): Promise<PostWithAuthor[]> {
    return apiClient.get<PostWithAuthor[]>(
      `${this.baseUrl}/${forumId}/posts?limit=${limit}`,
    );
  }

  /**
   * Obtener post por ID
   */
  async getPostById(forumId: string, postId: string): Promise<PostWithAuthor> {
    return apiClient.get<PostWithAuthor>(
      `${this.baseUrl}/${forumId}/posts/${postId}`,
    );
  }

  /**
   * Actualizar post
   */
  async updatePost(
    forumId: string,
    postId: string,
    content: string,
  ): Promise<Post> {
    const data: UpdatePostDto = { content };
    return apiClient.put<Post>(
      `${this.baseUrl}/${forumId}/posts/${postId}`,
      data,
    );
  }

  /**
   * Eliminar post
   */
  async deletePost(forumId: string, postId: string): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/${forumId}/posts/${postId}`);
  }

  /**
   * Agregar reacción a post
   */
  async addReactionToPost(
    forumId: string,
    postId: string,
    emoji: string,
  ): Promise<void> {
    const data: AddReactionDto = { emoji };
    return apiClient.post<void>(
      `${this.baseUrl}/${forumId}/posts/${postId}/reactions`,
      data,
    );
  }

  /**
   * Eliminar reacción de post
   */
  async removeReactionFromPost(forumId: string, postId: string): Promise<void> {
    return apiClient.delete<void>(
      `${this.baseUrl}/${forumId}/posts/${postId}/reactions`,
    );
  }

  /**
   * Crear comentario en post
   */
  async createComment(
    forumId: string,
    postId: string,
    content: string,
  ): Promise<Comment> {
    const data: CreateCommentDto = { content };
    return apiClient.post<Comment>(
      `${this.baseUrl}/${forumId}/posts/${postId}/comments`,
      data,
    );
  }

  /**
   * Obtener comentarios de post
   */
  async getPostComments(
    forumId: string,
    postId: string,
    limit: number = 100,
  ): Promise<CommentWithAuthor[]> {
    return apiClient.get<CommentWithAuthor[]>(
      `${this.baseUrl}/${forumId}/posts/${postId}/comments?limit=${limit}`,
    );
  }

  /**
   * Eliminar comentario
   */
  async deleteComment(
    forumId: string,
    postId: string,
    commentId: string,
  ): Promise<void> {
    return apiClient.delete<void>(
      `${this.baseUrl}/${forumId}/posts/${postId}/comments/${commentId}`,
    );
  }

  /**
   * Verificar si soy owner del foro
   */
  isOwner(forum: Forum, myUserId: string): boolean {
    return forum.ownerId === myUserId;
  }

  /**
   * Verificar si soy autor del post
   */
  isPostAuthor(post: Post, myUserId: string): boolean {
    return post.authorId === myUserId;
  }

  /**
   * Formatear timestamp
   */
  formatTimestamp(timestamp: string | FirestoreTimestamp): string {
    const date =
      typeof timestamp === 'string'
        ? new Date(timestamp)
        : new Date(timestamp._seconds * 1000);

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Hace unos minutos';
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;

    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Contar reacciones totales
   */
  countReactions(reactions: Record<string, string>): number {
    return Object.keys(reactions).length;
  }

  /**
   * Obtener mi reacción
   */
  getMyReaction(
    reactions: Record<string, string>,
    myUserId: string,
  ): string | null {
    return reactions[myUserId] || null;
  }
}

export const forumsService = new ForumsService();
