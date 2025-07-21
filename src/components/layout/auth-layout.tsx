import Link from 'next/link';
import React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils';

/**
 * Props for the AuthLayout component
 */
interface AuthLayoutProps {
  /** Title of the authentication form */
  title: string;
  /** Subtitle or description text */
  subtitle: string;
  /** Main form content */
  children: React.ReactNode;
  /** Footer content with links */
  footerContent?: React.ReactNode;
  /** Error message to display */
  error?: string | null;
  /** Success message to display */
  success?: string | null;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable authentication layout component
 * Provides consistent styling and structure for auth pages
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footerContent,
  error,
  success,
  className,
  ...props
}: AuthLayoutProps) {
  return (
    <div
      className={cn('flex flex-col gap-6 w-full max-w-4xl mx-auto', className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 shadow-xl">
        <CardContent className="grid p-0 lg:grid-cols-2">
          {/* Form Section */}
          <div className="p-8 lg:p-12 flex items-center">
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-balance">{subtitle}</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Main Form Content */}
              {children}

              {/* Footer Links */}
              {footerContent && (
                <div className="text-center text-sm">{footerContent}</div>
              )}
            </div>
          </div>

          {/* Side Image Section */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/5 relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
            <div className="relative h-full flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Secure & Trusted
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                  Your data is protected with enterprise-grade security. Shop
                  with confidence on our platform.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Privacy */}
      <div className="text-muted-foreground text-center text-xs text-balance">
        By continuing, you agree to our{' '}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
