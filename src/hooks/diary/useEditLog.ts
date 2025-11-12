import { useState } from 'react';
import { mediaLogsService } from '../../services/mediaLogsService';
import type { LogMediaViewDto, UpdateMediaLogDto } from '../../types/mediaLog.types';
import { useLoading } from '../../context/LoadingContext';

interface UseEditLogResult {
  isSubmitting: boolean;
  updateLog: (
    logId: string,
    data: LogMediaViewDto,
  ) => Promise<boolean>;
  error: string | null;
}

/**
 * Hook para manejar la edición de logs existentes
 */
export function useEditLog(): UseEditLogResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();

  const updateLog = async (
    logId: string,
    formData: LogMediaViewDto,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    showLoading('Updating log...');

    try {
      const updateData: UpdateMediaLogDto = {};

      if (formData.rating !== undefined && formData.rating !== null) {
        updateData.rating = formData.rating;
      }
      if (formData.review !== undefined) {
        if (formData.review.trim().length > 0) {
          updateData.review = formData.review.trim();
          updateData.reviewLang = 'es';
        } else {
          // Clear review if empty
          updateData.review = '';
          updateData.reviewLang = '';
        }
      }
      if (formData.notes !== undefined) {
        if (formData.notes.trim().length > 0) {
          updateData.notes = formData.notes.trim();
        } else {
          // Clear notes if empty
          updateData.notes = '';
        }
      }

      const updatedLog = await mediaLogsService.updateLog(logId, updateData);
      
      if (updatedLog) {
        hideLoading();
        setIsSubmitting(false);
        return true;
      } else {
        throw new Error('Failed to update log');
      }
    } catch (err) {
      console.error('Error updating log:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      hideLoading();
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    isSubmitting,
    updateLog,
    error,
  };
}