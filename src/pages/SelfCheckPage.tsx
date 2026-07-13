import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BellRing,
  CalendarClock,
  CircleCheck,
  Clock,
  Eye,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Stethoscope,
  TimerReset,
  Volume2,
  type LucideIcon,
} from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Confetti } from '@/components/ui/Confetti';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { CircularProgress, Progress } from '@/components/ui/Progress';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { interpolate, useLanguage } from '@/hooks/useLanguage';
import { useSelfCheck } from '@/hooks/useSelfCheck';
import { useSpeech } from '@/hooks/useSpeech';
import { formatDuration } from '@/utils/formatters';
import type { SelfCheckStep } from '@/types/api';

/* Language-independent metadata. The WORDS live in `selfCheck.steps` in i18n —
   they used to be a hardcoded per-language map in this file, which meant the
   Darija copy could not be edited by anyone who edits Darija copy. */
const STEP_META = [
  { step_number: 1, icon: 'mirror', duration_seconds: 60 },
  { step_number: 2, icon: 'arms', duration_seconds: 45 },
  { step_number: 3, icon: 'touch', duration_seconds: 90 },
  { step_number: 4, icon: 'rest', duration_seconds: 90 },
  { step_number: 5, icon: 'alert', duration_seconds: 30 },
];

/* The four lanes of `home.nextSteps`, reused verbatim on the completion screen.
   Escalation is carried by icon and words, never colour — there is no red lane. */
const LANE_ICONS: LucideIcon[] = [CircleCheck, Eye, CalendarClock, Stethoscope];
const LANE_TILES = [
  'bg-calm-soft text-calm-text',
  'bg-accent-soft text-accent-text',
  'bg-info-soft text-info-text',
  'bg-gold-soft text-gold-text',
];

