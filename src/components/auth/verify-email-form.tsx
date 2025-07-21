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
 * Handles email verification with token
 */
export function VerifyEmailForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);

  // Get token from URL params
  const token = searchParams.get('token');

  useEffect(() => {
    // Auto-verify email when component mounts
    if (token && !isVerifying && !isVerified && !isError) {
      void handleVerifyEmail();
    }
  }, [token, isVerifying, isVerified, isError]);

  /**
   * Handle email verification
   */
  const handleVerifyEmail = async () => {
    if (!token) return;

    let loadingToastId: string | number | undefined;

    try {
      setIsVerifying(true);
      dispatch(clearError());

      // Show loading toast
      loadingToastId = showLoading({
        message: 'Verifying email...',
        description: 'Please wait while we verify your email address',
      });

      // Dispatch verify email action
      const result = await dispatch(verifyEmail(token));

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
        message: 'Unexpected error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const footerContent = (
    <>
      Already have an account?{' '}
      <Link
        href="/login"
        className="underline underline-offset-4 hover:text-primary"
      >
        Sign in
      </Link>
    </>
  );

  // If no token is provided, show error
  if (!token) {
    return (
      <AuthLayout
        title="Invalid Verification Link"
        subtitle="The email verification link is invalid or has expired"
        footerContent={footerContent}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              The email verification link is invalid or has expired. Please check your email for a valid verification link.
            </p>
          </div>

          <div className="text-center space-y-2">
            <Button
              variant="outline"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Go to Sign In
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show loading state
  if (isVerifying) {
    return (
      <AuthLayout
        title="Verifying Email"
        subtitle="Please wait while we verify your email address"
        footerContent={footerContent}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We're verifying your email address. This may take a few moments...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show success state
  if (isVerified) {
    return (
      <AuthLayout
        title="Email Verified!"
        subtitle="Your email address has been successfully verified"
        footerContent={footerContent}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              Your email address has been verified successfully! You can now sign in to your account.
            </p>
          </div>

          <div className="text-center">
            <Button
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <AuthLayout
        title="Verification Failed"
        subtitle="We couldn't verify your email address"
        footerContent={footerContent}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              The email verification link is invalid or has expired. Please check your email for a new verification link.
            </p>
          </div>

          <div className="text-center space-y-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Go to Sign In
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Default state (shouldn't reach here)
  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Please wait while we verify your email address"
      footerContent={footerContent}
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Verifying your email address...
          </p>
        </div>
      </div>
    </AuthLayout>
  );
} 