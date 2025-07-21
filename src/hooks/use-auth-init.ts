import { useEffect } from 'react';

import { getUserProfile, initializeAuth } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getAuthToken } from '@/lib/axios';

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

      if (token && !user) {
        try {
          // Validate token and get user profile
          await dispatch(getUserProfile()).unwrap();
        } catch (error) {
          // Token is invalid, user will be redirected by axios interceptor
          console.warn('Token validation failed:', error);
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
