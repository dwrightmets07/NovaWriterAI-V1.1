// API Configuration for both web and mobile
// CRITICAL: Use build-time env var (import.meta.env) NOT runtime window.Capacitor
// because Vite evaluates this during build and window doesn't exist at build time

// Use environment variable for iOS builds (set via VITE_API_BASE_URL before npm run build)
// Falls back to empty string for web (uses relative URLs)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

console.log('[Config] Using API base URL:', API_BASE_URL || '(relative URLs for web)');

// Helper to get full API URL
export function getApiUrl(path: string): string {
  // If path already starts with http, return as-is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Use API_BASE_URL for absolute paths in Capacitor, relative for web
  return `${API_BASE_URL}${path}`;
}
