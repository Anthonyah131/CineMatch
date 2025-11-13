import { useState, useEffect, useCallback } from 'react';
import { forumsService } from '../../services/forumsService';
import { useAuth } from '../../context/AuthContext';
import type { Forum, PostWithAuthor, CommentWithAuthor } from '../../types/forum.types';

export interface UseForumDetailsReturn {
  forum: Forum | null;
  posts: PostWithAuthor[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  createPost: (content: string) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
  addReaction: (postId: string, emoji: string) => Promise<boolean>;
  removeReaction: (postId: string) => Promise<boolean>;
  createComment: (postId: string, content: string) => Promise<boolean>;
  refreshForum: () => Promise<void>;
}

export const useForumDetails = (forumId: string): UseForumDetailsReturn => {
  const [forum, setForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadForumDetails = useCallback(async (isRefreshing = false) => {
    if (!forumId) return;

    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [forumData, postsData] = await Promise.all([
        forumsService.getForumById(forumId),
        forumsService.getForumPosts(forumId, 100),
      ]);

      setForum(forumData);
      setPosts(postsData);
    } catch (err) {
      console.error('Error loading forum details:', err);
      setError('Error al cargar el foro. Intenta de nuevo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [forumId]);

  useEffect(() => {
    loadForumDetails();
  }, [loadForumDetails]);

  const createPost = useCallback(async (content: string): Promise<boolean> => {
    if (!content.trim()) {
      setError('El contenido del post no puede estar vacío');
      return false;
    }

    try {
      setError(null);
      const newPost = await forumsService.createPost(forumId, content.trim());
      
      // Crear un PostWithAuthor temporal con la información del usuario actual
      const newPostWithAuthor: PostWithAuthor = {
        ...newPost,
        authorDisplayName: user?.name || 'Usuario',
        authorPhotoUrl: user?.photoUrl || '',
        commentsCount: 0,
      };

      setPosts(prev => [newPostWithAuthor, ...prev]);
      return true;
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Error al crear el post. Intenta de nuevo.');
      return false;
    }
  }, [forumId, user]);

  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    try {
      setError(null);
      await forumsService.deletePost(forumId, postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      return true;
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Error al eliminar el post. Intenta de nuevo.');
      return false;
    }
  }, [forumId]);

  const addReaction = useCallback(async (postId: string, emoji: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setError(null);
      await forumsService.addReactionToPost(forumId, postId, emoji);
      
      // Actualización optimista
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  [user.id]: emoji
                }
              }
            : post
        )
      );
      return true;
    } catch (err) {
      console.error('Error adding reaction:', err);
      setError('Error al agregar reacción. Intenta de nuevo.');
      return false;
    }
  }, [forumId, user?.id]);

  const removeReaction = useCallback(async (postId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setError(null);
      await forumsService.removeReactionFromPost(forumId, postId);
      
      // Actualización optimista
      setPosts(prev => 
        prev.map(post => {
          if (post.id === postId) {
            const newReactions = { ...post.reactions };
            delete newReactions[user.id];
            return {
              ...post,
              reactions: newReactions
            };
          }
          return post;
        })
      );
      return true;
    } catch (err) {
      console.error('Error removing reaction:', err);
      setError('Error al quitar reacción. Intenta de nuevo.');
      return false;
    }
  }, [forumId, user?.id]);

  const createComment = useCallback(async (postId: string, content: string): Promise<boolean> => {
    if (!content.trim()) {
      setError('El comentario no puede estar vacío');
      return false;
    }

    try {
      setError(null);
      await forumsService.createComment(forumId, postId, content.trim());
      
      // Incrementar contador de comentarios optimisticamente
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, commentsCount: post.commentsCount + 1 }
            : post
        )
      );
      return true;
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Error al crear el comentario. Intenta de nuevo.');
      return false;
    }
  }, [forumId]);

  const refreshForum = useCallback(async () => {
    await loadForumDetails(true);
  }, [loadForumDetails]);

  return {
    forum,
    posts,
    loading,
    error,
    refreshing,
    createPost,
    deletePost,
    addReaction,
    removeReaction,
    createComment,
    refreshForum,
  };
};