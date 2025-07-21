import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

/**
 * Extended Axios request config with retry flag
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * API Error response structure
 */
interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
}

/**
 * Axios instance configuration
 * Handles authentication, cookies, and error responses
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

/**
 * Cookie configuration
 */
const COOKIE_CONFIG = {
  tokenName: process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME || 'auth_token',
  refreshTokenName:
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || 'refresh_token',
  expires: parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRES_IN || '7'),
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
  sameSite: (process.env.NEXT_PUBLIC_COOKIE_SAME_SITE || 'lax') as
    | 'strict'
    | 'lax'
    | 'none',
};

/**
 * Set authentication token in cookie
 */
export const setAuthToken = (token: string) => {
  Cookies.set(COOKIE_CONFIG.tokenName, token, {
    expires: COOKIE_CONFIG.expires,
    domain: COOKIE_CONFIG.domain,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
    path: '/',
  });
};

/**
 * Set refresh token in cookie
 */
export const setRefreshToken = (token: string) => {
  Cookies.set(COOKIE_CONFIG.refreshTokenName, token, {
    expires: COOKIE_CONFIG.expires * 2, // Refresh token lasts longer
    domain: COOKIE_CONFIG.domain,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
    path: '/',
    httpOnly: false, // Note: Can't set httpOnly from client-side
  });
};

/**
 * Get authentication token from cookie
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get(COOKIE_CONFIG.tokenName);
};

/**
 * Get refresh token from cookie
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(COOKIE_CONFIG.refreshTokenName);
};

/**
 * Remove authentication tokens
 */
export const removeAuthTokens = () => {
  Cookies.remove(COOKIE_CONFIG.tokenName, {
    domain: COOKIE_CONFIG.domain,
    path: '/',
  });
  Cookies.remove(COOKIE_CONFIG.refreshTokenName, {
    domain: COOKIE_CONFIG.domain,
    path: '/',
  });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Request interceptor
 * Automatically add auth token to requests
 */
api.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(new Error((error as Error).message || 'Request failed'));
  }
);

/**
 * Response interceptor
 * Handle token refresh and error responses
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Handle 401 Unauthorized - Token expired or invalid
    // Skip token refresh for auth endpoints (login, etc.)
    if (error.response?.status === 401 && originalRequest) {
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                            originalRequest.url?.includes('/auth/forgot-password') ||
                            originalRequest.url?.includes('/auth/reset-password');
      
      // If it's an auth endpoint, don't try to refresh token
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();

      if (refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              refreshToken,
            }
          );

          const { token, refreshToken: newRefreshToken } = response.data as { token: string; refreshToken?: string };

          // Update tokens
          setAuthToken(token);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - redirect to login
          removeAuthTokens();
          window.location.href = '/login';
          return Promise.reject(new Error(refreshError instanceof Error ? refreshError.message : 'Token refresh failed'));
        }
      } else {
        // No refresh token or refresh already attempted
        removeAuthTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    // Handle other HTTP errors
    if (error.response) {
      const { status, data } = error.response as { status: number; data: ApiErrorResponse };

      switch (status) {
        case 400:
          toast.error('Bad Request', {
            description: data?.message || 'Invalid request data',
            duration: 3000,
          });
          break;
        case 403:
          toast.error('Access Denied', {
            description: 'You do not have permission to perform this action',
            duration: 3000,
          });
          break;
        case 404:
          toast.error('Not Found', {
            description: 'The requested resource was not found',
            duration: 3000,
          });
          break;
        case 422:
          toast.error('Validation Error', {
            description: data?.message || 'Please check your input',
            duration: 3000,
          });
          break;
        case 429:
          toast.error('Too Many Requests', {
            description: 'Please slow down and try again later',
            duration: 3000,
          });
          break;
        case 500:
          toast.error('Server Error', {
            description: 'Something went wrong on our end',
            duration: 4000,
          });
          break;
        default:
          toast.error('Request Failed', {
            description: data?.message || 'An unexpected error occurred',
            duration: 3000,
          });
      }
    } else if (error.request) {
      // Network error - don't show toast for logout requests
      const isLogoutRequest = error.config?.url?.includes('/auth/logout');
      if (!isLogoutRequest) {
        toast.error('Network Error', {
          description: 'Please check your internet connection',
          duration: 3000,
        });
      }
    } else {
      // Other error - don't show toast for logout requests
      const isLogoutRequest = error.config?.url?.includes('/auth/logout');
      if (!isLogoutRequest) {
        toast.error('Error', {
          description: (error as Error).message || 'An unexpected error occurred',
          duration: 3000,
        });
      }
    }

    return Promise.reject(new Error((error as Error).message || 'Request failed'));
  }
);

export default api;
