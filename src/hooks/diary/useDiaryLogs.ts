import { useState, useEffect, useCallback } from 'react';
import { mediaLogsService } from '../../services/mediaLogsService';
import type { MediaLog } from '../../types/mediaLog.types';

interface UseDiaryLogsResult {
  logs: MediaLog[];
  isLoading: boolean;
  error: string | null;
  refreshLogs: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useDiaryLogs(initialLimit: number = 20): UseDiaryLogsResult {
  const [logs, setLogs] = useState<MediaLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = useCallback(async (fetchLimit: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedLogs = await mediaLogsService.getMyLogs(fetchLimit);
      setLogs(fetchedLogs);
      setHasMore(fetchedLogs.length === fetchLimit);
    } catch (err) {
      console.error('Error fetching diary logs:', err);
      setError('Failed to load diary entries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(limit);
  }, [fetchLogs, limit]);

  const refreshLogs = useCallback(async () => {
    await fetchLogs(limit);
  }, [fetchLogs, limit]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    const newLimit = limit + 20;
    setLimit(newLimit);
  }, [hasMore, isLoading, limit]);

  return {
    logs,
    isLoading,
    error,
    refreshLogs,
    hasMore,
    loadMore,
  };
}
