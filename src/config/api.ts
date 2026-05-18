// ── Live API configuration ──────────────────────────────────────────
// Final demo build is pinned to the deployed Render backend.

export const API_URL: string =
  import.meta.env.VITE_API_URL || 'https://sahtek-tech.onrender.com/api/v1';

export const API_PREFIX = '/api/v1';

export const USE_MOCK = false;

export const API_TIMEOUT = 15_000;
