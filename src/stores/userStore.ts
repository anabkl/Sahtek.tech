import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config/constants';

export type Theme = 'light' | 'dark';

export interface SavedReminder {
  preferredDay: number;
  method: 'email' | 'sms' | 'both';
  email: string;
  phone: string;
  createdAt: string;
}

interface UserState {
  theme: Theme;
  onboarded: boolean;
  /** Checked prevention-habit ids (Learn page). */
  preventionChecklist: string[];
  /** ISO month strings ("2026-05") in which a self-check was logged. */
  selfCheckLog: string[];
  reminder: SavedReminder | null;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setOnboarded: (value: boolean) => void;
  togglePreventionItem: (id: string) => void;
  logSelfCheck: () => void;
  setReminder: (reminder: SavedReminder | null) => void;
}

/** Local user preferences + progress — never leaves the device. */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      theme: 'light',
      onboarded: false,
      preventionChecklist: [],
      selfCheckLog: [],
      reminder: null,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setOnboarded: (onboarded) => set({ onboarded }),
      togglePreventionItem: (id) =>
        set((s) => ({
          preventionChecklist: s.preventionChecklist.includes(id)
            ? s.preventionChecklist.filter((x) => x !== id)
            : [...s.preventionChecklist, id],
        })),
      logSelfCheck: () =>
        set((s) => {
          const month = new Date().toISOString().slice(0, 7);
          return s.selfCheckLog.includes(month)
            ? s
            : { selfCheckLog: [...s.selfCheckLog, month] };
        }),
      setReminder: (reminder) => set({ reminder }),
    }),
    { name: STORAGE_KEYS.onboarded.replace(':onboarded', ':user') },
  ),
);
