import { useState } from 'react';
import { mediaLogsService } from '../../services/mediaLogsService';
import type { LogMediaViewDto } from '../../types/mediaLog.types';
import { useLoading } from '../../context/LoadingContext';
import { dateToFirestoreTimestamp } from '../../validation/writeReviewSchema';

interface UseWriteReviewResult {
  isSubmitting: boolean;
  submitReview: (
    data: LogMediaViewDto,
    watchedDate?: Date | null,
  ) => Promise<boolean>;
  error: string | null;
}

/**
 * Hook para manejar la escritura y envío de reviews
 */
export function useWriteReview(): UseWriteReviewResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();

  const submitReview = async (
    formData: LogMediaViewDto,
    watchedDate?: Date | null,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    showLoading('Enviando tu review...');

    try {
      const dto: LogMediaViewDto = {
        tmdbId: formData.tmdbId,
        mediaType: formData.mediaType,
        hadSeenBefore: formData.hadSeenBefore,
      };

      if (watchedDate) {
        dto.watchedAt = dateToFirestoreTimestamp(watchedDate);
      }
      if (formData.rating !== undefined && formData.rating !== null) {
        dto.rating = formData.rating;
      }
      if (formData.review && formData.review.trim().length > 0) {
        dto.review = formData.review.trim();
        dto.reviewLang = 'es';
      }
      if (formData.notes && formData.notes.trim().length > 0) {
        dto.notes = formData.notes.trim();
      }

      await mediaLogsService.logView(dto);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al enviar la review';
      setError(errorMessage);

      console.error('❌ Error al enviar review:', err);

      return false;
    } finally {
      hideLoading();
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitReview,
    error,
  };
}
