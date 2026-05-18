import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/types/api';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/config/constants';

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
}

/** Active UI language — persisted across sessions. */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: DEFAULT_LANGUAGE,
      setLang: (lang) => set({ lang }),
    }),
    { name: STORAGE_KEYS.language },
  ),
);
