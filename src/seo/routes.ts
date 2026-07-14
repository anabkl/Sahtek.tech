import type { Translation } from '@/i18n';

/**
 * The SEO registry. ONE source of truth for every crawlable route.
 *
 * The runtime (`useDocumentMeta`) and the build script (`scripts/generate-seo.mjs`)
 * both read this, so the <title> a user sees, the tag Google indexes, the entry
 * in sitemap.xml and the hreflang alternates can never drift apart.
 *
 * Titles and descriptions are DERIVED from the copy each page already renders —
 * `signsPage.title` is the page's <h1>, so it is also its <title>. A parallel set
 * of "SEO copy" would be text nobody reads, guaranteed to drift from the headings
 * it describes, and it is exactly how a health site ends up with a meta
 * description that overclaims while the page itself does not.
 */

/** Schema.org type. `MedicalWebPage` is for pages carrying health information. */
export type SchemaKind = 'WebSite' | 'MedicalWebPage' | 'FAQPage' | 'AboutPage';

export interface SeoRoute {
  path: string;
  /** Sitemap priority, 0-1. */
  priority: number;
  changefreq: 'weekly' | 'monthly' | 'yearly';
  schema: SchemaKind;
  /** Per-route social image, relative to the site root. Falls back to the default. */
  ogImage?: string;
  title: (t: Translation) => string;
  description: (t: Translation) => string;
}

export const SEO_ROUTES: SeoRoute[] = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'weekly',
    schema: 'WebSite',
    title: (t) => t.app.tagline,
    description: (t) => t.home.heroSubtitle,
  },
  {
    path: '/signs',
    priority: 0.9,
    changefreq: 'monthly',
    schema: 'MedicalWebPage',
    // The flagship shareable. Its own card, not the site-wide one.
    ogImage: '/og/signs-og.png',
    title: (t) => t.signsPage.title,
    description: (t) => t.signsPage.intro,
  },
  {
    path: '/when-to-seek-help',
    priority: 0.9,
    changefreq: 'monthly',
    schema: 'MedicalWebPage',
    title: (t) => t.whenToSeekPage.title,
    description: (t) => t.whenToSeekPage.intro,
  },
  {
    path: '/self-check',
    priority: 0.9,
    changefreq: 'monthly',
    schema: 'MedicalWebPage',
    title: (t) => t.selfCheck.title,
    description: (t) => t.selfCheck.subtitle,
  },
  {
    path: '/risk-factors',
    priority: 0.8,
    changefreq: 'monthly',
    schema: 'MedicalWebPage',
    title: (t) => t.riskFactorsPage.title,
    description: (t) => t.riskFactorsPage.intro,
  },
  {
    path: '/faq',
    priority: 0.8,
    changefreq: 'monthly',
    schema: 'FAQPage',
    title: (t) => t.home.faq.title,
    description: (t) => t.home.faq.items[0].a,
  },
  {
    path: '/about',
    priority: 0.7,
    changefreq: 'yearly',
    schema: 'AboutPage',
    title: (t) => t.aboutPage.title,
    description: (t) => t.aboutPage.intro,
  },
  {
    path: '/learn',
    priority: 0.7,
    changefreq: 'monthly',
    schema: 'MedicalWebPage',
    title: (t) => t.learn.title,
    description: (t) => t.learn.subtitle,
  },
  {
    path: '/companion',
    priority: 0.6,
    changefreq: 'monthly',
    schema: 'MedicalWebPage',
    title: (t) => t.companionPage.title,
    description: (t) => t.companionPage.intro,
  },
  {
    path: '/risk',
    priority: 0.6,
    changefreq: 'monthly',
    schema: 'MedicalWebPage',
    title: (t) => t.risk.title,
    description: (t) => t.risk.subtitle,
  },
  {
    path: '/doctors',
    priority: 0.6,
    changefreq: 'monthly',
    schema: 'MedicalWebPage',
    title: (t) => t.doctors.title,
    description: (t) => t.doctors.subtitle,
  },
  {
    path: '/reminder',
    priority: 0.5,
    changefreq: 'yearly',
    schema: 'MedicalWebPage',
    title: (t) => t.nav.reminder,
    description: (t) => t.reminder.stepDaySubtitle,
  },
];

export function seoRouteFor(pathname: string): SeoRoute {
  return SEO_ROUTES.find((r) => r.path === pathname) ?? SEO_ROUTES[0];
}

/**
 * The locales we ask search engines to index.
 *
 * Only the three the product is actually for. es/de/ru/pt still WORK in the UI
 * (CLAUDE.md keeps them alive) but they are not authored, not maintained, and
 * asking Google to index seven half-tended locales invites thin-content
 * penalties and buries the Darija we actually care about.
 */
export const INDEXED_LOCALES = ['ar', 'fr', 'en'] as const;

/** x-default: the locale a crawler should show when it has no better match. */
export const DEFAULT_LOCALE = 'ar';

/** hreflang value for a locale. Darija is Moroccan Arabic — say so. */
export function hreflangFor(locale: string): string {
  return locale === 'ar' ? 'ar-MA' : locale;
}
