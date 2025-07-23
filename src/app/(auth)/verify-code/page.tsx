import { VerifyCodeForm } from '@/components/auth/verify-code-form';
import { Suspense } from 'react';

/**
 * Verify code page component
 * Renders the code verification form for password reset
 */
function VerifyCodePageContent() {
  return <VerifyCodeForm />;
}

/**
 * Verify code page with Suspense boundary
 */
export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyCodePageContent />
    </Suspense>
  );
}

/**
 * Page metadata
 */
export const metadata = {
  title: 'Verify Code',
  description: 'Enter the verification code sent to your email to complete the process.',
}; 