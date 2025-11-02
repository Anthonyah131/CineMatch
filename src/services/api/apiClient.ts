import axios, { AxiosInstance, AxiosError } from 'axios';
import { getAppToken, removeAppToken } from '../storageService';
import { API_CONFIG, DEV_CONFIG } from '../../config/api';
import { SimpleEventEmitter } from '../../utils/SimpleEventEmitter';

/**
 * Event emitter para eventos de autenticación
 */
export const authEvents = new SimpleEventEmitter();

/**
 * Cliente HTTP con axios e interceptores
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
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  /**
   * Interceptor de request para agregar token y logs
   */
  private setupRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      async config => {
        try {
          // Agregar token si existe
          const token = await getAppToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          // Logs en desarrollo
          if (DEV_CONFIG.ENABLE_LOGS) {
            console.log(
              `📤 API Request: ${config.method?.toUpperCase()} ${config.url}`,
              {
                headers: config.headers,
                data: config.data,
              },
            );
          }
        } catch (error) {
          console.error('Error getting token:', error);
        }
        return config;
      },
      error => {
        if (DEV_CONFIG.ENABLE_LOGS) {
          console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * Interceptor de response para logs y manejo de errores
   */
  private setupResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      response => {
        // Logs en desarrollo
        if (DEV_CONFIG.ENABLE_LOGS) {
          console.log(
            `📥 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
            {
              status: response.status,
              data: response.data,
            },
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        // Logs de error en desarrollo
        if (DEV_CONFIG.ENABLE_LOGS) {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        }

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
            console.log('🔐 Token expirado, cerrando sesión...');
            await removeAppToken();
            delete this.axiosInstance.defaults.headers.common.Authorization;
            authEvents.emit('forceLogout');
          } else {
            console.log('📧 Email no verificado, no se fuerza logout');
          }
        }

        return Promise.reject(error);
      },
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
