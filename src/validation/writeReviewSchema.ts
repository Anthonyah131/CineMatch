import * as Yup from 'yup';

/**
 * Schema de validación para el formulario de review
 * Basado en LogMediaViewDto
 *
 * Campos OBLIGATORIOS:
 * - tmdbId (number)
 * - mediaType ('movie' | 'tv')
 * - hadSeenBefore (boolean)
 *
 * Campos OPCIONALES:
 * - watchedAt (FirestoreTimestamp)
 * - rating (number 0-5)
 * - review (string)
 * - notes (string)
 */
export const writeReviewSchema = Yup.object().shape({
  tmdbId: Yup.number()
    .required('El ID de la película es requerido')
    .positive('El ID debe ser un número positivo'),
  mediaType: Yup.string()
    .oneOf(['movie', 'tv'], 'El tipo de media debe ser movie o tv')
    .required('El tipo de media es requerido'),
  hadSeenBefore: Yup.boolean().required(),
  rating: Yup.number()
    .min(0, 'La calificación mínima es 0')
    .max(5, 'La calificación máxima es 5')
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null ? undefined : value;
    })
    .notRequired(),
  review: Yup.string()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .min(10, 'La review debe tener al menos 10 caracteres')
    .max(5000, 'La review no puede exceder 5000 caracteres')
    .notRequired(),
  notes: Yup.string()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .notRequired(),
});

/**
 * Valores iniciales para el formulario
 */
export const getInitialReviewValues = (movieId: number) => ({
  tmdbId: movieId,
  mediaType: 'movie' as const,
  hadSeenBefore: false,
  rating: undefined,
  review: '',
  notes: '',
});

/**
 * Helper para convertir Date a FirestoreTimestamp
 */
export const dateToFirestoreTimestamp = (date: Date) => ({
  _seconds: Math.floor(date.getTime() / 1000),
  _nanoseconds: 0,
});
