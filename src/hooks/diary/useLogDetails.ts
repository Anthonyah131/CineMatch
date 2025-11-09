import { useState, useEffect, useCallback } from 'react';
import { mediaLogsService } from '../../services/mediaLogsService';
import type { MediaLog } from '../../types/mediaLog.types';

interface UseLogDetailsResult {
  log: MediaLog | null;
  isLoading: boolean;
  error: string | null;
  refreshLog: () => Promise<void>;
  deleteLog: () => Promise<boolean>;
}

export function useLogDetails(logId: string): UseLogDetailsResult {
  const [log, setLog] = useState<MediaLog | null>(null);
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
    isLoading,
    error,
    refreshLog,
    deleteLog,
  };
}
