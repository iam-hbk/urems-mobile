import type { ApiError } from "@/types/api";

/**
 * Extracts user-friendly error messages from API error responses
 */
export function parseApiError(error: ApiError): string {
  // Check if there are specific validation errors
  if (error.errors && typeof error.errors === 'object') {
    const errorMessages: string[] = [];
    
    // Extract error messages from the errors object
    Object.entries(error.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        errorMessages.push(...messages);
      } else if (typeof messages === 'string') {
        errorMessages.push(messages);
      }
    });

    // Return the first few error messages (limit to avoid overwhelming the user)
    if (errorMessages.length > 0) {
      return errorMessages.slice(0, 3).join('. ');
    }
  }

  // Check for common password-related error patterns and provide user-friendly messages
  if (error.detail) {
    const detail = error.detail.toLowerCase();
    
    if (detail.includes('password') && detail.includes('digit')) {
      return 'Password must contain at least one digit (0-9)';
    }
    
    if (detail.includes('password') && detail.includes('uppercase')) {
      return 'Password must contain at least one uppercase letter (A-Z)';
    }
    
    if (detail.includes('password') && detail.includes('lowercase')) {
      return 'Password must contain at least one lowercase letter (a-z)';
    }
    
    if (detail.includes('password') && detail.includes('non alphanumeric')) {
      return 'Password must contain at least one special character';
    }
    
    if (detail.includes('password') && detail.includes('characters')) {
      return 'Password must be at least 6 characters long';
    }
    
    if (detail.includes('incorrect password') || detail.includes('password mismatch')) {
      return 'Current password is incorrect';
    }
    
    if (detail.includes('user not found')) {
      return 'User account not found';
    }
    
    if (detail.includes('invalid') && detail.includes('code')) {
      return 'Invalid or expired reset code';
    }

    // Return the detail as-is if it's already user-friendly
    return error.detail;
  }

  // Fallback to title or generic message
  return error.title || 'An unexpected error occurred. Please try again.';
}

/**
 * Gets a user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    // Handle ApiError type
    if ('detail' in error || 'errors' in error || 'title' in error) {
      return parseApiError(error as ApiError);
    }
    
    // Handle Error instance
    if (error instanceof Error) {
      return error.message;
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
} 