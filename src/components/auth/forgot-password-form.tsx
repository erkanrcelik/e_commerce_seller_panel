'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clearError, forgotPassword } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useToast } from '@/hooks/use-toast';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/utils/validation';

import { AuthLayout } from '@/components/layout/auth-layout';

/**
 * Forgot password form component
 * Handles password reset request
 */
export function ForgotPasswordForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status } = useAppSelector(state => state.auth);
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const isLoading = status === 'loading';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * Handle form submission
   * @param data - Form data from React Hook Form
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    let loadingToastId: string | number | undefined;

    try {
      // Clear any previous errors
      dispatch(clearError());

      // Show loading toast
      loadingToastId = showLoading({
        message: 'Sending reset email...',
        description: 'Please wait while we send the password reset link',
      });

      // Dispatch forgot password action
      const result = await dispatch(forgotPassword(data));

      // Dismiss loading toast
      if (loadingToastId) dismiss(loadingToastId);

      if (forgotPassword.fulfilled.match(result)) {
        // Success
        showSuccess({
          message: 'Reset email sent!',
          description: 'We\'ve sent a verification code to your email address. Please check your inbox.',
          duration: 5000,
        });
        
        // Reset form
        reset();
        
        // Redirect to verify code page with email
        router.push(`/verify-code?email=${encodeURIComponent(data.email)}`);
      } else if (forgotPassword.rejected.match(result)) {
        // Error
        const errorMessage = result.payload?.message || 'Failed to send reset email';
        showError({
          message: 'Failed to send reset email',
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

      console.error('Forgot password error:', error);
      showError({
        message: 'Failed to send reset email',
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

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
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

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
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
