'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clearError, resetPassword } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useToast } from '@/hooks/use-toast';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/utils/validation';

import { AuthLayout } from '@/components/layout/auth-layout';

/**
 * Reset password form component
 * Handles password reset with token and email
 */
export function ResetPasswordForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useAppSelector(state => state.auth);
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const isLoading = status === 'loading';

  // Get token from URL params
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token || '',
      email: '', // Will be filled from URL or user input
    },
  });

  /**
   * Handle form submission
   * @param data - Form data from React Hook Form
   */
  const onSubmit = async (data: ResetPasswordFormData) => {
    let loadingToastId: string | number | undefined;

    try {
      // Clear any previous errors
      dispatch(clearError());

      // Show loading toast
      loadingToastId = showLoading({
        message: 'Resetting password...',
        description: 'Please wait while we update your password',
      });

      // Dispatch reset password action
      const result = await dispatch(resetPassword(data));

      // Dismiss loading toast
      if (loadingToastId) dismiss(loadingToastId);

      if (resetPassword.fulfilled.match(result)) {
        // Success
        showSuccess({
          message: 'Password reset successfully!',
          description: 'Your password has been updated. You can now sign in with your new password.',
          duration: 4000,
          action: {
            label: 'Sign In',
            onClick: () => {
              router.push('/login');
            },
          },
        });
        
        // Reset form
        reset();
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (resetPassword.rejected.match(result)) {
        // Error
        const errorMessage = result.payload?.message || 'Password reset failed';
        showError({
          message: 'Password reset failed',
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

      console.error('Password reset error:', error);
      showError({
        message: 'Password reset failed',
        description: 'An unexpected error occurred. Please try again.',
        action: {
          label: 'Try again',
          onClick: () => {
            window.location.reload();
          },
        },
      });
    }
  };

  // If no token provided, show error
  if (!token) {
    return (
      <AuthLayout
        title="Invalid Reset Link"
        subtitle="The password reset link is invalid or has expired"
      >
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The password reset link is invalid or has expired. Please request a new password reset link.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> For testing purposes, the reset code is always <strong>1234</strong>.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Button asChild>
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account"
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
        {/* Static Code Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> For testing purposes, the reset code is always <strong>1234</strong>.
          </p>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your new password"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Hidden Token Field */}
        <input type="hidden" {...register('token')} />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
} 