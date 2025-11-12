'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWriteReview } from '../../hooks/movies/useWriteReview';
import { useEditLog } from '../../hooks/diary/useEditLog';
import { useLogDetails } from '../../hooks/diary/useLogDetails';
import { useModal } from '../../context/ModalContext';
import {
  writeReviewSchema,
  getInitialReviewValues,
} from '../../validation/writeReviewSchema';
import type { TmdbMovieDetails } from '../../types/tmdb.types';
import type { LogMediaViewDto } from '../../types/mediaLog.types';
import { buildPosterUrl } from '../../utils/tmdbImageHelpers';
import { formatShortDate } from '../../utils/dateFormatter';
import { COLORS } from '../../config/colors';

interface WriteReviewScreenProps {
  route: {
    params: {
      movieDetails: TmdbMovieDetails;
      editLogId?: string;
    };
  };
  navigation: any;
}

export default function WriteReviewScreen({
  route,
  navigation,
}: WriteReviewScreenProps) {
  const { movieDetails, editLogId } = route.params;
  const [watchedDate, setWatchedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const year = movieDetails.release_date
    ? new Date(movieDetails.release_date).getFullYear()
    : 'N/A';

  // Hooks for create and edit modes
  const { isSubmitting: isSubmittingReview, submitReview, error: reviewError } = useWriteReview();
  const { isSubmitting: isEditingLog, updateLog, error: editError } = useEditLog();
  const { log: existingLog, isLoading: loadingLog } = useLogDetails(editLogId || '');

  const isEditMode = !!editLogId;
  const isSubmitting = isSubmittingReview || isEditingLog;
  const error = reviewError || editError;

  // Initialize form values based on mode
  const getFormInitialValues = () => {
    if (isEditMode && existingLog) {
      // Convert existing log to form values
      return {
        tmdbId: existingLog.tmdbId,
        mediaType: existingLog.mediaType,
        hadSeenBefore: existingLog.hadSeenBefore || false,
        rating: existingLog.rating,
        review: existingLog.review || '',
        notes: existingLog.notes || '',
      };
    } else {
      return getInitialReviewValues(movieDetails.id);
    }
  };

  // Set watched date from existing log when in edit mode
  useEffect(() => {
    if (isEditMode && existingLog && existingLog.watchedAt) {
      const date = new Date(existingLog.watchedAt._seconds * 1000);
      setWatchedDate(date);
    }
  }, [isEditMode, existingLog]);
  const modal = useModal();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setWatchedDate(selectedDate);
    }
  };

  const handleSubmit = async (values: LogMediaViewDto) => {
    let success = false;
    
    if (isEditMode && editLogId) {
      // Edit existing log
      success = await updateLog(editLogId, values);
      
      if (success) {
        modal.showSuccess(
          'Log updated!',
          'Your log has been updated successfully.',
          () => {
            navigation.goBack();
          },
        );
      } else {
        modal.showError(
          'Error updating log',
          error || 'Failed to update your log. Please try again.',
        );
      }
    } else {
      // Create new log
      success = await submitReview(values, watchedDate);

      if (success) {
        modal.showSuccess(
          '¡Review publicada!',
          'Gracias por compartir tu opinión sobre esta película.',
          () => {
            navigation.goBack();
          },
        );
      } else {
        modal.showError(
          'Error al publicar',
          error || 'No se pudo enviar tu review. Por favor intenta nuevamente.',
        );
      }
    }
  };

  const renderStarRating = (
    rating: number | undefined,
    onRate: (newRating: number) => void,
  ) => {
    const stars = [];
    const maxStars = 5;
    const currentRating = rating || 0;

    for (let i = 1; i <= maxStars; i++) {
      const isFilled = currentRating >= i;
      const isHalfFilled = currentRating >= i - 0.5 && currentRating < i;

      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onRate(i)}
          onLongPress={() => onRate(i - 0.5)}
          style={styles.starButton}
        >
          <Icon
            name={
              isFilled ? 'star' : isHalfFilled ? 'star-half' : 'star-outline'
            }
            size={28}
            color={isFilled || isHalfFilled ? COLORS.primary : '#4B5563'}
          />
        </TouchableOpacity>,
      );
    }

    return stars;
  };

  // Show loading state when loading existing log in edit mode
  if (isEditMode && loadingLog) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading log...</Text>
      </View>
    );
  }

  return (
    <Formik
      initialValues={getFormInitialValues()}
      validationSchema={writeReviewSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        submitForm,
        setFieldValue,
      }) => (
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditMode ? 'Edit Log' : 'Write Your Review'}
            </Text>
          </View>

          {/* Movie Info Section */}
          <View style={styles.movieSection}>
            <View style={styles.movieInfoContainer}>
              {/* Title and Year */}
              <Text style={styles.movieTitle}>
                {movieDetails.title}{' '}
                <Text style={styles.movieYear}>{year}</Text>
              </Text>

              {/* Date Picker */}
              <View style={styles.datePickerContainer}>
                <Text style={styles.dateLabel}>
                  Specify the date you watched it
                </Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon
                    name="calendar-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.dateText}>
                    {watchedDate
                      ? formatShortDate(watchedDate)
                      : 'Select date (optional)'}
                  </Text>
                  <View style={styles.changeButton}>
                    <Text style={styles.changeButtonText}>
                      {watchedDate ? 'Change' : 'Select'}
                    </Text>
                  </View>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={watchedDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Rating Section */}
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Give your rating</Text>
                <View style={styles.ratingRow}>
                  <View style={styles.starsContainer}>
                    {renderStarRating(values.rating, newRating =>
                      setFieldValue('rating', newRating),
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.rewatchButton}
                    onPress={() =>
                      setFieldValue('hadSeenBefore', !values.hadSeenBefore)
                    }
                  >
                    <Icon
                      name={values.hadSeenBefore ? 'repeat' : 'repeat-outline'}
                      size={26}
                      color={values.hadSeenBefore ? COLORS.primary : '#4B5563'}
                    />
                  </TouchableOpacity>
                </View>
                {values.hadSeenBefore && (
                  <Text style={styles.rewatchLabel}>Rewatch</Text>
                )}
              </View>
            </View>

            {/* Movie Poster */}
            {movieDetails.poster_path && (
              <Image
                source={{
                  uri: buildPosterUrl(movieDetails.poster_path, 'w342')!,
                }}
                style={styles.poster}
                resizeMode="cover"
              />
            )}
          </View>

          {/* Review Text Area */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Write down your review</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="What did you think about this movie?..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={12}
              textAlignVertical="top"
              value={values.review}
              onChangeText={handleChange('review')}
              onBlur={handleBlur('review')}
            />
            {touched.review && errors.review && (
              <Text style={styles.errorText}>{errors.review}</Text>
            )}
          </View>

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionLabel}>Additional notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any extra thoughts or details..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={values.notes}
              onChangeText={handleChange('notes')}
              onBlur={handleBlur('notes')}
            />
            {touched.notes && errors.notes && (
              <Text style={styles.errorText}>{errors.notes}</Text>
            )}
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={submitForm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>Publish</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '400',
  },
  movieSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },
  movieInfoContainer: {
    flex: 1,
  },
  movieTitle: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 30,
  },
  movieYear: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'normal',
    opacity: 0.8,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 8,
    opacity: 0.6,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(93, 77, 109, 0.5)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 13,
    flex: 1,
  },
  changeButton: {
    backgroundColor: 'rgba(93, 77, 109, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    marginBottom: 8,
  },
  ratingLabel: {
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 8,
    opacity: 0.6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  starButton: {
    padding: 2,
  },
  rewatchButton: {
    padding: 4,
    marginLeft: 8,
  },
  rewatchLabel: {
    color: COLORS.primary,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionLabel: {
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 12,
    opacity: 0.7,
    fontWeight: '500',
  },
  reviewSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  reviewInput: {
    backgroundColor: 'rgba(93, 77, 109, 0.3)',
    borderRadius: 16,
    padding: 20,
    color: COLORS.text,
    fontSize: 14,
    minHeight: 240,
    borderWidth: 0,
  },
  notesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  notesInput: {
    backgroundColor: 'rgba(93, 77, 109, 0.25)',
    borderRadius: 12,
    padding: 16,
    color: COLORS.text,
    fontSize: 13,
    minHeight: 100,
    borderWidth: 0,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 8,
  },
  submitContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
