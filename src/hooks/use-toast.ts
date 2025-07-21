import { toast } from "sonner";

/**
 * Toast notification types
 */
export type ToastType = "success" | "error" | "warning" | "info" | "loading";

/**
 * Toast options interface
 */
export interface ToastOptions {
  /** Toast message */
  message: string;
  /** Optional description */
  description?: string | React.ReactNode;
  /** Toast duration in milliseconds (default: 3000ms) */
  duration?: number;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast notification hook
 * Provides type-safe toast notifications with consistent styling
 *
 * Features:
 * - Auto-dismiss after 3 seconds by default
 * - Close button on all toasts
 * - Progress bar showing time remaining
 * - Rich colors for different toast types
 * - Theme-aware styling
 *
 * @example
 * ```tsx
 * const { showSuccess, showError } = useToast()
 *
 * showSuccess({ message: 'Login successful!' })
 * showError({ message: 'Login failed', description: 'Please check your credentials' })
 * ```
 */
export function useToast() {
  /**
   * Show success toast notification
   */
  const showSuccess = ({
    message,
    description,
    duration = 3000,
    action,
  }: ToastOptions) => {
    return toast.success(message, {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  };

  /**
   * Show error toast notification
   */
  const showError = ({
    message,
    description,
    duration = 3000,
    action,
  }: ToastOptions) => {
    return toast.error(message, {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  };

  /**
   * Show warning toast notification
   */
  const showWarning = ({
    message,
    description,
    duration = 3000,
    action,
  }: ToastOptions) => {
    return toast.warning(message, {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  };

  /**
   * Show info toast notification
   */
  const showInfo = ({
    message,
    description,
    duration = 3000,
    action,
  }: ToastOptions) => {
    return toast.info(message, {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  };

  /**
   * Show loading toast notification
   */
  const showLoading = ({
    message,
    description,
    duration = 3000,
  }: Omit<ToastOptions, "action">) => {
    return toast.loading(message, {
      description,
      duration,
    });
  };

  /**
   * Show generic toast notification
   */
  const showToast = ({
    message,
    description,
    duration = 3000,
    action,
  }: ToastOptions) => {
    return toast(message, {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  };

  /**
   * Dismiss a specific toast by ID
   */
  const dismiss = (toastId?: string | number) => {
    return toast.dismiss(toastId);
  };

  /**
   * Dismiss all toasts
   */
  const dismissAll = () => {
    return toast.dismiss();
  };

  /**
   * Show promise-based toast (useful for async operations)
   */
  const showPromise = <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showToast,
    showPromise,
    dismiss,
    dismissAll,
  };
}
