import { useState, useEffect } from 'react';
import { matchesService } from '../../services/matchesService';
import type { MatchesResponse } from '../../types/match.types';

interface UseMatchesReturn {
  matches: MatchesResponse['matches'];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useMatches = (
  maxDaysAgo: number = 10,
  minRating: number = 2.5,
  limit: number = 20
): UseMatchesReturn => {
  const [matches, setMatches] = useState<MatchesResponse['matches']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setError(null);
        const response = await matchesService.getPotentialMatches(
          maxDaysAgo,
          minRating,
          limit
        );
        setMatches(response.matches);
      } catch (err) {
        console.error('Error loading matches:', err);
        setError(
          err instanceof Error ? err.message : 'Error al cargar los matches'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, [maxDaysAgo, minRating, limit]);

  const refresh = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await matchesService.getPotentialMatches(
        maxDaysAgo,
        minRating,
        limit
      );
      setMatches(response.matches);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError(
        err instanceof Error ? err.message : 'Error al cargar los matches'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    matches,
    isLoading,
    error,
    refresh,
  };
};
