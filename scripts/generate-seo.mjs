/**
 * Post-build SEO generator.
 *
 * WHY THIS EXISTS
 * Sahtek is a client-rendered SPA. Google runs JavaScript and sees everything
 * `useDocumentMeta` sets at runtime — but the crawlers that build LINK PREVIEWS
 * (WhatsApp, Facebook, iMessage, Slack, LinkedIn) do NOT run JS. They read the
 * HTML the server returns, which for an SPA is always the same `index.html`.
 *
 * So: for every route we emit a real `dist/<route>/index.html` whose <head>
 * carries that route's own title, description, canonical, hreflang, Open Graph,
 * Twitter card and JSON-LD. The <body> is the same SPA shell — React hydrates it
 * exactly as before. The user gets the app; the crawler gets the truth.
 *
 * Static hosts (Netlify, Vercel, Cloudflare Pages, nginx `try_files`) serve an
 * exact file match before falling back to the SPA rewrite, so `/signs` resolves
 * to `dist/signs/index.html` and everything below it still works.
 *
 * It also emits sitemap.xml (with hreflang alternates) and robots.txt.
 *
 * The route list and the schema come from `src/seo/*` — the SAME source the app
 * reads at runtime — so the tag Google indexes and the tag the user's browser
 * shows cannot drift apart.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const SITE = process.env.SITE_ORIGIN ?? 'https://sahtek.tech';
const INDEXED = ['ar', 'fr', 'en'];
const DEFAULT_LOCALE = 'ar';
const hreflang = (l) => (l === 'ar' ? 'ar-MA' : l);

// Routes + how to get their copy. Mirrors src/seo/routes.ts. Kept as data rather
// than imported because the TS there compiles for the browser, not for node.
const ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly', schema: 'WebSite', title: (t) => t.app.tagline, desc: (t) => t.home.heroSubtitle },
  { path: '/signs', priority: 0.9, changefreq: 'monthly', schema: 'MedicalWebPage', ogImage: '/og/signs-og.png', title: (t) => t.signsPage.title, desc: (t) => t.signsPage.intro },
  { path: '/when-to-seek-help', priority: 0.9, changefreq: 'monthly', schema: 'MedicalWebPage', title: (t) => t.whenToSeekPage.title, desc: (t) => t.whenToSeekPage.intro },
  { path: '/self-check', priority: 0.9, changefreq: 'monthly', schema: 'MedicalWebPage', title: (t) => t.selfCheck.title, desc: (t) => t.selfCheck.subtitle },
  { path: '/risk-factors', priority: 0.8, changefreq: 'monthly', schema: 'MedicalWebPage', title: (t) => t.riskFactorsPage.title, desc: (t) => t.riskFactorsPage.intro },
  { path: '/faq', priority: 0.8, changefreq: 'monthly', schema: 'FAQPage', title: (t) => t.home.faq.title, desc: (t) => t.home.faq.items[0].a },
  { path: '/about', priority: 0.7, changefreq: 'yearly', schema: 'AboutPage', title: (t) => t.aboutPage.title, desc: (t) => t.aboutPage.intro },
  { path: '/learn', priority: 0.7, changefreq: 'monthly', schema: 'MedicalWebPage', title: (t) => t.learn.title, desc: (t) => t.learn.subtitle },
  { path: '/companion', priority: 0.6, changefreq: 'monthly', schema: 'MedicalWebPage', title: (t) => t.companionPage.title, desc: (t) => t.companionPage.intro },
  { path: '/risk', priority: 0.6, changefreq: 'monthly', schema: 'MedicalWebPage', title: (t) => t.risk.title, desc: (t) => t.risk.subtitle },
  { path: '/doctors', priority: 0.6, changefreq: 'monthly', schema: 'MedicalWebPage', title: (t) => t.doctors.title, desc: (t) => t.doctors.subtitle },
  { path: '/reminder', priority: 0.5, changefreq: 'yearly', schema: 'MedicalWebPage', title: (t) => t.nav.reminder, desc: (t) => t.reminder.stepDaySubtitle },
];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const clamp = (s, n = 155) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/**
 * Pull the i18n objects out of the TS sources without a TS toolchain.
 *
 * Anchored on the `export const <locale>` declaration, not on the first `{` in
 * the file — the locale files open with `import type { Translation }`, whose
 * braces would otherwise be mistaken for the object.
 */
async function loadTranslations() {
  const out = {};
  for (const locale of INDEXED) {
    const src = await readFile(join(ROOT, 'src', 'i18n', `${locale}.ts`), 'utf8');
    const decl = new RegExp(`export const ${locale}[^=]*=\\s*`).exec(src);
    if (!decl) throw new Error(`could not find the exported object in ${locale}.ts`);
    const start = src.indexOf('{', decl.index + decl[0].length);
    const body = src.slice(start, src.lastIndexOf('}') + 1);
    // The i18n files are plain object literals with no expressions — safe to
    // evaluate, and it beats maintaining a second copy of every string.
    out[locale] = new Function(`return (${body});`)();
  }
  return out;
}

