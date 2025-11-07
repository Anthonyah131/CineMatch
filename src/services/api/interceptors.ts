import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { DEV_CONFIG } from '../../config/api';

/**
 * Interceptor de Request - Logs de peticiones salientes
 */
export const requestLogger = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  if (DEV_CONFIG.ENABLE_LOGS) {
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url || '';

    console.log(`📤 ${method} ${url}`, {
      headers: {
        'Content-Type': config.headers?.['Content-Type'] || 'N/A',
        Authorization: config.headers?.Authorization ? '✓ Present' : '✗ None',
      },
      ...(config.params && { params: config.params }),
      ...(config.data && { body: config.data }),
    });
  }

  return config;
};

/**
 * Interceptor de Response - Logs de respuestas exitosas
 */
export const responseLogger = (response: AxiosResponse): AxiosResponse => {
  if (DEV_CONFIG.ENABLE_LOGS) {
    const method = response.config.method?.toUpperCase() || 'GET';
    const url = response.config.url || '';
    const status = response.status;

    console.log(`📥 ${status} ${method} ${url}`, response.data);
  }

  return response;
};

/**
 * Interceptor de Error - Logs de errores
 */
export const errorLogger = (error: AxiosError): Promise<never> => {
  if (DEV_CONFIG.ENABLE_LOGS) {
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const url = error.config?.url || 'UNKNOWN';
    const status = error.response?.status || 'NO_RESPONSE';

    const logData: Record<string, any> = {
      message: error.message,
    };

    if (error.response?.data) {
      logData.errorData = error.response.data;
    }

    console.error(`❌ ${status} ${method} ${url}`, logData);
  }

  return Promise.reject(error);
};
