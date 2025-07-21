import { VerifyEmailForm } from '@/components/auth/verify-email-form';
import { Suspense } from 'react';

/**
 * Email verification page component
 * Renders the email verification form with token
 */
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}

/**
 * Page metadata
 */
export const metadata = {
  title: 'Verify Email',
  description: 'Verify your email address to complete your registration.',
}; 