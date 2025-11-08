/**
 * Utilidades para formatear fechas en la aplicación
 */

/**
 * Formatea una fecha a formato corto: "7 nov 2025"
 * @param date - Fecha a formatear
 * @returns String con formato "día mes año"
 */
export function formatShortDate(date: Date): string {
  const day = date.getDate();
  const monthNames = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Formatea una fecha a formato largo: "7 de noviembre de 2025"
 * @param date - Fecha a formatear
 * @returns String con formato largo en español
 */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatea una fecha relativa: "Hace 2 días", "Ayer", "Hoy"
 * @param date - Fecha a formatear
 * @returns String con formato relativo
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
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
export function formatInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
