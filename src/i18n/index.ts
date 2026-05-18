import type { Language } from '@/types/api';
import { ar } from './ar';
import { fr } from './fr';
import { en, type Translation } from './en';

export type { Translation };

/** All translations keyed by language code. */
export const translations: Record<Language, Translation> = { ar, fr, en };
