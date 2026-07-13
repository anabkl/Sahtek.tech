import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  EyeOff,
  Gauge,
  HeartPulse,
  LibraryBig,
  LockKeyhole,
  MessageCircleHeart,
  ScanSearch,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { Companion } from '@/components/home/Companion';
import { Credibility } from '@/components/home/Credibility';
import { Faq } from '@/components/home/Faq';
import { FinalCta } from '@/components/home/FinalCta';
import { HowItWorks } from '@/components/home/HowItWorks';
import { NextSteps } from '@/components/home/NextSteps';
import { RiskFactors } from '@/components/home/RiskFactors';
import { SelfCheckPreview } from '@/components/home/SelfCheckPreview';
import { TwelveSigns } from '@/components/home/TwelveSigns';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { IconCard } from '@/components/ui/IconCard';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TrustPill } from '@/components/ui/TrustPill';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useLanguage } from '@/hooks/useLanguage';
import { useParallax } from '@/hooks/useParallax';

/* The three signals under the hero, in i18n order: no account · no tracking ·
   stays on your device. Each is a claim we can actually defend — there is no
   auth, no analytics bundle, and health state never leaves `sahtek:*` in
   localStorage. Do not add a fourth icon without a fourth provable claim. */
const HERO_TRUST_ICONS = [ShieldCheck, EyeOff, LockKeyhole];

/* The trust bar, in i18n order. `tone` is presentational only. */
const TRUST_BAR_TONES = ['calm', 'brand', 'calm', 'gold', 'brand'] as const;

/* "What Sahtek helps you do", in i18n order. The six cards trace the four verbs
   of the positioning line: recognize → learn → act earlier → know the next step. */
const HELPS = [
  { icon: LibraryBig, to: '/learn', tone: 'brand' },
  { icon: HeartPulse, to: '/self-check', tone: 'brand' },
  { icon: ScanSearch, to: '/learn', tone: 'calm' },
  { icon: Gauge, to: '/risk', tone: 'calm' },
  { icon: MessageCircleHeart, to: '/chat', tone: 'info' },
  { icon: Stethoscope, to: '/doctors', tone: 'gold' },
] as const;

export function HomePage() {
  const { t, isRTL } = useLanguage();

  /* Light hero parallax. 22px across the whole hero — enough to give the
     atmosphere a sense of depth, not enough to notice as an effect. Frozen flat
     under prefers-reduced-motion (see useParallax: MotionConfig cannot reach a
     scroll-linked transform). */
  const parallax = useParallax(22);

  return (
    <PageTransition>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={parallax.ref}
        className="relative isolate grid gap-10 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-14"
      >
        {/* Atmosphere. Air, not decoration — every layer stays faint (§4.3).
            The blooms are deliberately NOT clipped: a blur-3xl blob inside an
            overflow-hidden box gets sliced, and the cut edge reads as a solid
            pink panel. Unclipped, they fade to nothing on their own. Only the
            geometry is clipped, so it never runs into a hard corner. */}
        {/* The atmosphere is what parallaxes — never the text. Moving type as
            someone scrolls is the fastest way to make a page feel cheap and to
            make a reader feel seasick. */}
        <motion.div
          aria-hidden
          style={{ y: parallax.y }}
          className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10"
        >
          <div className="absolute -start-10 -top-10 h-72 w-72 rounded-full bg-primary-300/25 blur-3xl" />
          <div className="absolute -end-16 bottom-0 h-80 w-80 rounded-full bg-calm/10 blur-3xl" />

          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <ZelligeAccent variant="field" tone="brand" opacity={0.05} />
            <ZelligeAccent
              variant="corner"
              tone="gold"
              opacity={0.3}
              size={120}
              className="absolute end-0 top-0 -scale-x-100"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="mb-5 inline-flex items-center gap-2 rounded-pill border border-line bg-card/70 px-4 py-2 text-caption font-bold text-accent-text shadow-petal backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-calm" />
            {t.home.badge}
          </span>

          <h1 className="max-w-2xl text-balance text-display text-ink">
            {t.home.heroTitle} <span className="text-gradient">{t.home.heroHighlight}</span>
          </h1>

          <p className="mt-5 max-w-prose text-body-lg text-muted">{t.home.heroSubtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/self-check" className="sm:w-auto">
              <Button
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
              >
                {t.home.ctaPrimary}
              </Button>
            </Link>
            <Link to="/learn" className="sm:w-auto">
              <Button size="lg" variant="secondary" fullWidth>
                {t.home.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Immediate trust signals. Privacy leads — it is the differentiator. */}
          <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {t.home.heroTrust.map((signal, i) => {
              const Icon = HERO_TRUST_ICONS[i];
              return (
                <li key={signal} className="flex items-center gap-2 text-body-sm font-bold text-muted">
                  <Icon size={16} className="shrink-0 text-calm-text" aria-hidden />
                  {signal}
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* The app preview. Below the headline on mobile, beside it on desktop —
            source order gives both for free. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <PhoneMockup floating glow>
            <ImagePlaceholder
              spec="1170 × 2532 px · 9:19.5 · PNG"
              altNote={t.home.previewAlt}
              hint="Screenshot of the guided self-check, mid-step."
            />
          </PhoneMockup>
        </motion.div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section className="py-6">
        <ul
          aria-label={t.home.trustBarLabel}
          className="flex flex-wrap justify-center gap-2 rounded-3xl border border-line bg-card/70 px-4 py-4 shadow-petal backdrop-blur-xl sm:gap-3"
        >
          {t.home.trustBar.map((claim, i) => (
            <li key={claim}>
              <TrustPill tone={TRUST_BAR_TONES[i]}>{claim}</TrustPill>
            </li>
          ))}
        </ul>
      </section>

      {/* ── WHAT SAHTEK HELPS YOU DO ─────────────────────────────────────── */}
      <section className="py-10">
        <SectionHeading as="h2" size="h2" title={t.home.helpsTitle} subtitle={t.home.helpsSubtitle} accent />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.helps.map((help, i) => (
            <li key={help.title} className="flex">
              <IconCard
                icon={HELPS[i].icon}
                to={HELPS[i].to}
                tone={HELPS[i].tone}
                title={help.title}
                description={help.desc}
                className="w-full"
              />
            </li>
          ))}
        </ul>

        {/* HARD RULE 2: this page guides, so it carries the disclaimer. */}
        <Disclaimer className="mt-8" />
      </section>

      {/* ── THE 12 SIGNS — the signature section ─────────────────────────── */}
      <TwelveSigns />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── GUIDED SELF-CHECK PREVIEW ────────────────────────────────────── */}
      <SelfCheckPreview />

      {/* ── THE ASSISTANT — a companion, never a clinician ───────────────── */}
      <Companion />

      {/* ── RISK FACTORS — education, not fear ───────────────────────────── */}
      <RiskFactors />

      {/* ── WHAT TO DO NEXT — awareness becomes action ───────────────────── */}
      <NextSteps />

      {/* ── CREDIBILITY — method, not badges ─────────────────────────────── */}
      <Credibility />

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Faq />

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <FinalCta />

      {/* The shared <Footer /> is rendered by <Layout />, so it is already
          below this — it carries the full disclaimer and the privacy pill. */}
    </PageTransition>
  );
}
