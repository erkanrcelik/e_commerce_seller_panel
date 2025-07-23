/**
 * API Error Types
 */
export type ApiErrorType =
  | 'network'
  | 'not_found'
  | 'server'
  | 'auth'
  | 'validation'
  | 'unknown';

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  type: ApiErrorType;
  message: string;
  retry?: boolean;
  redirect?: string;
  details?: string[];
}

/**
 * API Validation Error Item
 */
export interface ApiValidationError {
  origin: string;
  code: string;
  format?: string;
  pattern?: string;
  path: string[];
  message: string;
}

/**
 * API Error Response Interface
 */
export interface ApiErrorData {
  statusCode?: number;
  timestamp?: string;
  path?: string;
  method?: string;
  message: string | ApiValidationError[];
  requestId?: string;
  userAgent?: string;
}

/**
 * Parse API Error Message
 * 
 * Handles both validation error arrays and simple string messages
 */
export function parseApiErrorMessage(errorResponse: ApiErrorData): string {
  try {
    // If message is a JSON string containing validation errors
    if (typeof errorResponse.message === 'string' && errorResponse.message.startsWith('[')) {
      const validationErrors = JSON.parse(errorResponse.message) as ApiValidationError[];
      
      // Extract field-specific error messages
      const fieldErrors = validationErrors.map(error => {
        const fieldName = error.path[0] || 'field';
        return `${fieldName}: ${error.message}`;
      });
      
      return fieldErrors.join(', ');
    }
    
    // If message is a simple string (direct error message)
    if (typeof errorResponse.message === 'string') {
      return errorResponse.message;
    }
    
    // If message is an array of validation errors (direct array)
    if (Array.isArray(errorResponse.message)) {
      const validationErrors = errorResponse.message;
      const fieldErrors = validationErrors.map(error => {
        const fieldName = error.path[0] || 'field';
        return `${fieldName}: ${error.message}`;
      });
      return fieldErrors.join(', ');
    }
    
    return 'An error occurred. Please try again.';
  } catch (error) {
    console.error('Error parsing API error message:', error);
    return 'An error occurred. Please try again.';
  }
}

/**
 * Enhanced API Error Handler
 *
 * Handles common API errors and returns user-friendly messages
 * Updated to handle both validation error arrays and simple string messages
 */
export function handleApiError(error: unknown): ApiErrorResponse {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: 'Please check your internet connection and try again.',
      retry: true,
    };
  }

  // Axios errors
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { 
      response: { 
        status: number; 
        data?: ApiErrorData;
      } 
    };

    const status = axiosError.response.status;
    const errorData = axiosError.response.data;

    // Parse error message from API response
    const errorMessage = errorData ? parseApiErrorMessage(errorData) : 'An error occurred.';

    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: errorMessage,
          retry: false,
        };
      case 404:
        return {
          type: 'not_found',
          message: 'The requested content was not found.',
          redirect: '/404',
        };
      case 401:
      case 403:
        return {
          type: 'auth',
          message: 'You do not have permission for this operation.',
          redirect: '/auth/login',
        };
      case 500:
      case 502:
      case 503:
        return {
          type: 'server',
          message: 'Server error occurred. Please try again later.',
          retry: true,
        };
      default:
        return {
          type: 'unknown',
          message: errorMessage,
          retry: true,
        };
    }
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message || 'An unexpected error occurred.',
      retry: true,
    };
  }

  // Default error
  return {
    type: 'unknown',
    message: 'An error occurred. Please try again.',
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
