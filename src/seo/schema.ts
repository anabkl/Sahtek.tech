import type { Translation } from '@/i18n';
import type { SchemaKind } from '@/seo/routes';

/**
 * JSON-LD builders.
 *
 * HARD RULE 1 APPLIES TO STRUCTURED DATA. Schema.org gives us fields that would
 * be very easy to overclaim with, and a rich snippet is read by more people than
 * the page. We therefore do NOT emit:
 *
 *   - `MedicalCondition`, `signOrSymptom`, `MedicalSignOrSymptom` — marking our
 *     12 signs up as a diagnosable condition would present awareness content as
 *     clinical fact, and could surface it as a symptom-checker answer.
 *   - `MedicalGuideline` / `MedicalStudy` / `evidenceLevel` — we have no
 *     guideline and no study. Claiming an evidence level we cannot cite is the
 *     structured-data version of an invented expert badge.
 *   - `reviewedBy` — nobody has reviewed this content yet. It appears ONLY when
 *     `MEDICAL_REVIEW` in constants.ts is filled with a real, named clinician.
 *
 * What we DO emit is what is true: this is educational, awareness-framed
 * material, published in a language, by an organisation, with a medical
 * disclaimer attached.
 */

interface Ctx {
  t: Translation;
  origin: string;
  url: string;
  title: string;
  description: string;
  locale: string;
}

type Json = Record<string, unknown>;

const org = (ctx: Ctx): Json => ({
  '@type': 'Organization',
  name: ctx.t.app.latinName,
  alternateName: ctx.t.app.name,
  url: ctx.origin,
  logo: `${ctx.origin}/pwa-icon.svg`,
});

/** The standing disclaimer, attached to every health page. */
const disclaimer = (ctx: Ctx): Json => ({
  '@type': 'WebPageElement',
  cssSelector: '[role="note"]',
  text: ctx.t.disclaimer.full,
});

function webSite(ctx: Ctx): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ctx.t.app.latinName,
    alternateName: ctx.t.app.name,
    url: ctx.origin,
    inLanguage: ctx.locale,
    description: ctx.description,
    publisher: org(ctx),
  };
}

/**
 * A page carrying health information.
 *
 * `MedicalWebPage` is the honest type: it says "this page is about health",
 * NOT "this page contains a diagnosis". We set `audience` to Patient and
 * `medicalAudience` accordingly, and we always attach the disclaimer.
 */
function medicalWebPage(ctx: Ctx): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: ctx.title,
    headline: ctx.title,
    description: ctx.description,
    url: ctx.url,
    inLanguage: ctx.locale,
    isAccessibleForFree: true,
    publisher: org(ctx),
    about: {
      '@type': 'Thing',
      // Deliberately a Thing, not a MedicalCondition — see the file header.
      name: 'Breast health awareness',
    },
    audience: { '@type': 'Patient' },
    hasPart: disclaimer(ctx),
  };
}

function faqPage(ctx: Ctx): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: ctx.locale,
    url: ctx.url,
    publisher: org(ctx),
    mainEntity: ctx.t.home.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

function aboutPage(ctx: Ctx): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: ctx.title,
    description: ctx.description,
    url: ctx.url,
    inLanguage: ctx.locale,
    mainEntity: org(ctx),
  };
}

/** Build the JSON-LD graph for a route. */
export function buildSchema(kind: SchemaKind, ctx: Ctx): Json {
  switch (kind) {
    case 'FAQPage':
      return faqPage(ctx);
    case 'AboutPage':
      return aboutPage(ctx);
    case 'WebSite':
      return webSite(ctx);
    case 'MedicalWebPage':
    default:
      return medicalWebPage(ctx);
  }
}
