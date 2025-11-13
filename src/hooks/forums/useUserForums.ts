import { useState, useEffect, useCallback } from 'react';
import { forumsService } from '../../services/forumsService';
import { useAuth } from '../../context/AuthContext';
import type { Forum, ForumSummary } from '../../types/forum.types';

export interface UseUserForumsReturn {
  forums: ForumSummary[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  createForum: (title: string, description: string) => Promise<boolean>;
  deleteForum: (forumId: string) => Promise<boolean>;
  updateForum: (forumId: string, title: string, description: string) => Promise<boolean>;
  refreshForums: () => Promise<void>;
}

export const useUserForums = (): UseUserForumsReturn => {
  const [forums, setForums] = useState<ForumSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadForums = useCallback(async (isRefreshing = false) => {
    if (!user?.id) {
      setForums([]);
      setLoading(false);
      return;
    }

    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const userForums = await forumsService.getForumsByOwner(user.id);
      console.log('User forums loaded:', userForums.length, userForums);
      setForums(userForums);
    } catch (err) {
      console.error('Error loading user forums:', err);
      setError('Error al cargar tus foros. Intenta de nuevo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadForums();
  }, [loadForums]);

  const createForum = useCallback(async (title: string, description: string): Promise<boolean> => {
    if (!title.trim() || !description.trim()) {
      setError('El título y la descripción son obligatorios');
      return false;
    }

    try {
      setError(null);
      const newForum = await forumsService.createForum(title.trim(), description.trim());
      // Recargar la lista ya que el servidor devuelve Forum pero necesitamos ForumSummary
      await loadForums();
      return true;
    } catch (err) {
      console.error('Error creating forum:', err);
      setError('Error al crear el foro. Intenta de nuevo.');
      return false;
    }
  }, [loadForums]);

  const deleteForum = useCallback(async (forumId: string): Promise<boolean> => {
    try {
      setError(null);
      await forumsService.deleteForum(forumId);
      setForums(prev => prev.filter(forum => forum.forumId !== forumId));
      return true;
    } catch (err) {
      console.error('Error deleting forum:', err);
      setError('Error al eliminar el foro. Intenta de nuevo.');
      return false;
    }
  }, []);

  const updateForum = useCallback(async (
    forumId: string, 
    title: string, 
    description: string
  ): Promise<boolean> => {
    if (!title.trim() || !description.trim()) {
      setError('El título y la descripción son obligatorios');
      return false;
    }

    try {
      setError(null);
      await forumsService.updateForum(forumId, {
        title: title.trim(),
        description: description.trim(),
      });
      
      // Actualizar localmente el ForumSummary
      setForums(prev => 
        prev.map(forum => 
          forum.forumId === forumId 
            ? { ...forum, title: title.trim(), description: description.trim() }
            : forum
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating forum:', err);
      setError('Error al actualizar el foro. Intenta de nuevo.');
      return false;
    }
  }, []);

  const refreshForums = useCallback(async () => {
    await loadForums(true);
  }, [loadForums]);

  return {
    forums,
    loading,
    error,
    refreshing,
    createForum,
    deleteForum,
    updateForum,
    refreshForums,
  };
};