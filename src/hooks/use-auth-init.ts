import { useEffect } from 'react';

import { getUserProfile, initializeAuth, refreshToken } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getAuthToken, getRefreshToken } from '@/lib/axios';

/**
 * Authentication initialization hook
 * Initializes auth state on app startup and validates stored tokens
 */
export function useAuthInit() {
  const dispatch = useAppDispatch();
  const { status, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      // Initialize auth state
      dispatch(initializeAuth());

      // Check if we have a token
      const token = getAuthToken();
      const refreshTokenValue = getRefreshToken();

      if (token && !user) {
        try {
          // Validate token and get user profile
          await dispatch(getUserProfile()).unwrap();
        } catch {
          // Token is invalid, try to refresh
          if (refreshTokenValue) {
            try {
              await dispatch(refreshToken()).unwrap();
            } catch (refreshError) {
              // Refresh failed, user will be redirected by axios interceptor
              console.warn('Token refresh failed:', refreshError);
            }
          }
        }
      }
    };

    // Only initialize once
    if (status === 'idle') {
      void initAuth();
    }
  }, [dispatch, status, user]);

  return {
    isInitialized: status !== 'idle',
    isAuthenticated: status === 'authenticated' && !!user,
    isLoading: status === 'loading',
    user,
  };
}
