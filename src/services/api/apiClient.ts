import axios, { AxiosInstance, AxiosError } from 'axios';
import { getAppToken, removeAppToken } from '../storageService';
import { API_CONFIG } from '../../config/api';
import { SimpleEventEmitter } from '../../utils/SimpleEventEmitter';
import { requestLogger, responseLogger, errorLogger } from './interceptors';

/**
 * Event emitter para eventos de autenticación
 */
export const authEvents = new SimpleEventEmitter();

/**
 * Cliente HTTP con axios e interceptores
 * - Agrega automáticamente el token JWT a todas las peticiones
 * - Maneja errores 401 y fuerza logout cuando el token expira
 * - Logs automáticos en desarrollo (ver interceptors.ts)
 */
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Crear instancia de axios
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    // Configurar interceptores
    this.setupInterceptors();
  }

  /**
   * Configurar todos los interceptores
   */
  private setupInterceptors(): void {
    // REQUEST INTERCEPTORS
    
    // 1. Agregar token de autenticación
    this.axiosInstance.interceptors.request.use(
      async config => {
        try {
          const token = await getAppToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error obteniendo token:', error);
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // 2. Logger de requests (solo en desarrollo)
    this.axiosInstance.interceptors.request.use(
      requestLogger,
      error => Promise.reject(error)
    );

    // RESPONSE INTERCEPTORS
    
    // 1. Logger de responses (solo en desarrollo)
    this.axiosInstance.interceptors.response.use(
      responseLogger,
      errorLogger
    );

    // 2. Manejo de errores de autenticación
    this.axiosInstance.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        // Manejar errores 401 (no autorizado)
        if (error.response?.status === 401) {
          const errorMessage = (error.response?.data as any)?.message || '';
          const isEmailNotVerified =
            errorMessage.includes('no ha sido verificado') ||
            errorMessage.includes('not verified') ||
            errorMessage.includes('no está verificado') ||
            errorMessage.includes('not been verified');

          // Solo forzar logout si NO es un error de verificación de email
          if (!isEmailNotVerified) {
            console.log('🔐 Token expirado o inválido, cerrando sesión...');
            await removeAppToken();
            if (this.axiosInstance.defaults.headers.common) {
              delete this.axiosInstance.defaults.headers.common.Authorization;
            }
            authEvents.emit('forceLogout');
          } else {
            console.log('📧 Email no verificado, no se fuerza logout');
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Petición GET
   */
  async get<T>(endpoint: string, params?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, { params });
    return response.data;
  }

  /**
   * Petición POST
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data);
    return response.data;
  }

  /**
   * Petición PUT
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data);
    return response.data;
  }

  /**
   * Petición DELETE
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    return response.data;
  }

  /**
   * Obtener instancia de axios para casos especiales
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Exportar instancia única del cliente
export const apiClient = new ApiClient();
