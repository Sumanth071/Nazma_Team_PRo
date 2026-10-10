
/**
 * API & Asset URL Configuration for ColoAI / PolypAI
 * Supports local dev proxying, Vercel deployments, and Render backend hosting.
 */

// Base API URL (automatically points to Render production backend when on Vercel)
const getBaseApiUrl = (): string => {
  // 1. If running in browser on Vercel or any cloud preview, route directly to Render backend
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('vercel.app') || host.includes('vercel')) {
      return 'https://coloai-backend.onrender.com/api';
    }
  }

  // 2. Check environment variable, but IGNORE any expired/stale trycloudflare.com tunnel URLs
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (envUrl && !envUrl.includes('trycloudflare.com')) {
    return envUrl;
  }

  // 3. Default to relative /api for local dev proxy
  return '/api';
};

export const API_BASE_URL = getBaseApiUrl();

// Derived root backend URL without trailing "/api"
export const BACKEND_BASE_URL = API_BASE_URL.startsWith('http')
  ? API_BASE_URL.replace(/\/api\/?$/, '')
  : (typeof window !== 'undefined' && window.location.hostname.includes('vercel')
    ? 'https://coloai-backend.onrender.com'
    : '');

/**
 * Returns full URL for static assets and uploaded medical images.
 * Automatically resolves relative paths against Render backend if VITE_API_URL is configured.
 */
export const getImageUrl = (path?: string): string => {
  if (!path) return '/sample_images/colon_001.jpg';

  // Already absolute or base64 data URI
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If deployed to Vercel and connecting to an external Render backend
  if (BACKEND_BASE_URL && cleanPath.startsWith('/uploads')) {
    return `${BACKEND_BASE_URL}${cleanPath}`;
  }

  return cleanPath;
};

/**
 * Returns full download URL for generated medical PDF reports.
 */
export const getReportDownloadUrl = (reportId: string, token: string): string => {
  const cleanBase = API_BASE_URL.replace(/\/$/, '');
  return `${cleanBase}/reports/${reportId}/download?token=${encodeURIComponent(token)}`;
};
