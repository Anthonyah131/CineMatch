import { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/api';

interface TopRatedPoster {
  tmdbId: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  voteCount: number;
}

interface UseTopRatedPostersResult {
  posters: TopRatedPoster[];
  isLoading: boolean;
  error: string | null;
}

export function useTopRatedPosters(): UseTopRatedPostersResult {
  const [posters, setPosters] = useState<TopRatedPoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosters() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${API_CONFIG.BASE_URL}/tmdb/posters/top-rated`,
          {
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to fetch posters');
        }

        const data: TopRatedPoster[] = await response.json();
        setPosters(data);
      } catch (err) {
        console.error('Error fetching top rated posters:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback: set empty array so we use theatre image
        setPosters([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosters();
  }, []);

  return {
    posters,
    isLoading,
    error,
  };
}
