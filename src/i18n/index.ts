import { create } from 'zustand';
import type { Language } from '@/types/api';
import { ar } from './ar';
import { fr } from './fr';
import { en, type Translation } from './en';

export type { Translation };

/**
 * Locale loading.
 *
 * All seven locales used to be statically imported here, which put 381 KB of
 * source — every string in every language — into the main bundle so that one of
 * them could be used. On a Moroccan 3G phone that is bytes she pays for and
 * never reads.
 *
 * The three the product is FOR (Darija, French, English — the same three we ask
 * Google to index) stay eager: they must paint instantly, with no wrong-language
 * flash and no RTL/LTR flip on load.
 *
 * The four legacy locales (es/de/ru/pt — "keep working, never prioritize" per
 * CLAUDE.md) are code-split and fetched on demand. Until one arrives the UI
 * shows English, which is the documented fallback for unknown locales anyway.
 */
const EAGER: Partial<Record<Language, Translation>> = { ar, fr, en };

const LAZY: Partial<Record<Language, () => Promise<{ default?: Translation } & Record<string, unknown>>>> = {
  es: () => import('./es'),
  de: () => import('./de'),
  ru: () => import('./ru'),
  pt: () => import('./pt'),
};

interface LocaleState {
  loaded: Partial<Record<Language, Translation>>;
  load: (lang: Language) => void;
}

const useLocaleStore = create<LocaleState>((set, get) => ({
  loaded: { ...EAGER },
  load: (lang) => {
    if (get().loaded[lang]) return;
    const importer = LAZY[lang];
    if (!importer) return;
    void importer().then((mod) => {
      const translation = (mod[lang] ?? mod.default) as Translation | undefined;
      if (translation) set((s) => ({ loaded: { ...s.loaded, [lang]: translation } }));
    });
  },
}));

/**
 * The active translation. Falls back to English while a legacy locale loads —
 * never to a half-empty object, so no screen can render blank keys.
 */
export function useTranslation(lang: Language): Translation {
  const loaded = useLocaleStore((s) => s.loaded);
  const load = useLocaleStore((s) => s.load);

  if (!loaded[lang]) load(lang);

  return loaded[lang] ?? en;
}
