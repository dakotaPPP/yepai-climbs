import { useState, useEffect } from 'react';
import { 
  getHighContrastPreference, 
  saveHighContrastPreference 
} from '@/lib/cookies';
import { useAuth } from '@/hooks/useAuth';

/**
 * Custom hook for managing high contrast mode with persistence
 * Uses user-specific preferences when logged in, falls back to cookies when not
 */
export function useHighContrast() {
  const { user } = useAuth();
  const userId = user?.id;

  // Initialize state from user preferences or cookie
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      return getHighContrastPreference(userId);
    }
    return false;
  });

  // Update high contrast when user changes (login/logout)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHighContrast(getHighContrastPreference(userId));
    }
  }, [userId]);

  // Toggle high contrast mode and save to appropriate storage
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    saveHighContrastPreference(newValue, userId);
  };

  // Set high contrast mode directly and save to appropriate storage
  const setHighContrastMode = (enabled: boolean) => {
    setHighContrast(enabled);
    saveHighContrastPreference(enabled, userId);
  };

  // Return the current state and functions to update it
  return {
    highContrast,
    toggleHighContrast,
    setHighContrastMode
  };
} 