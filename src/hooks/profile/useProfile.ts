import { useState, useEffect } from 'react';
import { usersService } from '../../services/usersService';
import { mediaLogsService } from '../../services/mediaLogsService';
import { useAuth } from '../../context/AuthContext';
import type { User, FavoriteItem } from '../../types/user.types';
import type { MediaLog, UserMediaStats } from '../../types/mediaLog.types';

interface UseProfileResult {
  user: User | null;
  favorites: FavoriteItem[];
  recentLogs: MediaLog[];
  stats: UserMediaStats | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<MediaLog[]>([]);
  const [stats, setStats] = useState<UserMediaStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!authUser) {
      setError('No user logged in');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [userData, favoritesData, logsData, statsData] = await Promise.all([
        usersService.getUserById(authUser.id),
        usersService.getMyFavorites(),
        mediaLogsService.getMyLogs(10),
        mediaLogsService.getMyStats(),
      ]);

      const userWithId = { ...userData, id: authUser.id };
      setUser(userWithId);
      setFavorites(favoritesData);
      setRecentLogs(logsData);
      setStats(statsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar perfil';
      setError(errorMessage);
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);

  return {
    user,
    favorites,
    recentLogs,
    stats,
    isLoading,
    error,
    refresh: loadProfile,
  };
}
