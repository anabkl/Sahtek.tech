import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BellRing, Link2, MapPin, Share2, Stethoscope } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PetalMark } from '@/components/ui/PetalMark';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useToast } from '@/components/ui/toastStore';
import { SIGN_ICONS } from '@/data/signs';
import { interpolate, useLanguage } from '@/hooks/useLanguage';

/** Anchor id for a sign. Stable and 1-based, so /signs#sign-3 is shareable. */
const signAnchor = (index: number) => `sign-${index + 1}`;

/**
 * /signs — the flagship 12 Signs page.
 *
 * The metaphor is the homepage's, unchanged: Care Cards, each a soft ceramic
 * form (PetalMark) holding one change worth knowing. The form is ornament. The
 * teaching is the label and the words — we never draw a sign onto a fruit or a
 * body, which is the awareness layout HARD RULE 6 rules out.
 *
 * Shareable by construction: every sign is an <article> with a stable anchor,
 * so a woman can send her sister the one sign she is worried about rather than
 * a whole page. The share buttons use the Web Share API where it exists and
 * fall back to the clipboard — both are user-initiated and send nothing
 * anywhere on their own.
 */
export function SignsPage() {
  const { t, isRTL } = useLanguage();
  const toast = useToast();
  const page = t.signsPage;
  const signs = t.home.signs;

  const share = useCallback(
    async (url: string, title: string) => {
      // navigator.share exists mostly on mobile and only on secure origins; the
      // clipboard is the path most desktop users actually take.
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
          return;
        } catch (error) {
          // Closing the share sheet is a decision, not a failure — say nothing.
          if (error instanceof Error && error.name === 'AbortError') return;
          // Anything else (no handler, blocked) — fall through and copy instead.
        }
      }

      try {
        await navigator.clipboard.writeText(url);
        toast(page.shareCopied);
      } catch {
        // The clipboard rejects in plenty of real situations: an insecure
        // origin, a denied permission, Safari outside a user gesture. Swallowing
        // that means she taps "copy" and NOTHING happens — so tell her, and tell
        // her where the link actually is.
        toast(page.shareFailed, 'error');
      }
    },
    [page.shareCopied, page.shareFailed, toast],
  );

  const pageUrl = () => window.location.href.split('#')[0];

  return (
    <PageTransition>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate py-8 lg:py-14">
        <div aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10">
          <div className="absolute -start-10 -top-10 h-72 w-72 rounded-full bg-primary-300/25 blur-3xl" />
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <ZelligeAccent variant="field" tone="brand" opacity={0.05} />
          </div>
        </div>

        <div className="max-w-prose">
          <span className="mb-4 inline-flex items-center gap-2 rounded-pill border border-line bg-card/70 px-4 py-2 text-caption font-bold text-accent-text shadow-petal backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-calm" />
            {page.eyebrow}
          </span>

          <h1 className="text-balance text-display text-ink">{page.title}</h1>
          <p className="mt-5 text-body-lg text-muted">{page.intro}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/self-check">
              <Button
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
              >
                {page.ctaSelfCheck}
              </Button>
            </Link>
            {/* Was an in-page anchor. /when-to-seek-help now carries the full
                guidance — urgency levels, timeframes, what to bring — so send
                her there. The section below stays as the in-context summary. */}
            <Link to="/when-to-seek-help">
              <Button size="lg" variant="secondary" fullWidth leftIcon={<Stethoscope size={18} />}>
                {page.ctaHelp}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="ghost"
              leftIcon={<Share2 size={18} />}
              onClick={() => share(pageUrl(), page.title)}
            >
              {page.shareCta}
            </Button>
          </div>

          {/* HARD RULE 2: this page educates, so the disclaimer is visible
              before she reads a single sign — not buried at the bottom. */}
          <Disclaimer className="mt-8" />
        </div>
      </section>

      {/* ── JUMP GRID — the 12 Care Cards ────────────────────────────────── */}
      <section className="py-8">
        <SectionHeading as="h2" size="h3" title={page.jumpTitle} />

        <motion.ul
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          initial="rest"
          whileInView="shown"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ shown: { transition: { staggerChildren: 0.03 } } }}
        >
          {signs.items.map((sign, i) => {
            const Icon = SIGN_ICONS[i];
            return (
              <motion.li
                key={sign.label}
                variants={{
                  rest: { opacity: 0, y: 14 },
                  shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                }}
                className="flex"
              >
                <a
                  href={`#${signAnchor(i)}`}
                  className="focus-ring group relative flex w-full flex-col items-center overflow-hidden rounded-3xl border border-line bg-card p-4 text-center shadow-petal transition duration-base ease-soft hover:-translate-y-1 hover:shadow-petal-lg"
                >
                  <span className="absolute start-3 top-2 font-serif text-body-sm font-semibold text-gold-text">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="relative grid h-20 w-20 place-items-center">
                    <PetalMark
                      variant={i}
                      size={78}
                      className="absolute inset-0 m-auto transition-transform duration-slow ease-soft group-hover:scale-105"
                    />
                    <Icon size={22} className="relative text-accent-text" aria-hidden />
                  </span>

                  <span className="mt-3 text-body-sm font-bold leading-snug text-ink">{sign.label}</span>
                </a>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      {/* ── THE 12, IN DETAIL ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-16 py-10 lg:gap-24">
        {signs.items.map((sign, i) => {
          const Icon = SIGN_ICONS[i];
          const imageFirst = i % 2 === 1;

          return (
            <motion.article
              key={sign.label}
              id={signAnchor(i)}
              /* scroll-mt keeps the heading clear of the sticky navbar when the
                 anchor is followed or a deep link is opened. */
              className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-2 lg:gap-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className={imageFirst ? 'lg:order-2' : undefined}>
                <div className="flex items-center gap-3">
                  <span className="relative grid h-14 w-14 shrink-0 place-items-center">
                    <PetalMark variant={i} size={56} className="absolute inset-0 m-auto" />
                    <Icon size={18} className="relative text-accent-text" aria-hidden />
                  </span>
                  <span className="font-serif text-h3 text-gold-text">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h2 className="mt-4 text-h2 text-ink">{sign.label}</h2>

                <h3 className="mt-5 text-overline uppercase text-accent-text">{signs.whatToNotice}</h3>
                <p className="mt-2 max-w-prose text-body text-muted">{sign.detail}</p>

                <button
                  type="button"
                  onClick={() => share(`${pageUrl()}#${signAnchor(i)}`, sign.label)}
                  className="focus-ring mt-5 inline-flex min-h-11 items-center gap-2 rounded-pill border border-line bg-card px-4 text-caption font-bold text-muted transition hover:text-accent-text"
                >
                  <Link2 size={14} aria-hidden />
                  {page.copySignLink}
                </button>
              </div>

              <div className={imageFirst ? 'lg:order-1' : undefined}>
                <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-line shadow-petal">
                  <ImagePlaceholder
                    spec="1200 × 900 px · 4:3 · SVG"
                    altNote={interpolate(page.imageAltTemplate, { label: sign.label })}
                    hint="Symbolic only: soft ceramic / petal forms. No anatomy, no clinical photography."
                  />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* ── WHEN TO SEEK HELP ────────────────────────────────────────────── */}
      <section id="when-to-seek" className="scroll-mt-24 py-12">
        <SectionHeading as="h2" size="h2" title={page.whenToSeekTitle} accent />

        <SafetyNote variant="seeDoctor" title={signs.nextStepTitle} className="mt-6">
          {signs.nextStepText}
        </SafetyNote>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/doctors">
            <Button size="lg" fullWidth leftIcon={<MapPin size={18} />}>
              {t.home.nextSteps.ctaDoctors}
            </Button>
          </Link>
          <Link to="/reminder">
            <Button size="lg" variant="secondary" fullWidth leftIcon={<BellRing size={18} />}>
              {t.home.nextSteps.ctaReminder}
            </Button>
          </Link>
        </div>

        {/* No disclaimer here: the Footer renders <Disclaimer full withTitle />
            immediately below this section, and two identical full disclaimers
            stacked on top of each other read as boilerplate — which is exactly
            how a disclaimer stops being read. The hero carries the short one. */}
      </section>
    </PageTransition>
  );
}
