/**
 * Application configuration file
 * Contains environment-specific settings
 */

// The base URL for the API
// In production, this will be the Heroku domain
// In development, this will be localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Other configuration settings can be added here
export const config = {
  apiUrl: API_URL,
  appName: 'YepAI Climbs',
  // ... other configuration options
};

export default config; 