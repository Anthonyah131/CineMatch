/**
 * Utilidades para formatear fechas en la aplicación
 */

/**
 * Interface para timestamps de Firestore
 */
export interface FirestoreTimestamp {
  seconds?: number;
  nanoseconds?: number;
  _seconds?: number;
  _nanoseconds?: number;
}

/**
 * Convierte un FirestoreTimestamp a Date
 * @param timestamp - Timestamp de Firestore
 * @returns Date object o null si hay error
 */
export function timestampToDate(timestamp: FirestoreTimestamp | Date | any): Date | null {
  if (!timestamp) return null;

  try {
    // Si ya es una Date
    if (timestamp instanceof Date) {
      return timestamp;
    }

    // Si tiene seconds o _seconds (Firestore timestamp)
    const seconds = timestamp.seconds ?? timestamp._seconds;
    if (seconds !== undefined) {
      return new Date(seconds * 1000);
    }

    // Intentar convertir directamente
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Formatea una fecha a formato corto: "7 nov 2025"
 * @param date - Fecha a formatear (Date, FirestoreTimestamp, o cualquier valor convertible)
 * @returns String con formato "día mes año" o "Unknown date"
 */
export function formatShortDate(date: Date | FirestoreTimestamp | any): string {
  const dateObj = timestampToDate(date);
  if (!dateObj) return 'Unknown date';

  const day = dateObj.getDate();
  const monthNames = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
  ];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Formatea una fecha a formato largo: "7 de noviembre de 2025"
 * @param date - Fecha a formatear
 * @returns String con formato largo en español o "Unknown date"
 */
export function formatLongDate(date: Date | FirestoreTimestamp | any): string {
  const dateObj = timestampToDate(date);
  if (!dateObj) return 'Unknown date';

  return dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatea una fecha de Firestore a string legible (inglés)
 * @param timestamp - Timestamp de Firestore o Date
 * @param locale - Locale para el formato (default: 'en-US')
 * @returns Fecha formateada o 'Unknown date' si hay error
 */
export function formatWatchDate(
  timestamp: FirestoreTimestamp | Date | any,
  locale: string = 'en-US'
): string {
  const dateObj = timestampToDate(timestamp);
  if (!dateObj) return 'Unknown date';

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formatea una fecha relativa: "Hace 2 días", "Ayer", "Hoy"
 * @param date - Fecha a formatear
 * @returns String con formato relativo
 */
export function formatRelativeDate(date: Date | FirestoreTimestamp | any): string {
  const dateObj = timestampToDate(date);
  if (!dateObj) return 'Unknown date';

  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  }

  const years = Math.floor(diffDays / 365);
  return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
}

/**
 * Formatea fecha para input de tipo date (YYYY-MM-DD)
 * @param date - Fecha a formatear
 * @returns String en formato ISO date
 */
export function formatInputDate(date: Date | FirestoreTimestamp | any): string {
  const dateObj = timestampToDate(date);
  if (!dateObj) return '';

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
