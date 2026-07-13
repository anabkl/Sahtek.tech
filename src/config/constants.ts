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

/**
 * Social profiles. Rendered in the footer ONLY when a url is filled in — an
 * empty string hides the icon rather than shipping a dead link.
 */
export const SOCIAL_LINKS: { id: 'instagram' | 'facebook' | 'youtube'; url: string }[] = [
  { id: 'instagram', url: '' },
  { id: 'facebook', url: '' },
  { id: 'youtube', url: '' },
];

/**
 * Footer legal/company links. `to` is an in-app route; `href` is external
 * (mailto, etc.). Entries whose destination is empty are not rendered.
 *
 * NOTE: /about, /privacy and /terms do not exist yet — the routes are built in
 * the pages pass. Until then these are intentionally left empty so the footer
 * never ships a link that 404s. Fill them in when the pages land.
 */
export const FOOTER_LINKS: { key: 'about' | 'privacy' | 'terms' | 'contact'; to?: string; href?: string }[] = [
  { key: 'about', to: '' },
  { key: 'privacy', to: '' },
  { key: 'terms', to: '' },
  { key: 'contact', href: `mailto:${APP.email}` },
];

export const LANGUAGE_META: Record<Language, { label: string; native: string; flag: string }> = {
  ar: { label: 'Darija', native: 'الدارجة', flag: 'MA' },
  fr: { label: 'Francais', native: 'Francais', flag: 'FR' },
  en: { label: 'English', native: 'English', flag: 'EN' },
  es: { label: 'Spanish', native: 'Espanol', flag: 'ES' },
  de: { label: 'German', native: 'Deutsch', flag: 'DE' },
  ru: { label: 'Russian', native: 'Русский', flag: 'RU' },
  pt: { label: 'Portuguese', native: 'Portugues', flag: 'BR' },
};
