import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersService } from '../../services/usersService';
import type { User } from '../../types/user.types';

interface UseUserSettingsResult {
  userData: User | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export function useUserSettings(): UseUserSettingsResult {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!authUser?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const user = await usersService.getUserById(authUser.id);
      setUserData(user);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refreshUser = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  const updateProfile = useCallback(async (data: any) => {
    try {
      await usersService.updateMyProfile(data);
      // Refresh user data after successful update
      await refreshUser();
    } catch (err) {
      throw err;
    }
  }, [refreshUser]);

  return {
    userData,
    isLoading,
    error,
    refreshUser,
    updateProfile,
  };
}
