import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

/**
 * Forgot password page component
 * Renders the forgot password form for password reset
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

/**
 * Page metadata
 */
export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your password to regain access to your seller account.',
};
