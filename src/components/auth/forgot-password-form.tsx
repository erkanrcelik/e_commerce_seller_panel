'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
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
  const { status } = useAppSelector(state => state.auth);
  const { showSuccess, showError, showLoading, showInfo, dismiss } = useToast();
  const isLoading = status === 'loading';
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
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
        message: 'Sending reset instructions...',
        description: 'Please wait while we process your request',
      });

      // Dispatch forgot password action
      const result = await dispatch(forgotPassword(data));

      // Dismiss loading toast
      if (loadingToastId) dismiss(loadingToastId);

      if (forgotPassword.fulfilled.match(result)) {
        // Success
        setIsSuccess(true);
        showSuccess({
          message: 'Reset instructions sent!',
          description: `If an account with ${data.email} exists, we've sent password reset instructions to your email.`,
          duration: 6000,
          action: {
            label: 'Check Email',
            onClick: () => {
              // Open email client (this is a nice UX touch)
              window.open('mailto:', '_blank');
            },
          },
        });
        reset();
      } else if (forgotPassword.rejected.match(result)) {
        // Error (but we might want to show success anyway for security)
        const errorMessage =
          result.payload?.message || 'Failed to send reset email';
        showError({
          message: 'Reset request failed',
          description: errorMessage,
          action: {
            label: 'Try again',
            onClick: () => {
              // Focus on email field
              const emailInput = document.getElementById('email');
              emailInput?.focus();
            },
          },
        });
      }
    } catch (error) {
      // Dismiss loading toast if still showing
      if (loadingToastId) dismiss(loadingToastId);

      console.error('Forgot password error:', error);
      showError({
        message: 'Unexpected error',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  /**
   * Handle sending another email
   */
  const handleSendAnother = () => {
    setIsSuccess(false);
    // Get the last email value and pre-fill it
    const lastEmail = getValues('email');
    if (lastEmail) {
      // You could also auto-submit here
      showInfo({
        message: 'Form ready',
        description: `Ready to send another email to ${lastEmail}`,
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

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a link to reset your password"
      footerContent={footerContent}
    >
      {!isSuccess ? (
        <form
          onSubmit={e => {
            void handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send reset instructions'}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              If an account with that email exists, we&apos;ve sent password
              reset instructions to your email address. Please check your inbox
              and follow the instructions to reset your password.
            </p>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleSendAnother}
              className="w-full"
            >
              Send another email
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
