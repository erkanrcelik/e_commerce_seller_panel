import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { parseApiErrorMessage, type ApiErrorData } from '@/lib/api-error';
import { AuthService } from '@/services/seller-auth.service';
import type {
  AuthError,
  AuthResponse,
  AuthState,
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  User
} from '@/types/seller-auth';

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
        response?: { data?: any };
      };
      if (axiosError.response?.data) {
        const errorMessage = parseApiErrorMessage(axiosError.response.data as ApiErrorData);
        return rejectWithValue({
          message: errorMessage || 'Login failed',
          code: 'LOGIN_ERROR',
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
 * Register user async thunk
 * @param userData - User registration data
 */
export const registerUser = createAsyncThunk<
  { message: string },
  RegisterFormData,
  { rejectValue: AuthError }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    return await AuthService.register(userData);
  } catch (error: unknown) {
    console.error('Register error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: any };
      };
      if (axiosError.response?.data) {
        const errorMessage = parseApiErrorMessage(axiosError.response.data as ApiErrorData);
        return rejectWithValue({
          message: errorMessage || 'Registration failed',
          code: 'REGISTER_ERROR',
        });
      }
    }

    return rejectWithValue({
      message: 'Registration failed',
      code: 'REGISTER_ERROR',
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
 * @param params - Email verification parameters
 */
export const verifyEmail = createAsyncThunk<
  { message: string },
  { token: string; email: string },
  { rejectValue: AuthError }
>('auth/verifyEmail', async (params, { rejectWithValue }) => {
  try {
    return await AuthService.verifyEmail(params.token, params.email);
  } catch (error: unknown) {
    console.error('Email verification error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data) {
        return rejectWithValue({
          message: axiosError.response.data.message || 'Email verification failed',
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
 * Resend verification email async thunk
 * @param email - User email for verification
 */
export const resendVerification = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: AuthError }
>('auth/resendVerification', async (email, { rejectWithValue }) => {
  try {
    return await AuthService.resendVerification(email);
  } catch (error: unknown) {
    console.error('Resend verification error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data) {
        return rejectWithValue({
          message: axiosError.response.data.message || 'Failed to resend verification email',
          code: axiosError.response.data.code || 'RESEND_VERIFICATION_ERROR',
        });
      }
    }

    return rejectWithValue({
      message: 'Failed to resend verification email',
      code: 'RESEND_VERIFICATION_ERROR',
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
    const userInfo = await AuthService.getUserInfo();
    
    // Transform the API response to match User interface
    const user: User = {
      id: userInfo.id,
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      role: userInfo.role as 'admin' | 'customer' | 'seller',
      isEmailVerified: userInfo.isEmailVerified,
      isActive: userInfo.isActive,
      avatar: undefined, // API doesn't return avatar
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
    };
    
    return user;
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
 * Refresh token async thunk
 */
export const refreshToken = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: AuthError }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    return await AuthService.refreshToken();
  } catch (error: unknown) {
    console.error('Refresh token error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data) {
        return rejectWithValue({
          message: axiosError.response.data.message || 'Token refresh failed',
          code: axiosError.response.data.code || 'REFRESH_TOKEN_ERROR',
        });
      }
    }

    return rejectWithValue({
      message: 'Token refresh failed',
      code: 'REFRESH_TOKEN_ERROR',
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

    // Register user cases
    builder
      .addCase(registerUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'authenticated';
        state.user = null; // Registration doesn't return a user object directly
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload?.message || 'Registration failed';
      });

    // Logout user cases
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.status = 'unauthenticated';
      state.error = null;
    });

    // Logout user cases - also handle rejected case
    builder.addCase(logoutUser.rejected, state => {
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
        state.error = (action.payload as AuthError)?.message || 'Failed to get profile';
      });

    // Refresh token cases
    builder
      .addCase(refreshToken.pending, state => {
        // Don't change status during refresh
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        // Update user if provided in response
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.status = 'authenticated';
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = (action.payload as AuthError)?.message || 'Token refresh failed';
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
        state.error = (action.payload as AuthError)?.message || 'Failed to send reset email';
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
        state.error = (action.payload as AuthError)?.message || 'Password reset failed';
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
        state.error = (action.payload as AuthError)?.message || 'Email verification failed';
      });

    // Resend verification cases
    builder
      .addCase(resendVerification.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, state => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.status = 'idle';
        state.error = (action.payload as AuthError)?.message || 'Failed to resend verification email';
      });
  },
});

export const { clearError, setUser, resetAuth, initializeAuth } =
  authSlice.actions;

export default authSlice.reducer;
