// ── Environment-derived API configuration ───────────────────────────
// An empty VITE_API_URL (or VITE_USE_MOCK=true) puts the whole app
// into DEMO MODE — every service falls back to the local mock layer.

export const API_URL: string = import.meta.env.VITE_API_URL || '';

export const API_PREFIX = '/api/v1';

export const USE_MOCK: boolean =
  !API_URL || import.meta.env.VITE_USE_MOCK === 'true';

export const API_TIMEOUT = 15_000;
