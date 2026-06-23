import type { Language } from '@/types/api';
import { ar } from './ar';
import { fr } from './fr';
import { en, type Translation } from './en';
import { es } from './es';
import { de } from './de';
import { ru } from './ru';
import { pt } from './pt';

export type { Translation };

/** All translations keyed by language code. */
export const translations: Record<Language, Translation> = { ar, fr, en, es, de, ru, pt };
