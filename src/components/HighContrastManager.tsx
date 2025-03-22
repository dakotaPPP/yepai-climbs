import { useEffect } from 'react';
import { useHighContrast } from '@/hooks/useHighContrast';

/**
 * Component that applies high contrast mode to the body element
 * based on the user's preference stored in cookies
 */
export function HighContrastManager() {
  const { highContrast } = useHighContrast();

  useEffect(() => {
    // Apply or remove high contrast class to the body
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // This component doesn't render anything
  return null;
} 