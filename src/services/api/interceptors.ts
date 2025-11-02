/**
 * Interceptor simple para logging de requests y responses
 */

interface RequestLog {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
}

interface ResponseLog {
  url: string;
  status: number;
  data?: any;
  error?: string;
}

/**
 * Log de request antes de enviarlo
 */
export const logRequest = (config: RequestLog): void => {
  console.log('📤 API Request:', {
    method: config.method,
    url: config.url,
    ...(config.body && { body: config.body }),
  });
};

/**
 * Log de response exitosa
 */
export const logResponse = (response: ResponseLog): void => {
  console.log('📥 API Response:', {
    url: response.url,
    status: response.status,
    data: response.data,
  });
};

/**
 * Log de error
 */
export const logError = (error: ResponseLog): void => {
  console.error('❌ API Error:', {
    url: error.url,
    status: error.status,
    error: error.error,
  });
};
