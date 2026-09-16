/**
 * API & Asset URL Configuration for ColoAI / PolypAI
 * Supports local dev proxying, Vercel deployments, and Render backend hosting.
 */

// Base API URL (e.g., "https://coloai-api.onrender.com/api" or "/api" for local dev proxy)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Derived root backend URL without trailing "/api"
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

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
