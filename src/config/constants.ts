import type { Language } from '@/types/api';

export const APP = {
  name: 'صحّتك',
  latinName: 'Sahtek',
  version: '1.0.0',
  email: 'hello@sahtek.ma',
} as const;

export const SUPPORTED_LANGUAGES: Language[] = ['ar', 'fr', 'en', 'es', 'de', 'ru', 'pt'];
export const DEFAULT_LANGUAGE: Language = 'ar';

export const STORAGE_KEYS = {
  language: 'sahtek:lang',
  theme: 'sahtek:theme',
  chat: 'sahtek:chat',
  preventionChecklist: 'sahtek:prevention',
  selfCheckLog: 'sahtek:selfcheck-log',
  reminder: 'sahtek:reminder',
  onboarded: 'sahtek:onboarded',
} as const;

export const MOCK_DELAY = 500;

export const LANGUAGE_META: Record<Language, { label: string; native: string; flag: string }> = {
  ar: { label: 'Darija', native: 'الدارجة', flag: 'MA' },
  fr: { label: 'Francais', native: 'Francais', flag: 'FR' },
  en: { label: 'English', native: 'English', flag: 'EN' },
  es: { label: 'Spanish', native: 'Espanol', flag: 'ES' },
  de: { label: 'German', native: 'Deutsch', flag: 'DE' },
  ru: { label: 'Russian', native: 'Русский', flag: 'RU' },
  pt: { label: 'Portuguese', native: 'Portugues', flag: 'BR' },
};
