/**
 * 🔐 Auth Types
 * Tipos para autenticación con Firebase y backend
 */

// ==================== REQUEST DTOS ====================

/**
 * DTO para login
 */
export interface LoginDto {
  firebaseToken: string;
}

/**
 * DTO para registro (opcional, pero disponible si lo necesitas)
 */
export interface RegisterDto {
  firebaseToken: string;
  displayName?: string;
  bio?: string;
  birthdate?: string; // formato: YYYY-MM-DD
}

// ==================== RESPONSE DTOS ====================

/**
 * Usuario autenticado (formato del backend)
 */
export interface AuthUserDto {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

/**
 * Respuesta de autenticación del backend
 */
export interface AuthResponseDto {
  token: string; // JWT token
  user: AuthUserDto;
}

// ==================== JWT PAYLOAD ====================

/**
 * Payload del JWT token
 */
export interface JwtPayload {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration (timestamp)
}

// ==================== FRONTEND TYPES ====================

/**
 * Usuario para el frontend (más simple)
 * Compatible con tu AuthResponse actual
 */
export interface AuthUser {
  id: string; // = uid
  email: string;
  name: string; // = displayName
  photoUrl?: string; // = photoURL
}

/**
 * Respuesta de autenticación para el frontend
 * Compatible con tu código actual
 */
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ==================== ERROR TYPES ====================

/**
 * Errores comunes de autenticación
 */
export enum AuthErrorCode {
  // Firebase
  SIGN_IN_CANCELLED = 'SIGN_IN_CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE = 'PLAY_SERVICES_NOT_AVAILABLE',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  INVALID_EMAIL = 'auth/invalid-email',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  WEAK_PASSWORD = 'auth/weak-password',

  // Backend
  INVALID_TOKEN = 'INVALID_TOKEN',
  USER_EXISTS = 'USER_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface AuthError {
  code: AuthErrorCode | string;
  message: string;
}
