import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { APP, SUPPORTED_LANGUAGES } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { DEFAULT_LOCALE, INDEXED_LOCALES, hreflangFor, seoRouteFor } from '@/seo/routes';
import { buildSchema } from '@/seo/schema';
import type { Language } from '@/types/api';

/** Longest a description should be before search engines truncate it. */
const MAX_DESCRIPTION = 155;

const SITE_ORIGIN = 'https://sahtek.tech';

function setMeta(key: string, content: string, attr: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    if (hreflang) tag.setAttribute('hreflang', hreflang);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

/**
 * Owns everything in <head> that depends on the route or the language:
 * title, description, canonical, hreflang, Open Graph, Twitter, and JSON-LD.
 *
 * SCOPE — this runs in the browser.
 *
 * Google renders JavaScript, so it sees all of this, including the JSON-LD that
 * drives rich results. The SOCIAL crawlers (WhatsApp, Facebook, iMessage, Slack)
 * do NOT run JS — they read the HTML the server returns. That is why
 * `scripts/generate-seo.mjs` bakes the same tags, from the same registry, into a
 * static HTML file per route at build time. This hook and that script are two
 * renderings of one source; do not let them disagree.
 */
export function useDocumentMeta() {
  const { t, lang, dir } = useLanguage();
  const { pathname } = useLocation();
  const [params] = useSearchParams();

  useEffect(() => {
    const route = seoRouteFor(pathname);
    const brand = lang === 'ar' ? APP.name : APP.latinName;

    const title = route.title(t);
    const fullTitle = pathname === '/' ? `${brand} — ${title}` : `${title} · ${brand}`;

    const raw = route.description(t);
    const description =
      raw.length > MAX_DESCRIPTION ? `${raw.slice(0, MAX_DESCRIPTION - 1).trimEnd()}…` : raw;

    /* The canonical carries ?lang for every non-default locale, because that is
       what makes the locales distinct URLs — and hreflang is meaningless without
       distinct URLs. The Darija default is the bare path. */
    const suffix = lang === DEFAULT_LOCALE ? '' : `?lang=${lang}`;
    const url = `${SITE_ORIGIN}${pathname}${suffix}`;

    document.title = fullTitle;
    setMeta('description', description);
    setLink('canonical', url);

    // ── hreflang: one alternate per indexed locale, plus x-default ──────────
    for (const locale of INDEXED_LOCALES) {
      const href =
        locale === DEFAULT_LOCALE
          ? `${SITE_ORIGIN}${pathname}`
          : `${SITE_ORIGIN}${pathname}?lang=${locale}`;
      setLink('alternate', href, hreflangFor(locale));
    }
    setLink('alternate', `${SITE_ORIGIN}${pathname}`, 'x-default');

    // ── Open Graph / Twitter ───────────────────────────────────────────────
    const ogImage = `${SITE_ORIGIN}${route.ogImage ?? '/og/sahtek-og.png'}`;
    setMeta('og:type', pathname === '/' ? 'website' : 'article', 'property');
    setMeta('og:site_name', APP.latinName, 'property');
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:locale', lang === 'ar' ? 'ar_MA' : lang, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // ── JSON-LD ────────────────────────────────────────────────────────────
    const schema = buildSchema(route.schema, {
      t,
      origin: SITE_ORIGIN,
      url,
      title,
      description,
      locale: hreflangFor(lang),
    });
    let ld = document.head.querySelector<HTMLScriptElement>('script[data-seo="jsonld"]');
    if (!ld) {
      ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.dataset.seo = 'jsonld';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(schema);

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [pathname, t, lang, dir, params]);
}

/**
 * Makes the language addressable: `/signs?lang=fr` renders French.
 *
 * Without this the seven locales share one URL, which means hreflang has nothing
 * to point at and Google can only ever index the Darija. Reading the param is
 * what turns "a site with a language switch" into "a site with language
 * variants".
 *
 * STRICTLY ONE-WAY: url -> store. It does NOT write the URL back.
 *
 * The first version mirrored in both directions and it broke the back button:
 * on a back navigation the URL reverted to `?lang=en` while the store still held
 * `fr`, both effects fired at once, and the store-to-URL one won — silently
 * undoing the navigation and leaving the address bar disagreeing with the page.
 * Two effects writing to each other is a fight, and the user loses it.
 *
 * The URL is now the source of truth; `useSetLanguage` (below) is the only thing
 * that writes it.
 */
export function useLanguageFromUrl() {
  const [params] = useSearchParams();
  const { lang, setLang } = useLanguage();

  const requested = params.get('lang') as Language | null;

  useEffect(() => {
    /* `?lang` is an OVERRIDE, not the sole source of truth.
     *
     * The absence of the param must NOT mean "reset to Darija". Internal links
     * are plain `/faq`, so treating a missing param as the default threw an
     * English reader back into Darija on every click inside the app — a far
     * worse bug than the one it was meant to fix.
     *
     * So: a valid param wins (deep links, hreflang alternates, Back onto a
     * `?lang=` entry). No param means "carry on in whatever she chose", which is
     * held in the persisted store. A crawler has no store, so it always gets the
     * Darija default — which is exactly what the canonical and x-default say.
     */
    if (requested && SUPPORTED_LANGUAGES.includes(requested) && requested !== lang) {
      setLang(requested);
    }
  }, [requested, lang, setLang]);
}

/**
 * Switch language: updates the store AND the URL, in one user-initiated action.
 *
 * This is the ONLY writer of `?lang`. Use it everywhere a language is chosen —
 * never call `setLang` directly from UI, or the address bar will drift out of
 * step with the page and the link she shares will open in the wrong language.
 *
 * The default locale drops the param rather than carrying `?lang=ar` around.
 * `replace: true` keeps a language switch out of the history stack: it is a
 * preference, not a place, and Back should return to the previous *page*.
 */
export function useSetLanguage() {
  const [params, setParams] = useSearchParams();
  const { setLang } = useLanguage();

  return (code: Language) => {
    setLang(code);

    const next = new URLSearchParams(params);
    if (code === DEFAULT_LOCALE) next.delete('lang');
    else next.set('lang', code);
    setParams(next, { replace: true });
  };
}
