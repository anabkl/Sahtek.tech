import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CircleCheck,
  ClipboardList,
  Eye,
  MapPin,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { PetalMark } from '@/components/ui/PetalMark';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useLanguage } from '@/hooks/useLanguage';

/* The four urgency levels, in the order of `home.nextSteps.cards`.
 *
 * The escalation is carried by the ICON, the WORDS and the TIMEFRAME — never by
 * colour. There is no red level anywhere on this page. A woman arrives here
 * having just found something, frightened, looking for permission to act; a red
 * card would confirm the worst thing she is already thinking, which is both
 * cruel and (statistically) wrong. The most urgent level is gold: warm,
 * attention-getting, calm (HARD RULE 3).
 */
const LEVELS: { icon: LucideIcon; tile: string; edge: string }[] = [
  { icon: CircleCheck, tile: 'bg-calm-soft text-calm-text', edge: 'border-t-calm' },
  { icon: Eye, tile: 'bg-accent-soft text-accent-text', edge: 'border-t-accent' },
  { icon: CalendarClock, tile: 'bg-info-soft text-info-text', edge: 'border-t-info' },
  { icon: Stethoscope, tile: 'bg-gold-soft text-gold-text', edge: 'border-t-gold' },
];

/**
 * /when-to-seek-help — the page that has to be trustworthy.
 *
 * The urgency levels are `home.nextSteps.cards`, reused verbatim rather than
 * rewritten. The same guidance appears on the homepage and on the self-check
 * completion screen; if it were written three times it would eventually say
 * three different things, and the one place that must never drift is the page
 * that tells a frightened woman whether to wait or to act.
 *
 * The `timeframes` are this page's own addition: each level gets an explicit
 * "how soon", because "see a doctor" without a horizon is exactly the advice
 * people postpone.
 */
export function WhenToSeekHelpPage() {
  const { t, isRTL } = useLanguage();
  const page = t.whenToSeekPage;

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

          {/* The disclaimer is prominent BY POSITION, not by shouting. It sits
              above the guidance, at full length, before she reads a word of
              advice — because this is the page where she will act on it. */}
          <Disclaimer full withTitle className="mt-6" />

          {/* SafetyNote renders its own icon per variant (care = HeartHandshake).
              Adding one inline gave the note two hearts side by side. */}
          <SafetyNote variant="care" className="mt-3">
            {page.reassureNote}
          </SafetyNote>
        </div>
      </section>

      {/* ── URGENCY LEVELS ───────────────────────────────────────────────── */}
      <section className="py-10">
        <SectionHeading as="h2" size="h2" title={page.urgencyTitle} accent />

        <motion.ol
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="rest"
          whileInView="shown"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ shown: { transition: { staggerChildren: 0.07 } } }}
        >
          {t.home.nextSteps.cards.map((card, i) => {
            const { icon: Icon, tile, edge } = LEVELS[i];
            return (
              <motion.li
                key={card.state}
                variants={{
                  rest: { opacity: 0, y: 18 },
                  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
                }}
                className={`flex flex-col rounded-3xl border border-t-4 border-line bg-card p-5 shadow-petal ${edge}`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tile}`}>
                  <Icon size={20} aria-hidden />
                </span>

                <h3 className="mt-4 text-h4 text-ink">{card.state}</h3>
                <p className="mt-1.5 text-body-sm text-muted">{card.meaning}</p>

                {/* The horizon. "See a doctor" with no timeframe is the advice
                    people postpone indefinitely. */}
                <p className="mt-4 inline-flex items-center gap-1.5 self-start rounded-pill bg-sunken px-3 py-1.5 text-caption font-bold text-ink">
                  <CalendarClock size={13} className="shrink-0 text-accent-text" aria-hidden />
                  {page.timeframes[i]}
                </p>

                <p className="mt-3 border-t border-line pt-3 text-body-sm font-semibold text-ink">
                  {card.action}
                </p>
              </motion.li>
            );
          })}
        </motion.ol>
      </section>

      {/* ── CHANGES NOT TO IGNORE ────────────────────────────────────────── */}
      <section className="py-10">
        <SectionHeading
          as="h2"
          size="h2"
          title={page.doNotIgnoreTitle}
          subtitle={page.doNotIgnoreNote}
          accent
        />

        <motion.ul
          className="mt-8 grid gap-3 sm:grid-cols-2"
          initial="rest"
          whileInView="shown"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ shown: { transition: { staggerChildren: 0.04 } } }}
        >
          {page.doNotIgnore.map((change, i) => (
            <motion.li
              key={change}
              variants={{
                rest: { opacity: 0, y: 14 },
                shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
              }}
              className="flex items-center gap-4 rounded-2xl border border-line bg-card p-4 shadow-petal"
            >
              {/* The ceramic form, not a warning triangle. This is a list of
                  things to have looked at, not a list of alarms. */}
              <span className="relative grid h-12 w-12 shrink-0 place-items-center">
                <PetalMark variant={i} size={48} className="absolute inset-0 m-auto" />
                <Eye size={16} className="relative text-accent-text" aria-hidden />
              </span>
              <span className="text-body-sm font-semibold text-ink">{change}</span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-6 flex justify-center">
          <Link to="/signs">
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight size={18} className={isRTL ? 'rotate-180' : undefined} />}
            >
              {page.seeAllSigns}
            </Button>
          </Link>
        </div>
      </section>

      {/* ── PREPARING FOR THE APPOINTMENT ────────────────────────────────── */}
      <section className="py-10">
        <div className="rounded-[2rem] border border-line bg-sunken p-6 sm:p-8">
          <h2 className="flex items-center gap-2.5 text-h3 text-ink">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text">
              <ClipboardList size={20} aria-hidden />
            </span>
            {page.prepareTitle}
          </h2>
          <p className="mt-2 text-body-sm text-muted">{page.prepareNote}</p>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {page.prepare.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-body-sm text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="pb-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/doctors">
            <Button size="lg" fullWidth leftIcon={<MapPin size={18} />}>
              {page.ctaDoctors}
            </Button>
          </Link>
          <Link to="/self-check">
            <Button size="lg" variant="secondary" fullWidth leftIcon={<BellRing size={18} />}>
              {page.ctaSelfCheck}
            </Button>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
