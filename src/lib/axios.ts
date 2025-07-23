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
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
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
  tokenName: process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME || 'accessToken',
  refreshTokenName:
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || 'refreshToken',
  expires: parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRES_IN || '7'),
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined, // undefined for localhost
  secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true' || false, // false for localhost
  sameSite: (process.env.NEXT_PUBLIC_COOKIE_SAME_SITE || 'lax') as
    | 'strict'
    | 'lax'
    | 'none',
};

/**
 * Set authentication token in cookie
 */
export const setAuthToken = (token: string) => {
  console.log('Setting auth token in cookie:', token);
  console.log('Cookie config:', COOKIE_CONFIG);
  
  Cookies.set(COOKIE_CONFIG.tokenName, token, {
    expires: COOKIE_CONFIG.expires,
    domain: COOKIE_CONFIG.domain,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
    path: '/',
  });
  
  console.log('Auth token cookie set');
};

/**
 * Set refresh token in cookie
 */
export const setRefreshToken = (token: string) => {
  console.log('Setting refresh token in cookie:', token);
  
  Cookies.set(COOKIE_CONFIG.refreshTokenName, token, {
    expires: COOKIE_CONFIG.expires * 2, // Refresh token lasts longer
    domain: COOKIE_CONFIG.domain,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
    path: '/',
    httpOnly: false, // Note: Can't set httpOnly from client-side
  });
  
  console.log('Refresh token cookie set');
};

/**
 * Get authentication token from cookie
 */
export const getAuthToken = (): string | undefined => {
  const token = Cookies.get(COOKIE_CONFIG.tokenName);
  console.log('Getting auth token from cookie:', token);
  return token;
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
 * Token validation utilities
 */
const tokenUtils = {
  /**
   * Decode JWT token
   */
  decodeToken: (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload) as Record<string, unknown>;
    } catch {
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (token: string) => {
    if (!token) return true;

    const decoded = tokenUtils.decodeToken(token);
    if (!decoded) return true;

    // Check if token expires in next 5 minutes
    const currentTime = Date.now() / 1000;
    return (decoded as { exp: number }).exp < (currentTime + 300);
  },

  /**
   * Get time left for token (in seconds)
   */
  getTokenTimeLeft: (token: string) => {
    if (!token) return 0;

    const decoded = tokenUtils.decodeToken(token);
    if (!decoded) return 0;

    const currentTime = Date.now() / 1000;
    return Math.max(0, (decoded as { exp: number }).exp - currentTime);
  }
};

/**
 * Request interceptor
 * Automatically add auth token to requests
 */
api.interceptors.request.use(
  config => {
    const token = getAuthToken();
    console.log('Request interceptor - token:', token);
    
    if (token && token !== 'undefined') {
      // Check if token is about to expire (within 5 minutes)
      if (tokenUtils.isTokenExpired(token)) {
        // Token is expired, try to refresh it
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          // This will be handled by response interceptor
          // For now, continue with current token
          console.warn('Token is expired, will attempt refresh on response');
        }
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', `Bearer ${token}`);
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
                            originalRequest.url?.includes('/auth/reset-password') ||
                            originalRequest.url?.includes('/auth/refresh');
      
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

          const { accessToken, refreshToken: newRefreshToken } = response.data as { 
            accessToken: string; 
            refreshToken?: string 
          };

          // Update tokens
          setAuthToken(accessToken);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - redirect to login
          removeAuthTokens();
          
          // Clear any stored user data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            sessionStorage.clear();
          }
          
          window.location.href = '/login';
          return Promise.reject(new Error(refreshError instanceof Error ? refreshError.message : 'Token refresh failed'));
        }
      } else {
        // No refresh token or refresh already attempted
        removeAuthTokens();
        
        // Clear any stored user data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          sessionStorage.clear();
        }
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    // Handle other HTTP errors
    if (error.response) {
      const { status, data } = error.response as { status: number; data: ApiErrorResponse };

      // Only show toast on client-side
      if (typeof window !== 'undefined') {
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
      }
    } else if (error.request) {
      // Network error - don't show toast for logout requests
      const isLogoutRequest = error.config?.url?.includes('/auth/logout');
      if (!isLogoutRequest && typeof window !== 'undefined') {
        toast.error('Network Error', {
          description: 'Please check your internet connection',
          duration: 3000,
        });
      }
    } else {
      // Other error - don't show toast for logout requests
      const isLogoutRequest = error.config?.url?.includes('/auth/logout');
      if (!isLogoutRequest && typeof window !== 'undefined') {
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
