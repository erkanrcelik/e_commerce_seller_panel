/**
 * API Error Types
 */
export type ApiErrorType =
  | 'network'
  | 'not_found'
  | 'server'
  | 'auth'
  | 'unknown';

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  type: ApiErrorType;
  message: string;
  retry?: boolean;
  redirect?: string;
}

/**
 * Simple API Error Handler
 *
 * Handles common API errors and returns user-friendly messages
 */
export function handleApiError(error: unknown): ApiErrorResponse {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
      retry: true,
    };
  }

  // Axios errors
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response: { status: number } };

    switch (axiosError.response.status) {
      case 404:
        return {
          type: 'not_found',
          message: 'Aradığınız içerik bulunamadı.',
          redirect: '/404',
        };
      case 401:
      case 403:
        return {
          type: 'auth',
          message: 'Bu işlem için yetkiniz bulunmuyor.',
          redirect: '/auth/login',
        };
      case 500:
      case 502:
      case 503:
        return {
          type: 'server',
          message: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
          retry: true,
        };
      default:
        return {
          type: 'unknown',
          message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
          retry: true,
        };
    }
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message || 'Beklenmeyen bir hata oluştu.',
      retry: true,
    };
  }

  // Default error
  return {
    type: 'unknown',
    message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    retry: true,
  };
}

/**
 * Throw API Error
 *
 * Throws a standardized API error
 */
export function throwApiError(message: string, status = 500): never {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  throw error;
}
