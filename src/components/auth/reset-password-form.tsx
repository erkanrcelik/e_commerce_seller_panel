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
 * Handles password reset with token
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
              // Focus on password field
              const passwordInput = document.getElementById('password');
              passwordInput?.focus();
            },
          },
        });
      }
    } catch (error) {
      // Dismiss loading toast if still showing
      if (loadingToastId) dismiss(loadingToastId);

      console.error('Reset password error:', error);
      showError({
        message: 'Unexpected error',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  const footerContent = (
    <>
      Remember your password?{' '}
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
        title="Invalid Reset Link"
        subtitle="The password reset link is invalid or has expired"
        footerContent={footerContent}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              The password reset link is invalid or has expired. Please request a new password reset link.
            </p>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => router.push('/forgot-password')}
              className="w-full"
            >
              Request New Reset Link
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below"
      footerContent={footerContent}
    >
      <form
        onSubmit={e => {
          void handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a new password"
            {...register('password')}
            className={errors.password ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
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
            className={errors.confirmPassword ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Hidden Token Field */}
        <input type="hidden" {...register('token')} />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting password...' : 'Reset password'}
        </Button>
      </form>
    </AuthLayout>
  );
} 