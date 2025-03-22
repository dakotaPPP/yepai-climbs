/**
 * Cookie utility functions for handling user preferences
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

/**
 * Get high contrast preference from cookie
 */
export function getHighContrastPreference(): boolean {
  const preference = getCookie(HIGH_CONTRAST_COOKIE);
  return preference === 'true';
}

/**
 * Save high contrast preference to cookie
 */
export function saveHighContrastPreference(enabled: boolean): void {
  setCookie(HIGH_CONTRAST_COOKIE, enabled.toString(), 365); // Store for a year
} 