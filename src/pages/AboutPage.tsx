import { ArrowRight, BookOpenCheck, Eye } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { RibbonMark } from '@/components/ui/RibbonMark';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * /about — the mission.
 *
 * The principles are `home.credibility.points` and `home.credibility.method`,
 * reused. This page makes no new claim about who we are: every line of it is
 * something already enforced in the codebase (no diagnosis copy, no analytics,
 * Darija authored first). An About page is the easiest place on a health site to
 * start overclaiming, and reusing the checkable claims is how we avoid it.
 */
export function AboutPage() {
  const { t, isRTL } = useLanguage();
  const page = t.aboutPage;
  const credibility = t.home.credibility;

  return (
    <PageTransition>
      <section className="relative isolate py-8 lg:py-12">
        <div aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10">
          <div className="absolute -start-10 -top-10 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <ZelligeAccent variant="field" tone="brand" opacity={0.05} />
          </div>
        </div>

        <div className="max-w-prose">
          <RibbonMark size={52} />

          <span className="mb-4 mt-5 inline-flex items-center gap-2 rounded-pill border border-line bg-card/70 px-4 py-2 text-caption font-bold text-accent-text shadow-petal backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-calm" />
            {page.eyebrow}
          </span>

          <h1 className="text-balance text-display text-ink">{page.title}</h1>
          <p className="mt-5 text-body-lg text-muted">{page.intro}</p>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────────── */}
      <section className="py-8">
        <SectionHeading as="h2" size="h2" title={page.missionTitle} accent />
        <p className="mt-6 max-w-prose text-body-lg leading-8 text-muted">{page.mission}</p>
      </section>

      {/* ── PRINCIPLES ───────────────────────────────────────────────────── */}
      <section className="py-8">
        <SectionHeading as="h2" size="h2" title={page.principlesTitle} accent />

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {credibility.points.map((point) => (
            <li key={point.title} className="rounded-3xl border border-line bg-card p-5 shadow-petal">
              <h3 className="text-h4 text-ink">{point.title}</h3>
              <p className="mt-1.5 text-body-sm text-muted">{point.desc}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-3xl border border-line bg-sunken p-6">
          <h3 className="flex items-center gap-2 text-h4 text-ink">
            <BookOpenCheck size={20} className="text-accent-text" aria-hidden />
            {credibility.methodTitle}
          </h3>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {credibility.method.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5 text-body-sm text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <Disclaimer full withTitle className="mt-6" />
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="pb-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            to="/self-check"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
          >
            {page.ctaPrimary}
          </Button>
          <Button to="/signs" size="lg" variant="secondary" fullWidth leftIcon={<Eye size={18} />}>
            {page.ctaSecondary}
          </Button>
        </div>
      </section>
    </PageTransition>
  );
}
