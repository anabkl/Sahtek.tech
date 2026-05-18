import { useLanguageStore } from '@/stores/languageStore';
import { translations, type Translation } from '@/i18n';
import type { Language } from '@/types/api';

interface UseLanguage {
  t: Translation;
  lang: Language;
  setLang: (lang: Language) => void;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
  /** Tailwind font class matching the active script. */
  fontClass: string;
}

/** Central i18n hook — translations, direction and font for the active language. */
export function useLanguage(): UseLanguage {
  const lang = useLanguageStore((s) => s.lang);
  const setLang = useLanguageStore((s) => s.setLang);

  const isRTL = lang === 'ar';
  return {
    t: translations[lang],
    lang,
    setLang,
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
    fontClass: isRTL ? 'font-arabic' : 'font-display',
  };
}

/** Replace `{token}` placeholders in a translation string. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}
