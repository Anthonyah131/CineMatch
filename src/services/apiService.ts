import { getAppToken } from './storageService';

// URL base de tu backend - Ajusta según tu configuración
const BACKEND_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api' // Para emulador Android
  : 'https://tu-backend-produccion.com/api';

/**
 * Realizar una petición GET autenticada
 */
export const authenticatedGet = async (endpoint: string) => {
  try {
    const token = await getAppToken();
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error en GET:', error);
    throw error;
  }
};

/**
 * Realizar una petición POST autenticada
 */
export const authenticatedPost = async (endpoint: string, data: any) => {
  try {
    const token = await getAppToken();
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error en POST:', error);
    throw error;
  }
};

/**
 * Realizar una petición PUT autenticada
 */
export const authenticatedPut = async (endpoint: string, data: any) => {
  try {
    const token = await getAppToken();
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error en PUT:', error);
    throw error;
  }
};

/**
 * Realizar una petición DELETE autenticada
 */
export const authenticatedDelete = async (endpoint: string) => {
  try {
    const token = await getAppToken();
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error en DELETE:', error);
    throw error;
  }
};

/**
 * Ejemplo de uso:
 * 
 * import { authenticatedGet, authenticatedPost } from '../services/apiService';
 * 
 * // Obtener perfil del usuario
 * const profile = await authenticatedGet('/users/profile');
 * 
 * // Crear una película favorita
 * const favorite = await authenticatedPost('/favorites', {
 *   movieId: '123',
 *   title: 'Inception'
 * });
 */
