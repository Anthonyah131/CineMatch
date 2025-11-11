import { useState, useEffect } from 'react';
import { usersService } from '../../services/usersService';
import { useAuth } from '../../context/AuthContext';
import type { User, FavoriteItem } from '../../types/user.types';
import type { MediaLog } from '../../types/mediaLog.types';

interface UserStats {
  totalMovies: number;
  totalShows: number;
  totalLogs: number;
  averageRating: number;
  totalFavorites: number;
  totalViews: number;
  totalReviews: number;
}

interface UseUserProfileReturn {
  user: User | null;
  favorites: FavoriteItem[];
  recentLogs: MediaLog[];
  recentReviews: MediaLog[];
  stats: UserStats;
  isFollowing: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleFollow: () => Promise<void>;
  isTogglingFollow: boolean;
}

/**
 * Hook para ver el perfil de otro usuario
 * @param userId - ID del usuario a visualizar
 */
export const useUserProfile = (userId: string): UseUserProfileReturn => {
  const { user: currentUser, refreshUserData } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<MediaLog[]>([]);
  const [recentReviews, setRecentReviews] = useState<MediaLog[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalMovies: 0,
    totalShows: 0,
    totalLogs: 0,
    averageRating: 0,
    totalFavorites: 0,
    totalViews: 0,
    totalReviews: 0,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Usar el nuevo endpoint completo y verificar follow status
      const [completeProfile, followingStatus] = await Promise.all([
        usersService.getCompleteUserProfile(userId),
        currentUser?.id ? usersService.isFollowing(userId) : Promise.resolve(false),
      ]);

      // Mapear la data del nuevo endpoint
      const { user: userData, stats: statsData, recentFavorites, recentLogs: logsData, recentReviews: reviewsData } = completeProfile;

      // Convertir user data del endpoint al formato User esperado
      setUser({
        id: userId,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        bio: userData.bio || '',
        birthdate: userData.birthdate || '',
        favorites: [], // Los favoritos vienen en recentFavorites
        followersCount: userData.followersCount,
        followingCount: userData.followingCount,
        settings: { language: 'es', region: 'CR', privacy: { showEmail: false, showBirthdate: false } },
        authProviders: [],
        emailVerified: true,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      });

      // Mapear favoritos del nuevo formato
      setFavorites(recentFavorites);

      // Mapear logs recientes del nuevo formato
      const mappedLogs: MediaLog[] = logsData.map(log => ({
        id: log.id,
        userId: userId,
        tmdbId: log.tmdbId,
        mediaType: log.mediaType,
        rating: log.rating,
        review: log.review,
        watchedAt: typeof log.watchedAt === 'object' && (log.watchedAt as any)._seconds ? {
          _seconds: (log.watchedAt as any)._seconds,
          _nanoseconds: (log.watchedAt as any)._nanoseconds || 0,
        } : {
          _seconds: Math.floor(new Date(log.watchedAt as string).getTime() / 1000),
          _nanoseconds: 0,
        },
        hadSeenBefore: log.hadSeenBefore,
        createdAt: typeof log.watchedAt === 'object' && (log.watchedAt as any)._seconds ? {
          _seconds: (log.watchedAt as any)._seconds,
          _nanoseconds: (log.watchedAt as any)._nanoseconds || 0,
        } : {
          _seconds: Math.floor(new Date(log.watchedAt as string).getTime() / 1000),
          _nanoseconds: 0,
        },
        updatedAt: typeof log.watchedAt === 'object' && (log.watchedAt as any)._seconds ? {
          _seconds: (log.watchedAt as any)._seconds,
          _nanoseconds: (log.watchedAt as any)._nanoseconds || 0,
        } : {
          _seconds: Math.floor(new Date(log.watchedAt as string).getTime() / 1000),
          _nanoseconds: 0,
        },
      }));

      setRecentLogs(mappedLogs);

      // Mapear reviews recientes del nuevo formato
      const mappedReviews: MediaLog[] = reviewsData.map(review => ({
        id: review.id,
        userId: userId,
        tmdbId: review.tmdbId,
        mediaType: review.mediaType,
        rating: review.rating,
        review: review.review,
        watchedAt: typeof review.watchedAt === 'object' && (review.watchedAt as any)._seconds ? {
          _seconds: (review.watchedAt as any)._seconds,
          _nanoseconds: (review.watchedAt as any)._nanoseconds || 0,
        } : {
          _seconds: Math.floor(new Date(review.watchedAt as string).getTime() / 1000),
          _nanoseconds: 0,
        },
        hadSeenBefore: false, // Reviews don't have hadSeenBefore property
        createdAt: typeof review.createdAt === 'object' && (review.createdAt as any)._seconds ? {
          _seconds: (review.createdAt as any)._seconds,
          _nanoseconds: (review.createdAt as any)._nanoseconds || 0,
        } : {
          _seconds: Math.floor(new Date(review.createdAt as string).getTime() / 1000),
          _nanoseconds: 0,
        },
        updatedAt: typeof review.createdAt === 'object' && (review.createdAt as any)._seconds ? {
          _seconds: (review.createdAt as any)._seconds,
          _nanoseconds: (review.createdAt as any)._nanoseconds || 0,
        } : {
          _seconds: Math.floor(new Date(review.createdAt as string).getTime() / 1000),
          _nanoseconds: 0,
        },
      }));

      setRecentReviews(mappedReviews);
      setIsFollowing(followingStatus);

      // Mapear estadísticas del nuevo formato
      setStats({
        totalMovies: statsData.totalMoviesWatched,
        totalShows: statsData.totalTvShowsWatched,
        totalLogs: statsData.totalViews,
        averageRating: statsData.averageRating,
        totalFavorites: statsData.totalFavorites,
        totalViews: statsData.totalViews,
        totalReviews: statsData.totalReviews,
      });
    } catch (err: any) {
      console.error('Error al cargar perfil completo del usuario:', err);
      setError(err.message || 'Error al cargar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await loadUserProfile();
  };

  const toggleFollow = async () => {
    if (!currentUser?.id || isTogglingFollow) return;

    try {
      setIsTogglingFollow(true);

      if (isFollowing) {
        await usersService.unfollowUser(userId);
        setIsFollowing(false);
        
        // Actualizar contador local
        if (user) {
          setUser({
            ...user,
            followersCount: user.followersCount - 1,
          });
        }
      } else {
        await usersService.followUser(userId);
        setIsFollowing(true);
        
        // Actualizar contador local
        if (user) {
          setUser({
            ...user,
            followersCount: user.followersCount + 1,
          });
        }
      }

      // Refrescar datos del usuario actual (su followingCount cambió)
      await refreshUserData();
    } catch (err: any) {
      console.error('Error al cambiar follow status:', err);
      setError(err.message || 'Error al actualizar seguimiento');
    } finally {
      setIsTogglingFollow(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    user,
    favorites,
    recentLogs,
    recentReviews,
    stats,
    isFollowing,
    isLoading,
    error,
    refresh,
    toggleFollow,
    isTogglingFollow,
  };
};
