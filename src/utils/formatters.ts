import type { Language } from '@/types/api';

const LOCALES: Record<Language, string> = {
  ar: 'ar-MA',
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
  ru: 'ru-RU',
  pt: 'pt-BR',
};

/** Format a Date as a long, localized date string. */
export function formatDate(date: Date, lang: Language): string {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Format a Date as a short day + month string. */
export function formatShortDate(date: Date, lang: Language): string {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

/** Format a unix timestamp as HH:MM. */
export function formatTime(timestamp: number, lang: Language): string {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

/** Localized number (uses Eastern-Arabic digits for ar). */
export function formatNumber(value: number, lang: Language): string {
  return new Intl.NumberFormat(LOCALES[lang]).format(value);
}

/** Pad a number to MM:SS, used by the self-check timer. */
export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Add `months` calendar months to a date, clamping the day. */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const targetDay = d.getDate();
  d.setMonth(d.getMonth() + months, 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(targetDay, lastDay));
  return d;
}

/**
 * Given a preferred day-of-month, return the next future date
 * landing on that day.
 */
export function nextReminderDate(preferredDay: number): Date {
  const now = new Date();
  let candidate = new Date(now.getFullYear(), now.getMonth(), preferredDay);
  if (candidate <= now) candidate = addMonths(candidate, 1);
  return candidate;
}
