'use client';

import React from 'react';

import { useAuthInit } from '@/hooks/use-auth-init';

/**
 * Auth provider component props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication provider component
 * Handles auth initialization and provides loading state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { isInitialized, isLoading } = useAuthInit();

  // Show loading spinner while initializing auth
  if (!isInitialized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
