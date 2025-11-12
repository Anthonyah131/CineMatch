import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { mediaLogsService } from '../../services/mediaLogsService';
import { mediaCacheService } from '../../services/mediaCacheService';
import type { MediaLog } from '../../types/mediaLog.types';
import type { MediaCache } from '../../types/mediaCache.types';

interface UseLogDetailsResult {
  log: MediaLog | null;
  mediaData: MediaCache | null;
  isLoading: boolean;
  error: string | null;
  refreshLog: () => Promise<void>;
  deleteLog: () => Promise<boolean>;
}

export function useLogDetails(logId: string): UseLogDetailsResult {
  const [log, setLog] = useState<MediaLog | null>(null);
  const [mediaData, setMediaData] = useState<MediaCache | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLog = useCallback(async () => {
    if (!logId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedLog = await mediaLogsService.getLogById(logId);
      setLog(fetchedLog);

      // Fetch media data from cache
      if (fetchedLog) {
        try {
          const response = fetchedLog.mediaType === 'movie'
            ? await mediaCacheService.getMovie(fetchedLog.tmdbId)
            : await mediaCacheService.getTVShow(fetchedLog.tmdbId);
          
          setMediaData(response.data);
        } catch (err) {
          console.error('Error fetching media data:', err);
          // No establecemos error aquí, solo log
        }
      }
    } catch (err) {
      console.error('Error fetching log details:', err);
      setError('Failed to load log details');
    } finally {
      setIsLoading(false);
    }
  }, [logId]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  // Refresh when screen comes into focus (after editing)
  useFocusEffect(
    useCallback(() => {
      if (logId) {
        fetchLog();
      }
    }, [logId, fetchLog])
  );

  const refreshLog = useCallback(async () => {
    await fetchLog();
  }, [fetchLog]);

  const deleteLog = useCallback(async (): Promise<boolean> => {
    if (!logId) return false;

    try {
      await mediaLogsService.deleteLog(logId);
      return true;
    } catch (err) {
      console.error('Error deleting log:', err);
      return false;
    }
  }, [logId]);

  return {
    log,
    mediaData,
    isLoading,
    error,
    refreshLog,
    deleteLog,
  };
}
