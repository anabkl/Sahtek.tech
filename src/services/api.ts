import axios from 'axios';
import { API_PREFIX, API_TIMEOUT, API_URL } from '@/config/api';

const normalizedApiUrl = API_URL.replace(/\/+$/, '');
const apiBaseUrl = normalizedApiUrl.endsWith(API_PREFIX)
  ? normalizedApiUrl
  : `${normalizedApiUrl}${API_PREFIX}`;

// ── Shared axios instance ───────────────────────────────────────────
export const api = axios.create({
  baseURL: normalizedApiUrl ? apiBaseUrl : API_PREFIX,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn(
      '[Sahtek] Live API request failed.',
      error?.message ?? error,
    );
    return Promise.reject(error);
  },
);
