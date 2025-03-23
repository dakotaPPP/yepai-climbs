/**
 * Cookie and local storage utility functions for handling user preferences
 */

// Cookie expiration period - 30 days in milliseconds
const COOKIE_EXPIRY = 30 * 24 * 60 * 60 * 1000;

/**
 * Set a cookie with the specified name and value
 */
export function setCookie(name: string, value: string, expiryDays: number = 30): void {
  const date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
}

/**
 * Get a cookie by name
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
}

/**
 * High contrast mode specific functions
 */

// Constants
export const HIGH_CONTRAST_COOKIE = 'yepai_high_contrast';
export const USER_PREFERENCES_KEY = 'yepai_user_preferences';

/**
 * Get high contrast preference 
 * When userId is provided, retrieves from localStorage for that user
 * When no userId is provided, falls back to session cookie
 */
export function getHighContrastPreference(userId?: string): boolean {
  if (userId) {
    try {
      const userPrefs = getUserPreferences(userId);
      if (userPrefs && typeof userPrefs.highContrast === 'boolean') {
        return userPrefs.highContrast;
      }
    } catch (error) {
      console.error('Error getting user high contrast preference:', error);
    }
  }
  
  // Fall back to cookie for non-logged in users or if user preference lookup fails
  const preference = getCookie(HIGH_CONTRAST_COOKIE);
  return preference === 'true';
}

/**
 * Save high contrast preference
 * When userId is provided, saves to localStorage for that user
 * When no userId is provided, saves to session cookie
 */
export function saveHighContrastPreference(enabled: boolean, userId?: string): void {
  if (userId) {
    try {
      const userPrefs = getUserPreferences(userId) || {};
      userPrefs.highContrast = enabled;
      saveUserPreferences(userId, userPrefs);
    } catch (error) {
      console.error('Error saving user high contrast preference:', error);
    }
  }
  
  // Always save to cookie as fallback
  setCookie(HIGH_CONTRAST_COOKIE, enabled.toString(), 365); // Store for a year
}

/**
 * Reset high contrast preference
 */
export function resetHighContrastPreference(): void {
  deleteCookie(HIGH_CONTRAST_COOKIE);
}

/**
 * Get all preferences for a specific user
 */
export function getUserPreferences(userId: string): Record<string, any> {
  try {
    const prefsJson = localStorage.getItem(`${USER_PREFERENCES_KEY}_${userId}`);
    return prefsJson ? JSON.parse(prefsJson) : {};
  } catch (error) {
    console.error('Error parsing user preferences:', error);
    return {};
  }
}

/**
 * Save all preferences for a specific user
 */
export function saveUserPreferences(userId: string, preferences: Record<string, any>): void {
  try {
    localStorage.setItem(`${USER_PREFERENCES_KEY}_${userId}`, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
}

/**
 * Clear user preferences
 */
export function clearUserPreferences(userId: string): void {
  try {
    localStorage.removeItem(`${USER_PREFERENCES_KEY}_${userId}`);
  } catch (error) {
    console.error('Error clearing user preferences:', error);
  }
} 