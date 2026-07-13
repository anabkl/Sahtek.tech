import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { APP } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { Translation } from '@/i18n';

/** Longest a description should be before search engines truncate it. */
const MAX_DESCRIPTION = 155;

/**
 * Per-route title and description, in the active language.
 *
 * These are DERIVED from the copy each page already renders — `t.signsPage.title`
 * is the page's <h1>, so it is also its <title>. Authoring a second, parallel set
 * of meta strings would mean 11 routes x 2 strings x 7 languages of copy that
 * nobody looks at, and which would silently drift from the headings it describes.
 */
function metaFor(pathname: string, t: Translation): { title: string; description: string } {
  switch (pathname) {
    case '/signs':
      return { title: t.signsPage.title, description: t.signsPage.intro };
    case '/when-to-seek-help':
      return { title: t.whenToSeekPage.title, description: t.whenToSeekPage.intro };
    case '/risk-factors':
      return { title: t.riskFactorsPage.title, description: t.riskFactorsPage.intro };
    case '/companion':
      return { title: t.companionPage.title, description: t.companionPage.intro };
    case '/learn':
      return { title: t.learn.title, description: t.learn.subtitle };
    case '/self-check':
      return { title: t.selfCheck.title, description: t.selfCheck.subtitle };
    case '/risk':
      return { title: t.risk.title, description: t.risk.subtitle };
    case '/chat':
      return { title: t.chat.title, description: t.chat.subtitle };
    case '/doctors':
      return { title: t.doctors.title, description: t.doctors.subtitle };
    case '/reminder':
      return { title: t.nav.reminder, description: t.reminder.stepDaySubtitle };
    default:
      // Home, and anything unrouted.
      return { title: t.app.tagline, description: t.home.heroSubtitle };
  }
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Keeps <title>, the meta description and og:* in step with the route AND the
 * active language. Mount once, in Layout.
 *
 * SCOPE: this runs in the browser. Google renders JS and will see it; the social
 * crawlers (WhatsApp, Facebook, iMessage) do NOT, and will always see the static
 * tags in index.html. See public/og/README.md — do not "fix" that here.
 */
export function useDocumentMeta() {
  const { t, lang, dir } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = metaFor(pathname, t);

    /* The brand mark follows the script: صحّتك in Arabic, "Sahtek" in Latin.
       An Arabic wordmark stranded in an English tab title reads as a bug. */
    const brand = lang === 'ar' ? APP.name : APP.latinName;

    const fullTitle = pathname === '/' ? `${brand} — ${title}` : `${title} · ${brand}`;

    const trimmed =
      description.length > MAX_DESCRIPTION
        ? `${description.slice(0, MAX_DESCRIPTION - 1).trimEnd()}…`
        : description;

    document.title = fullTitle;
    setMeta('description', trimmed);

    // og:* mirrors the above so an in-app share sheet (which reads the live DOM)
    // gets the right language. Link-preview crawlers still read index.html.
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', trimmed, 'property');
    setMeta('og:locale', lang === 'ar' ? 'ar_MA' : lang, 'property');

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [pathname, t, lang, dir]);
}
