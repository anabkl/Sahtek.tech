import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useUserStore, type Theme } from '@/stores/userStore';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeToSystem(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const systemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;

/** Tracks the OS colour scheme and re-renders when the user changes it. */
export function useSystemPrefersDark(): boolean {
  return useSyncExternalStore(subscribeToSystem, systemPrefersDark, () => false);
}

interface UseTheme {
  /** The stored preference — may be 'system'. */
  theme: Theme;
  /** What's actually on screen once 'system' is resolved. */
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  /** Flip to the opposite of what's currently showing — an explicit choice. */
  toggle: () => void;
}

/**
 * Single owner of the `.dark` class on <html>.
 *
 * The stored preference persists via userStore (localStorage, never leaves the
 * device). 'system' — the default — follows prefers-color-scheme live, so the
 * page flips if the user changes their OS theme while it's open.
 *
 * Mount this ONCE, at the app root. Calling it elsewhere to read the theme is
 * fine; the effect is idempotent.
 */
export function useTheme(): UseTheme {
  const theme = useUserStore((s) => s.theme);
  const setTheme = useUserStore((s) => s.setTheme);
  const prefersDark = useSystemPrefersDark();

  const resolved: 'light' | 'dark' = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);

  const toggle = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setTheme]);

  return { theme, resolved, setTheme, toggle };
}