function schemaFor(route, t, locale, url) {
  const org = {
    '@type': 'Organization',
    name: t.app.latinName,
    alternateName: t.app.name,
    url: SITE,
    logo: `${SITE}/pwa-icon.svg`,
  };
  const title = route.title(t);
  const description = clamp(route.desc(t));
  const lang = hreflang(locale);

  if (route.schema === 'FAQPage') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      url,
      publisher: org,
      mainEntity: t.home.faq.items.map((i) => ({
        '@type': 'Question',
        name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: i.a },
      })),
    };
  }
  if (route.schema === 'AboutPage') {
    return { '@context': 'https://schema.org', '@type': 'AboutPage', name: title, description, url, inLanguage: lang, mainEntity: org };
  }
  if (route.schema === 'WebSite') {
    return { '@context': 'https://schema.org', '@type': 'WebSite', name: t.app.latinName, alternateName: t.app.name, url: SITE, inLanguage: lang, description, publisher: org };
  }
  // MedicalWebPage — awareness-framed. No MedicalCondition, no evidenceLevel,
  // no reviewedBy. See src/seo/schema.ts for why.
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    headline: title,
    description,
    url,
    inLanguage: lang,
    isAccessibleForFree: true,
    publisher: org,
    about: { '@type': 'Thing', name: 'Breast health awareness' },
    audience: { '@type': 'Patient' },
    hasPart: { '@type': 'WebPageElement', cssSelector: '[role="note"]', text: t.disclaimer.full },
  };
}

function headFor(route, t, locale) {
  const brand = locale === 'ar' ? t.app.name : t.app.latinName;
  const title = route.title(t);
  const fullTitle = route.path === '/' ? `${brand} — ${title}` : `${title} · ${brand}`;
  const description = clamp(route.desc(t));
  const suffix = locale === DEFAULT_LOCALE ? '' : `?lang=${locale}`;
  const url = `${SITE}${route.path}${suffix}`;
  const ogImage = `${SITE}${route.ogImage ?? '/og/sahtek-og.png'}`;

  const alternates = INDEXED.map((l) => {
    const href = l === DEFAULT_LOCALE ? `${SITE}${route.path}` : `${SITE}${route.path}?lang=${l}`;
    return `    <link rel="alternate" hreflang="${hreflang(l)}" href="${esc(href)}" />`;
  }).join('\n');

  const ld = JSON.stringify(schemaFor(route, t, locale, url));

  return `    <title>${esc(fullTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${esc(url)}" />
${alternates}
    <link rel="alternate" hreflang="x-default" href="${esc(`${SITE}${route.path}`)}" />
    <meta property="og:type" content="${route.path === '/' ? 'website' : 'article'}" />
    <meta property="og:site_name" content="${esc(t.app.latinName)}" />
    <meta property="og:title" content="${esc(fullTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="${locale === 'ar' ? 'ar_MA' : locale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(fullTitle)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <script type="application/ld+json" data-seo="jsonld">${ld}</script>`;
}

async function main() {
  const T = await loadTranslations();
  const shell = await readFile(join(DIST, 'index.html'), 'utf8');

  // Strip the placeholder head tags the shell carries so we do not emit two of
  // each. Everything between the marker comments is ours to replace.
  const stripped = shell
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/g, '')
    .replace(/<meta property="og:[^>]*>/g, '')
    .replace(/<meta name="twitter:[^>]*>/g, '');

  let pages = 0;
  for (const route of ROUTES) {
    const head = headFor(route, T[DEFAULT_LOCALE], DEFAULT_LOCALE);
    const html = stripped.replace('</head>', `${head}\n  </head>`);

    const dir = route.path === '/' ? DIST : join(DIST, route.path);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), html, 'utf8');
    pages += 1;
  }

  // ── sitemap.xml ──────────────────────────────────────────────────────────
  const urls = ROUTES.map((route) => {
    const alts = INDEXED.map((l) => {
      const href = l === DEFAULT_LOCALE ? `${SITE}${route.path}` : `${SITE}${route.path}?lang=${l}`;
      return `      <xhtml:link rel="alternate" hreflang="${hreflang(l)}" href="${esc(href)}" />`;
    }).join('\n');

    return `    <url>
      <loc>${esc(`${SITE}${route.path}`)}</loc>
${alts}
      <xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${SITE}${route.path}`)}" />
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority.toFixed(1)}</priority>
    </url>`;
  }).join('\n');

  await writeFile(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
    'utf8',
  );

  // ── robots.txt ───────────────────────────────────────────────────────────
  await writeFile(
    join(DIST, 'robots.txt'),
    `# Sahtek — breast-health awareness. Educational content, freely crawlable.
User-agent: *
Allow: /

# Internal design-system preview: not content, keep it out of the index.
Disallow: /design-system

Sitemap: ${SITE}/sitemap.xml
`,
    'utf8',
  );

  console.log(`SEO: ${pages} route shells, sitemap.xml (${ROUTES.length} urls x ${INDEXED.length} locales), robots.txt`);
}

main().catch((error) => {
  console.error('SEO generation failed:', error);
  process.exit(1);
});
