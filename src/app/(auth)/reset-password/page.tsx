import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Suspense } from 'react';

/**
 * Reset password page component
 * Renders the reset password form for password reset with token
 */
function ResetPasswordPageContent() {
  return <ResetPasswordForm />;
}

/**
 * Reset password page with Suspense boundary
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

/**
 * Page metadata
 */
export const metadata = {
  title: 'Reset Password',
  description: 'Create a new password for your seller account.',
}; 