import { useEffect, useState } from 'react';

/**
 * useState backed by localStorage. Persists `{ value, _timestamp }` under `key`
 * and rehydrates on mount. If `maxAge` (ms) is given and the stored entry is
 * older, it is ignored and the default is used instead.
 *
 * All storage access is wrapped in try/catch — private browsing and disabled
 * storage throw, and we must never crash the page over persisted UI state.
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  maxAge?: number,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as { value?: T; _timestamp?: number };
        if (maxAge && parsed._timestamp && Date.now() - parsed._timestamp > maxAge) {
          return defaultValue;
        }
        return parsed.value ?? defaultValue;
      }
    } catch {
      /* storage unavailable or corrupt — fall back to default */
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify({ value: state, _timestamp: Date.now() }));
    } catch {
      /* storage unavailable — keep in-memory state only */
    }
  }, [key, state]);

  const reset = () => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setState(defaultValue);
  };

  return [state, setState, reset];
}
