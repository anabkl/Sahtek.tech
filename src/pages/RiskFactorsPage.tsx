
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Baby,
  Clock,
  FileText,
  HeartPulse,
  Info,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TrustPill } from '@/components/ui/TrustPill';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useLanguage } from '@/hooks/useLanguage';

/* The six groups, in the order of `riskFactorsPage.groups`.
 *
 * `changeable` is the only judgement this page makes, and it is a judgement
 * about the FACTOR, never about her: "you can influence this" vs "not something
 * you can change". It exists to take guilt off the table — most of this list is
 * age, genes and biography, none of which anyone chooses.
 *
 * Deliberately NOT colour-graded by severity. A red/amber/green wall would turn
 * a woman's own history into a scoreboard, and that is the opposite of what an
 * educational page is for (HARD RULE 1 and 3).
 */
const GROUP_META: { icon: LucideIcon; changeable: boolean }[] = [
  { icon: Clock, changeable: false }, // age
  { icon: Users, changeable: false }, // family history
  { icon: FileText, changeable: false }, // personal history
  { icon: Baby, changeable: false }, // hormonal & reproductive
  { icon: HeartPulse, changeable: true }, // lifestyle
  { icon: Info, changeable: false }, // other
];

const groupAnchor = (i: number) => `group-${i + 1}`;

/**
 * /risk-factors — the educational companion to /risk.
 *
 * /risk is the questionnaire (it produces an awareness score). This page makes
 * no score at all: it explains what a risk factor IS, groups the factors, and
 * says plainly that having them predicts nothing. The funnel is learn → assess,
 * so the CTA at the bottom points at /risk, not the other way round.
 */
export function RiskFactorsPage() {
  const { t, isRTL } = useLanguage();
  const page = t.riskFactorsPage;

  return (
    <PageTransition>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate py-8 lg:py-12">
        <div aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10">
          <div className="absolute -start-10 -top-10 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
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

          {/* The load-bearing sentence of the whole page: informational, not
              predictive. It goes above the factors, not below them — she should
              read it before she starts counting herself. */}
          <SafetyNote variant="care" className="mt-6">
            {page.keyNote}
          </SafetyNote>

          <Disclaimer className="mt-3" />
        </div>

        {/* Jump chips — the whole point of grouping is scannability, and on a
            phone a six-section page is a lot of thumb. */}
        <nav aria-label={page.eyebrow} className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {page.groups.map((group, i) => {
              const Icon = GROUP_META[i].icon;
              return (
                <li key={group.title}>
                  <a
                    href={`#${groupAnchor(i)}`}
                    className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-pill border border-line bg-card px-4 text-caption font-bold text-ink shadow-petal transition hover:text-accent-text"
                  >
                    <Icon size={15} className="text-accent-text" aria-hidden />
                    {group.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </section>

      {/* ── THE SIX GROUPS ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-8 py-6">
        {page.groups.map((group, i) => {
          const { icon: Icon, changeable } = GROUP_META[i];

          return (
            <motion.section
              key={group.title}
              id={groupAnchor(i)}
              className="scroll-mt-24 rounded-[2rem] border border-line bg-card p-5 shadow-petal sm:p-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <div className="flex flex-wrap items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text">
                  <Icon size={22} aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="text-h3 text-ink">{group.title}</h2>
                  <p className="mt-1.5 text-body-sm text-muted">{group.note}</p>
                </div>

                {/* basis-full on mobile: sharing the row with the heading
                    squeezed titles like "Personal history" onto two lines. It
                    drops to its own line on a phone and sits inline from sm up. */}
                <TrustPill
                  tone={changeable ? 'calm' : 'neutral'}
                  className="order-last shrink-0 basis-full sm:order-none sm:basis-auto"
                >
                  {changeable ? page.changeableLabel : page.notChangeableLabel}
                </TrustPill>
              </div>

              {/* Soft infographic blocks. On a phone these stack into one
                  column of short, scannable rows rather than a dense wall. */}
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {group.factors.map((factor) => (
                  <li
                    key={factor.title}
                    className="rounded-2xl border border-line bg-sunken p-4"
                  >
                    <h3 className="text-body-sm font-bold text-ink">{factor.title}</h3>
                    <p className="mt-1 text-caption leading-relaxed text-muted">{factor.desc}</p>
                  </li>
                ))}
              </ul>
            </motion.section>
          );
        })}
      </div>

      {/* ── WHERE TO GO NEXT ─────────────────────────────────────────────── */}
      <section className="py-10">
        <SectionHeading as="h2" size="h3" title={t.home.nextSteps.eyebrow} accent />

        <SafetyNote variant="seeDoctor" className="mt-6">
          {t.risk.intro}
        </SafetyNote>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button to="/risk"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
            >
              {page.ctaAssessment}
            </Button>
          <Button to="/doctors" size="lg" variant="secondary" fullWidth leftIcon={<Stethoscope size={18} />}>
              {page.ctaDoctors}
            </Button>
        </div>
      </section>
    </PageTransition>
  );
}
