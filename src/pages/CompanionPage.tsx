import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Keyboard,
  Mic,
  MessageCircleHeart,
  Sparkles,
  X,
} from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { RibbonMark } from '@/components/ui/RibbonMark';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * /companion — what the assistant is, and what it is not.
 *
 * The page is structured as an argument, in order: what it CAN do, what it
 * CANNOT do, its limits, where the words go, and only then the CTA. She should
 * know what she is opening before she opens it.
 *
 * The "cannot" column is given exactly as much visual weight as the "can"
 * column. That is the point of the page: an assistant in a breast-health app is
 * one bad sentence away from sounding like a doctor, and the honest move is to
 * put the refusals on the same footing as the features, not in small print
 * underneath them.
 *
 * The phone shows the assistant REFUSING to diagnose. It is the most useful
 * thing we can demonstrate, and it is what actually happens: the chat answers
 * from a bundled knowledge base and has no diagnostic path at all.
 */
export function CompanionPage() {
  const { t, isRTL } = useLanguage();
  const page = t.companionPage;

  return (
    <PageTransition>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-12">
        <div aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10">
          <div className="absolute -start-10 -top-10 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <ZelligeAccent variant="field" tone="brand" opacity={0.05} />
          </div>
        </div>

        <div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-pill border border-line bg-card/70 px-4 py-2 text-caption font-bold text-accent-text shadow-petal backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-calm" />
            {page.eyebrow}
          </span>

          <h1 className="text-balance text-display text-ink">{page.title}</h1>
          <p className="mt-5 max-w-prose text-body-lg text-muted">{page.intro}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/chat">
              <Button
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
              >
                {page.cta}
              </Button>
            </Link>
            <Link to="/signs">
              <Button size="lg" variant="secondary" fullWidth>
                {page.ctaSecondary}
              </Button>
            </Link>
          </div>

          <Disclaimer className="mt-8" />
        </div>

        {/* The refusal, demonstrated. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          <PhoneMockup glow>
            <div className="flex h-full flex-col bg-canvas">
              <div className="flex items-center gap-2 border-b border-line px-4 pb-3 pt-9">
                <RibbonMark size={22} />
                <span className="text-caption font-bold text-ink">{t.common.assistant}</span>
                <span className="ms-auto inline-flex items-center gap-1 text-[10px] font-bold text-calm-text">
                  <Sparkles size={10} aria-hidden />
                  {t.chat.online}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 px-4 py-4">
                <p className="ms-auto max-w-[85%] rounded-2xl rounded-ee-sm bg-brand-cta px-3 py-2 text-caption leading-relaxed text-white">
                  {page.mock.question}
                </p>
                <p className="me-auto max-w-[92%] rounded-2xl rounded-es-sm border border-line bg-card px-3 py-2 text-caption leading-relaxed text-ink">
                  {page.mock.answer}
                </p>

                <p className="mt-auto rounded-xl bg-accent-soft px-3 py-2 text-[10px] leading-relaxed text-muted">
                  {t.chat.disclaimer}
                </p>
              </div>
            </div>
          </PhoneMockup>
        </motion.div>
      </section>

      {/* ── CAN / CANNOT ─────────────────────────────────────────────────── */}
      <section className="py-10">
        <div className="grid gap-4 lg:grid-cols-2">
          <motion.div
            className="rounded-[2rem] border border-line bg-card p-6 shadow-petal"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <h2 className="flex items-center gap-2.5 text-h3 text-ink">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-calm-soft text-calm-text">
                <Check size={20} aria-hidden />
              </span>
              {page.canTitle}
            </h2>

            <ul className="mt-5 flex flex-col gap-3">
              {page.can.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-body text-muted">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-calm-soft text-calm-text">
                    <Check size={12} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Same size, same weight, same shadow as the column above. The
              refusals are not fine print. */}
          <motion.div
            className="rounded-[2rem] border border-line bg-card p-6 shadow-petal"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.45, delay: 0.05, ease: 'easeOut' }}
          >
            <h2 className="flex items-center gap-2.5 text-h3 text-ink">
              {/* gold, not red: this is a boundary, not an alarm (HARD RULE 3). */}
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gold-soft text-gold-text">
                <X size={20} aria-hidden />
              </span>
              {page.cannotTitle}
            </h2>

            <ul className="mt-5 flex flex-col gap-3">
              {page.cannot.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-body text-muted">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-text">
                    <X size={12} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── SAFETY LIMITS ────────────────────────────────────────────────── */}
      <section className="py-10">
        <SectionHeading as="h2" size="h2" title={page.safetyTitle} accent />

        <div className="mt-6 flex flex-col gap-3">
          <SafetyNote variant="medical">{page.safetyNote}</SafetyNote>
          {/* No inline icon: SafetyNote already renders one per variant, and
              adding a second put two glyphs side by side. */}
          <SafetyNote variant="seeDoctor">{page.emergencyNote}</SafetyNote>
        </div>
      </section>

      {/* ── EXAMPLE QUESTIONS ────────────────────────────────────────────── */}
      <section className="py-10">
        <SectionHeading as="h2" size="h2" title={page.examplesTitle} accent />

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {page.examples.map((question) => (
            <li key={question}>
              <Link
                to="/chat"
                className="focus-ring group flex min-h-14 w-full items-center gap-3 rounded-2xl border border-line bg-card p-4 text-start shadow-petal transition duration-base ease-soft hover:-translate-y-1 hover:shadow-petal-lg"
              >
                <MessageCircleHeart size={18} className="shrink-0 text-accent-text" aria-hidden />
                <span className="text-body-sm font-bold text-ink">{question}</span>
                <ArrowRight
                  size={15}
                  className={`ms-auto shrink-0 text-faint ${isRTL ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── PRIVACY ──────────────────────────────────────────────────────── */}
      <section className="py-10">
        <SectionHeading as="h2" size="h2" title={page.privacyTitle} accent />

        {/* Two claims, because there are two answers. Typing never leaves the
            device; the microphone does. Collapsing these into one reassuring
            sentence would be the easiest lie on the whole site. */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-line bg-calm-soft p-5">
            <h3 className="flex items-center gap-2 text-h4 text-ink">
              <Keyboard size={18} className="text-calm-text" aria-hidden />
              {page.typedLabel}
            </h3>
            <p className="mt-2 text-body-sm text-muted">{page.privacyTyped}</p>
          </div>

          <div className="rounded-3xl border border-line bg-gold-soft p-5">
            <h3 className="flex items-center gap-2 text-h4 text-ink">
              <Mic size={18} className="text-gold-text" aria-hidden />
              {t.chat.voiceLabel}
            </h3>
            <p className="mt-2 text-body-sm text-muted">{page.privacyVoice}</p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-10">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-cta p-8 text-center shadow-petal-xl sm:p-12">
          <ZelligeAccent variant="field" tone="current" opacity={0.07} className="text-white" />

          <div className="relative mx-auto flex max-w-xl flex-col items-center">
            <RibbonMark size={46} tone="current" className="text-white" animated />
            <h2 className="mt-5 text-h1 text-white">{page.cta}</h2>
            <p className="mt-3 text-body-lg text-white">{t.chat.subtitle}</p>

            <div className="mt-7 w-full sm:w-auto">
              <Link to="/chat">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
                >
                  {page.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
