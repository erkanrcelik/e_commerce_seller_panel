/**
 * Authentication status states
 */
export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated';

/**
 * User data structure according to API documentation
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer' | 'seller';
  isEmailVerified: boolean;
  isActive: boolean;
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}
  
/**
 * Login form data structure with platform
 */
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register form data structure
 */
export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: 'admin' | 'seller' | 'customer';
}

/**
 * Password reset request form data
 */
export interface ForgotPasswordFormData {
  email: string;
}

/**
 * Verify code form data for password reset
 */
export interface VerifyCodeFormData {
  code: string;
  email: string;
}

/**
 * Password reset form data with token and email
 */
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
  email: string;
}

/**
 * Email verification data with token and email
 */
export interface EmailVerificationData {
  token: string;
  email: string;
}

/**
 * API response structure for authentication
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

/**
 * API error response structure
 */
export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

/**
 * Refresh token data structure
 */
export interface RefreshTokenData {
  refreshToken: string;
}

/**
 * Resend verification data structure
 */
export interface ResendVerificationData {
  email: string;
}

/**
 * User info response structure
 */
export interface UserInfoResponse {
  user: User;
}
