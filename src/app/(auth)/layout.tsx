import React from 'react';

/**
 * Props for the AuthLayout component
 */
interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Authentication layout component
 * Provides consistent layout and styling for all auth pages
 * This layout is applied to all routes under the (auth) route group
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl">{children}</div>
    </div>
  );
}

/**
 * Layout metadata
 */
export const metadata = {
  title: {
    template: '%s | E-Commerce Platform',
    default: 'Authentication | E-Commerce Platform',
  },
  description: 'Secure authentication for your e-commerce account.',
};
