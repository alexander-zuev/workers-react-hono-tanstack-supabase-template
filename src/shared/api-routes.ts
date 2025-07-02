/**
 * API Routes Configuration
 *
 * Centralized definition of all API routes with proper typing.
 * Used by both frontend and backend for consistency.
 */

const API_BASE = '/api';
const API_VERSION = 'v1';

export const API_ROUTES = {
  // Base path
  BASE_PATH: `${API_BASE}/${API_VERSION}`,

  // Health check
  HEALTH: `/health`,

  // Tasks routes
  TASKS: `/tasks`,
  TASKS_BY_ID: `/tasks/:id`,

  // Auth routes
  AUTH_PROFILE: `/auth/profile`,
} as const;

export type ApiRoutePath = (typeof API_ROUTES)[keyof typeof API_ROUTES];

// Type for frontend API client (full paths with prefix)
export type FullApiRoutePath = `${typeof API_ROUTES.BASE_PATH}${ApiRoutePath}`;

export function getApiRouteWithPrefix(path: ApiRoutePath): FullApiRoutePath {
  return `${API_ROUTES.BASE_PATH}${path}` as FullApiRoutePath;
}