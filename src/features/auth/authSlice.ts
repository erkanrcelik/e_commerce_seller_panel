import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthService } from '@/services/auth.service';

import type {
  AuthError,
  AuthResponse,
  AuthState,
  ForgotPasswordFormData,
  LoginFormData,
  ResetPasswordFormData,
  User,
} from '@/types/auth';

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

/**
 * Login user async thunk
 * @param credentials - User login credentials
 */
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginFormData,
  { rejectValue: AuthError }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    return await AuthService.login(credentials);
  } catch (error: unknown) {
    console.error('Login error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data) {
        return rejectWithValue({
          message: axiosError.response.data.message || 'Login failed',
          code: axiosError.response.data.code || 'LOGIN_ERROR',
        });
      }
    }

    return rejectWithValue({
      message: 'Network error occurred',
      code: 'NETWORK_ERROR',
    });
  }
});

/**
 * Forgot password async thunk
 * @param email - User email for password reset
 */
export const forgotPassword = createAsyncThunk<
  { message: string },
  ForgotPasswordFormData,
  { rejectValue: AuthError }
>('auth/forgotPassword', async (emailData, { rejectWithValue }) => {
  try {
    return await AuthService.forgotPassword(emailData);
  } catch (error: unknown) {
    console.error('Forgot password error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data) {
        return rejectWithValue({
          message:
            axiosError.response.data.message || 'Failed to send reset email',
          code: axiosError.response.data.code || 'FORGOT_PASSWORD_ERROR',
        });
      }
    }

    return rejectWithValue({
      message: 'Failed to send reset email',
      code: 'FORGOT_PASSWORD_ERROR',
    });
  }
});

/**
 * Reset password async thunk
 * @param resetData - Password reset data with token
 */
export const resetPassword = createAsyncThunk<
  { message: string },
  ResetPasswordFormData,
  { rejectValue: AuthError }
>('auth/resetPassword', async (resetData, { rejectWithValue }) => {
  try {
    return await AuthService.resetPassword(resetData);
  } catch (error: unknown) {
    console.error('Reset password error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data) {
        return rejectWithValue({
          message: axiosError.response.data.message || 'Password reset failed',
          code: axiosError.response.data.code || 'RESET_PASSWORD_ERROR',
        });
      }
    }

    return rejectWithValue({
      message: 'Password reset failed',
      code: 'RESET_PASSWORD_ERROR',
    });
  }
});

/**
 * Verify email async thunk
 * @param token - Email verification token
 */
export const verifyEmail = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: AuthError }
>('auth/verifyEmail', async (token, { rejectWithValue }) => {
  try {
    return await AuthService.verifyEmail(token);
  } catch (error: unknown) {
    console.error('Email verification error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data) {
        return rejectWithValue({
          message:
            axiosError.response.data.message || 'Email verification failed',
          code: axiosError.response.data.code || 'EMAIL_VERIFICATION_ERROR',
        });
      }
    }

    return rejectWithValue({
      message: 'Email verification failed',
      code: 'EMAIL_VERIFICATION_ERROR',
    });
  }
});

/**
 * Logout user async thunk
 */
export const logoutUser = createAsyncThunk<void, void>(
  'auth/logoutUser',
  async () => {
    await AuthService.logout();
  }
);

/**
 * Get user profile async thunk
 */
export const getUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: AuthError }
>('auth/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    return await AuthService.getProfile();
  } catch (error: unknown) {
    console.error('Get profile error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data) {
        return rejectWithValue({
          message: axiosError.response.data.message || 'Failed to get profile',
          code: axiosError.response.data.code || 'PROFILE_ERROR',
        });
      }
    }

    return rejectWithValue({
      message: 'Failed to get profile',
      code: 'PROFILE_ERROR',
    });
  }
});

/**
 * Authentication slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Clear authentication error
     */
    clearError: state => {
      state.error = null;
    },

    /**
     * Set user data (for client-side user updates)
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = 'authenticated';
    },

    /**
     * Clear authentication state
     */
    resetAuth: state => {
      state.user = null;
      state.status = 'unauthenticated';
      state.error = null;
    },

    /**
     * Initialize auth state from stored token
     */
    initializeAuth: state => {
      // This will be called on app initialization
      // The actual token validation will be handled by axios interceptors
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    // Login user cases
    builder
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload?.message || 'Login failed';
      });
      
    // Logout user cases
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.status = 'unauthenticated';
      state.error = null;
    });

    // Get profile cases
    builder
      .addCase(getUserProfile.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = action.payload?.message || 'Failed to get profile';
      });

    // Forgot password cases
    builder
      .addCase(forgotPassword.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload?.message || 'Failed to send reset email';
      });

    // Reset password cases
    builder
      .addCase(resetPassword.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload?.message || 'Password reset failed';
      });

    // Verify email cases
    builder
      .addCase(verifyEmail.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, state => {
        state.status = 'idle';
        state.error = null;
        // Update user verification status if user is logged in
        if (state.user) {
          state.user.isEmailVerified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload?.message || 'Email verification failed';
      });
  },
});

export const { clearError, setUser, resetAuth, initializeAuth } =
  authSlice.actions;
export default authSlice.reducer;