export function SelfCheckPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  // Memoised so the array keeps a stable identity — otherwise the timer's reset
  // effect refires every render and the countdown freezes.
  const guide = useMemo<SelfCheckStep[]>(
    () =>
      STEP_META.map((meta, i) => {
        const copy = t.selfCheck.steps[i];
        return {
          step_number: meta.step_number,
          icon: meta.icon,
          duration_seconds: meta.duration_seconds,
          title: copy.title,
          instruction: copy.instruction,
          what_to_look_for: copy.lookFor,
          image_url: '',
        };
      }),
    [t.selfCheck.steps],
  );

  const check = useSelfCheck(guide);
  const { speak, activeId, stop, voicesLoaded, hasVoice } = useSpeech();
  const [showReminderCta, setShowReminderCta] = useState(false);
  const ctaTimer = useRef<number | null>(null);

  const speechId = `step-${check.index}`;
  const isNarrating = activeId === speechId;
  const narrationText = check.current ? check.current.instruction || check.current.title : '';
  const canNarrate = voicesLoaded && hasVoice(lang);

  // Reveal the reminder nudge a beat after she finishes — not the instant she
  // lands, which would read as an upsell rather than a kindness.
  useEffect(() => {
    if (check.stage !== 'done') {
      setShowReminderCta(false);
      return;
    }
    ctaTimer.current = window.setTimeout(() => setShowReminderCta(true), 2000);
    return () => {
      if (ctaTimer.current) window.clearTimeout(ctaTimer.current);
    };
  }, [check.stage]);

  useEffect(() => {
    stop();
  }, [check.index, stop]);

  /* Framer animates via inline transforms in JS, so the `prefers-reduced-motion`
     block in index.css does NOT reach it. Honour the preference explicitly:
     the step still changes, it just does not slide. */
  const stepMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: check.direction * 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: check.direction * -24 },
      };

  return (
    <PageTransition>
      {/* ── INTRO ────────────────────────────────────────────────────────── */}
      {check.stage === 'intro' && (
        <section className="mx-auto max-w-2xl">
          <h1 className="text-balance text-h1 text-ink">{t.selfCheck.title}</h1>
          <p className="mt-3 text-body-lg text-muted">{t.selfCheck.subtitle}</p>

          {/* Privacy first. She is about to touch her own body in front of a
              phone; she should know what the phone is doing before she starts. */}
          <SafetyNote variant="privacy" className="mt-6">
            {t.selfCheck.privacyNote}
          </SafetyNote>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-line bg-card p-5 shadow-petal">
              <Clock size={22} className="text-accent-text" aria-hidden />
              <p className="mt-2 text-caption font-bold text-muted">{t.selfCheck.bestTime}</p>
              <p className="text-body-sm font-bold text-ink">{t.selfCheck.bestTimeValue}</p>
            </div>
            <div className="rounded-3xl border border-line bg-card p-5 shadow-petal">
              <TimerReset size={22} className="text-accent-text" aria-hidden />
              <p className="mt-2 text-caption font-bold text-muted">{t.selfCheck.duration}</p>
              <p className="text-body-sm font-bold text-ink">{t.selfCheck.durationValue}</p>
            </div>
          </div>

          <p className="mt-4 rounded-3xl border border-line bg-sunken p-5 text-body text-muted">
            {t.selfCheck.intro}
          </p>

          <ol className="mt-6 grid gap-2">
            {guide.map((step) => (
              <li
                key={step.step_number}
                className="flex items-center gap-4 rounded-2xl border border-line bg-card p-4 shadow-petal"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-cta font-serif text-body font-bold text-white">
                  {step.step_number}
                </span>
                <div className="min-w-0">
                  <h2 className="text-h4 text-ink">{step.title}</h2>
                  <p className="text-caption text-muted">{formatDuration(step.duration_seconds)}</p>
                </div>
              </li>
            ))}
          </ol>

          <Button className="mt-6" size="lg" fullWidth onClick={check.start}>
            {t.selfCheck.startBtn}
          </Button>

          <Disclaimer className="mt-6" />
        </section>
      )}

      {/* ── ACTIVE ───────────────────────────────────────────────────────── */}
      {check.stage === 'active' && check.current && (
        <section className="mx-auto max-w-2xl">
          {/* The progress indicator is about the JOURNEY (step 3 of 5), not the
              countdown. The ring below is the timer; conflating the two left her
              with no idea how much of the check was left. */}
          <div className="mb-6">
            <p className="mb-2 text-caption font-bold text-muted">
              {interpolate(t.selfCheck.progressLabel, {
                n: check.index + 1,
                total: check.total,
              })}
            </p>
            <Progress value={((check.index + 1) / check.total) * 100} />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={check.index}
              {...stepMotion}
              transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: 'easeOut' }}
              className="rounded-[2rem] border border-line bg-card p-5 text-center shadow-petal-xl sm:p-7"
            >
              <h1 className="text-h2 text-ink">{check.current.title}</h1>

              {/* The gentle illustration for this step. */}
              <div className="mx-auto mt-5 aspect-[4/3] max-w-sm overflow-hidden rounded-2xl border border-line">
                <ImagePlaceholder
                  spec="960 × 720 px · 4:3 · SVG"
                  altNote={t.selfCheck.steps[check.index].imageAlt}
                  hint="Gentle, symbolic. A calm figure or a hand — never clinical, never explicit."
                />
              </div>

              <p className="mx-auto mt-5 max-w-prose text-body-lg text-muted">
                {check.current.instruction}
              </p>

              <div className="mt-6 flex justify-center">
                <CircularProgress value={check.stepProgress * 100} size={132} strokeWidth={12}>
                  <span className="text-h3 text-ink" aria-live="off">
                    {formatDuration(check.remaining)}
                  </span>
                </CircularProgress>
              </div>

              {canNarrate && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant={isNarrating ? 'primary' : 'outline'}
                    size="sm"
                    leftIcon={isNarrating ? <Pause size={16} /> : <Volume2 size={16} />}
                    onClick={() => speak(narrationText, lang, speechId)}
                  >
                    {isNarrating ? t.selfCheck.listenPause : t.selfCheck.listen}
                  </Button>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-overline uppercase text-accent-text">
                  {t.selfCheck.whatToLookFor}
                </h2>
                <ul className="mt-2 flex flex-wrap justify-center gap-2">
                  {check.current.what_to_look_for.map((item) => (
                    <li
                      key={item}
                      className="rounded-pill bg-accent-soft px-3 py-1.5 text-caption font-bold text-accent-text"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buttons only — no inputs, nothing to fill in, nothing to get
                  wrong. She is following along, not filling a form. */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  onClick={check.togglePause}
                  leftIcon={check.paused ? <Play size={18} /> : <Pause size={18} />}
                >
                  {check.paused ? t.selfCheck.resume : t.selfCheck.pause}
                </Button>
                <Button variant="outline" onClick={check.skipTimer} leftIcon={<SkipForward size={18} />}>
                  {t.selfCheck.timerSkip}
                </Button>
                <Button variant="secondary" disabled={check.isFirst} onClick={check.prev}>
                  {t.selfCheck.prevStep}
                </Button>
                <Button onClick={check.next}>
                  {check.isLast ? t.selfCheck.finishBtn : t.selfCheck.nextStep}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <Disclaimer className="mt-6" />
        </section>
      )}

      {/* ── DONE ─────────────────────────────────────────────────────────── */}
      {check.stage === 'done' && (
        <section className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-6 text-center shadow-petal-xl sm:p-8">
            {/* Confetti already no-ops under prefers-reduced-motion. */}
            <Confetti />
            <CircleCheck size={52} className="mx-auto text-calm" aria-hidden />
            <h1 className="mt-4 text-balance text-h1 text-ink">{t.selfCheck.celebrateTitle}</h1>
            <p className="mx-auto mt-3 max-w-prose text-body text-muted">{t.selfCheck.completeText}</p>
          </div>

          {/* Route her into the decision logic. Finishing a check is not the end
              of anything — the question she actually has is "so what now?", and
              this is the same four-lane logic the homepage teaches. No score, no
              verdict: the lane is chosen by HER, from what she noticed. */}
          <div className="mt-10">
            <SectionHeading as="h2" size="h2" title={t.selfCheck.nextStepsTitle} accent />

            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {t.home.nextSteps.cards.map((card, i) => {
                const Icon = LANE_ICONS[i];
                return (
                  <li
                    key={card.state}
                    className="flex flex-col rounded-3xl border border-line bg-card p-5 text-start shadow-petal"
                  >
                    <span className={`grid h-11 w-11 place-items-center rounded-2xl ${LANE_TILES[i]}`}>
                      <Icon size={20} aria-hidden />
                    </span>
                    <h3 className="mt-4 text-h4 text-ink">{card.state}</h3>
                    <p className="mt-1.5 text-body-sm text-muted">{card.meaning}</p>
                    <p className="mt-4 border-t border-line pt-3 text-body-sm font-semibold text-ink">
                      {card.action}
                    </p>
                  </li>
                );
              })}
            </ol>

            <SafetyNote variant="seeDoctor" className="mt-6">
              {t.selfCheck.importantNote}
            </SafetyNote>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button to="/doctors" size="lg" fullWidth leftIcon={<MapPin size={18} />}>
                  {t.home.nextSteps.ctaDoctors}
                </Button>
              <Button to="/signs" size="lg" variant="secondary" fullWidth leftIcon={<Eye size={18} />}>
                  {t.home.signs.allCta}
                </Button>
            </div>
          </div>

          <AnimatePresence>
            {showReminderCta && (
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="mt-8 rounded-[2rem] bg-brand-cta p-6 text-start text-white shadow-petal-xl"
              >
                <div className="flex items-center gap-2">
                  <BellRing size={22} aria-hidden />
                  <h2 className="text-h3">{t.selfCheck.reminderCtaTitle}</h2>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button variant="secondary" fullWidth onClick={() => navigate('/reminder')}>
                    {t.selfCheck.reminderCtaYes}
                  </Button>
                  <Button
                    fullWidth
                    className="border-2 border-white/70 bg-transparent text-white shadow-none hover:bg-white/10"
                    onClick={() => setShowReminderCta(false)}
                  >
                    {t.selfCheck.reminderCtaNo}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            className="mt-8"
            fullWidth
            variant="secondary"
            onClick={check.restart}
            leftIcon={<RotateCcw size={18} />}
          >
            {t.selfCheck.restart}
          </Button>

          <Disclaimer className="mt-6" />
        </section>
      )}
    </PageTransition>
  );
}
