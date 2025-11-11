import { useState, useEffect } from 'react';
import { usersService } from '../../services/usersService';
import type { FollowerWithInfo, FollowingWithInfo } from '../../types/user.types';

export type FollowListType = 'followers' | 'following';

interface UseFollowListReturn {
  users: (FollowerWithInfo | FollowingWithInfo)[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook para cargar la lista de seguidores o seguidos
 * @param type - Tipo de lista: 'followers' o 'following'
 * @param userId - ID del usuario (puede ser el actual o de otro usuario)
 * @param limit - Límite de usuarios a cargar
 */
export const useFollowList = (
  type: FollowListType,
  userId: string,
  limit: number = 50,
): UseFollowListReturn => {
  const [users, setUsers] = useState<(FollowerWithInfo | FollowingWithInfo)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: (FollowerWithInfo | FollowingWithInfo)[] = [];

      if (type === 'followers') {
        data = await usersService.getUserFollowers(userId, limit);
      } else {
        data = await usersService.getUserFollowing(userId, limit);
      }

      setUsers(data);
    } catch (err: any) {
      console.error(`Error al cargar ${type}:`, err);
      setError(err.message || `Error al cargar ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await loadUsers();
  };

  useEffect(() => {
    if (userId) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, userId, limit]);

  return {
    users,
    isLoading,
    error,
    refresh,
  };
};
