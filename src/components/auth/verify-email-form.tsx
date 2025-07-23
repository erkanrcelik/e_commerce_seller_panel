'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { clearError, verifyEmail } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/hooks/redux';
import { useToast } from '@/hooks/use-toast';

import { AuthLayout } from '@/components/layout/auth-layout';

/**
 * Email verification form component
 * Handles email verification with token and email from URL parameters
 */
export function VerifyEmailForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);

  // Get token and email from URL params
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Auto-verify email when component mounts
    if (token && email && !isVerifying && !isVerified && !isError) {
      void handleVerifyEmail();
    }
  }, [token, email, isVerifying, isVerified, isError]);

  /**
   * Handle email verification
   */ 
  const handleVerifyEmail = async () => {
    if (!token || !email) return;

    let loadingToastId: string | number | undefined;

    try {
      setIsVerifying(true);
      dispatch(clearError());

      // Show loading toast
      loadingToastId = showLoading({
        message: 'Verifying email...',
        description: 'Please wait while we verify your email address',
      });

      // Dispatch verify email action with token and email
      const result = await dispatch(verifyEmail({ token, email }));

      // Dismiss loading toast
      if (loadingToastId) dismiss(loadingToastId);

      if (verifyEmail.fulfilled.match(result)) {
        // Success
        setIsVerified(true);
        showSuccess({
          message: 'Email verified successfully!',
          description: 'Your email address has been verified. You can now sign in to your account.',
          duration: 5000,
          action: {
            label: 'Sign In',
            onClick: () => {
              router.push('/login');
            },
          },
        });

        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else if (verifyEmail.rejected.match(result)) {
        // Error
        setIsError(true);
        const errorMessage = result.payload?.message || 'Email verification failed';
        showError({
          message: 'Email verification failed',
          description: errorMessage,
          action: {
            label: 'Try again',
            onClick: () => {
              window.location.reload();
            },
          },
        });
      }
    } catch (error) {
      // Dismiss loading toast if still showing
      if (loadingToastId) dismiss(loadingToastId);

      console.error('Email verification error:', error);
      setIsError(true);
      showError({
        message: 'Email verification failed',
        description: 'An unexpected error occurred. Please try again.',
        action: {
          label: 'Try again',
          onClick: () => {
            window.location.reload();
          },
        },
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // If no token or email provided, show error
  if (!token || !email) {
    return (
      <AuthLayout
        title="Invalid Verification Link"
        subtitle="The verification link is invalid or has expired"
      >
        <div className="w-full max-w-md mx-auto">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The verification link is invalid or has expired. Please check your email for a valid link.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> For testing purposes, the verification code is always <strong>1234</strong>.
              </p>
            </div>
            <Button asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show verification status
  if (isVerified) {
    return (
      <AuthLayout
        title="Email Verified!"
        subtitle="Your email address has been successfully verified"
      >
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Your email address has been successfully verified. You can now sign in to your account.
            </p>
          </div>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (isError) {
    return (
      <AuthLayout
        title="Verification Failed"
        subtitle="We couldn't verify your email address"
      >
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We couldn't verify your email address. The link may be invalid or expired.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> For testing purposes, the verification code is always <strong>1234</strong>.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Button asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show loading state
  return (
    <AuthLayout
      title="Verifying Email..."
      subtitle="Please wait while we verify your email address"
    >
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your email address.
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> For testing purposes, the verification code is always <strong>1234</strong>.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
} 