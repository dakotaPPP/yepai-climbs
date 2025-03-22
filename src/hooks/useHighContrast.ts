import { useState, useEffect } from 'react';
import { 
  getHighContrastPreference, 
  saveHighContrastPreference 
} from '@/lib/cookies';

/**
 * Custom hook for managing high contrast mode with cookie persistence
 */
export function useHighContrast() {
  // Initialize state from cookie or default to false
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      return getHighContrastPreference();
    }
    return false;
  });

  // Toggle high contrast mode and save to cookie
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    saveHighContrastPreference(newValue);
  };

  // Set high contrast mode directly and save to cookie
  const setHighContrastMode = (enabled: boolean) => {
    setHighContrast(enabled);
    saveHighContrastPreference(enabled);
  };

  // Return the current state and functions to update it
  return {
    highContrast,
    toggleHighContrast,
    setHighContrastMode
  };
} 