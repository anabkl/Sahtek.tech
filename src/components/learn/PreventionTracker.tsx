import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Apple,
  Check,
  CigaretteOff,
  Footprints,
  HandHeart,
  Moon,
  Share2,
  Stethoscope,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Confetti } from '@/components/ui/Confetti';
import { useToast } from '@/components/ui/toastStore';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

const TOTAL = 6;
const CHECKED_KEY = 'sahtek.prevention.checked';
const CHALLENGE_KEY = 'sahtek.prevention.challenge';

/** Per-habit weight (sums to 100), icon, and optional tip CTA — keyed to the i18n habit.key. */
const HABIT_META: Record<
  string,
  { weight: number; icon: LucideIcon; link?: string; ctaKey?: 'tipCtaGuide' | 'tipCtaReminder' }
> = {
  selfExam: { weight: 25, icon: HandHeart, link: '/self-check', ctaKey: 'tipCtaGuide' },
  doctor: { weight: 20, icon: Stethoscope, link: '/reminder', ctaKey: 'tipCtaReminder' },
  exercise: { weight: 15, icon: Footprints },
  eating: { weight: 15, icon: Apple },
  noSmoking: { weight: 15, icon: CigaretteOff },
  sleep: { weight: 10, icon: Moon },
};

type StatusId = 'start' | 'good' | 'going' | 'almost' | 'hero';

function statusFor(count: number): { id: StatusId; stroke: string; text: string } {
  if (count === 0) return { id: 'start', stroke: '#E2E8F0', text: 'text-risk-high' };
  if (count <= 2) return { id: 'good', stroke: '#F97316', text: 'text-orange-500' };
  if (count <= 4) return { id: 'going', stroke: '#84CC16', text: 'text-lime-600' };
  if (count === 5) return { id: 'almost', stroke: '#16A34A', text: 'text-risk-low' };
  return { id: 'hero', stroke: '#16A34A', text: 'text-risk-low' };
}

function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

function loadChecked(): string[] {
  try {
    const raw = localStorage.getItem(CHECKED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string' && k in HABIT_META) : [];
  } catch {
    return [];
  }
}

function loadChallenge(): { month: string; days: number[] } {
  const fresh = { month: monthKey(), days: [] as number[] };
  try {
    const raw = localStorage.getItem(CHALLENGE_KEY);
    if (!raw) return fresh;
    const parsed = JSON.parse(raw) as { month?: string; days?: number[] };
    // A new month resets the tracker.
    if (parsed.month !== fresh.month || !Array.isArray(parsed.days)) return fresh;
    return { month: fresh.month, days: parsed.days.filter((n) => typeof n === 'number') };
  } catch {
    return fresh;
  }
}


/** Interactive prevention checklist: progress ring, score, tips, share card and monthly tracker. */
export function PreventionTracker() {
  const { t, dir } = useLanguage();
  const p = t.learn.prevention;
  const habits = t.learn.habits;
  const toast = useToast();
  const reduce = useReducedMotion();

  const [checked, setChecked] = useState<string[]>(loadChecked);
  const [challenge, setChallenge] = useState(loadChallenge);

  const count = checked.length;
  const status = statusFor(count);
  const score = useMemo(
    () => checked.reduce((sum, key) => sum + (HABIT_META[key]?.weight ?? 0), 0),
    [checked],
  );

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem(CHECKED_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — keep in-memory state */
      }
      return next;
    });
    toast(p.savedToast);
  };

  // --- Monthly challenge ---
  const today = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const confirmedToday = challenge.days.includes(today);
  const streak = useMemo(() => {
    const set = new Set(challenge.days);
    let s = 0;
    for (let d = today; set.has(d); d--) s++;
    return s;
  }, [challenge.days, today]);

  const confirmToday = () => {
    if (confirmedToday) return;
    const next = { month: monthKey(), days: [...challenge.days, today].sort((a, b) => a - b) };
    setChallenge(next);
    try {
      localStorage.setItem(CHALLENGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    toast(p.savedToast);
  };

  const share = async () => {
    const text = p.shareText;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        /* user dismissed the share sheet */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard blocked — the visible card is still screenshot-friendly */
    }
    toast(p.shareCopied);
  };

  const RADIUS = 54;
  const CIRC = 2 * Math.PI * RADIUS;

  return (
    <div className="space-y-5">
      <p className="font-medium leading-7 text-muted">{t.learn.preventionIntro}</p>

      {/* Progress ring */}
      <section className="relative flex flex-col items-center rounded-[2rem] border border-white/70 bg-card/85 p-6 text-center shadow-petal-xl">
        <div className="relative h-[140px] w-[140px]">
          <AnimatePresence>{count === TOTAL && !reduce && <Confetti />}</AnimatePresence>
          <svg width={140} height={140} className="-rotate-90">
            <circle cx={70} cy={70} r={RADIUS} fill="none" stroke="rgba(214,51,132,0.12)" strokeWidth={12} />
            <motion.circle
              cx={70}
              cy={70}
              r={RADIUS}
              fill="none"
              stroke={status.stroke}
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={false}
              animate={{ strokeDashoffset: CIRC * (1 - count / TOTAL) }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-3xl font-black text-ink tabular-nums">
              {count}/{TOTAL}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm font-bold text-muted">
          {count}/{TOTAL} {p.protectedLabel}
        </p>
        <p className={cn('mt-1 text-lg font-black', status.text)}>{p.status[status.id]}</p>
      </section>

      {/* Checklist with inline tips */}
      <section className="space-y-2.5">
        {habits.map((habit) => {
          const active = checked.includes(habit.key);
          const meta = HABIT_META[habit.key];
          const Icon = meta?.icon ?? Check;
          return (
            <div key={habit.key}>
              <button
                type="button"
                onClick={() => toggle(habit.key)}
                aria-pressed={active}
                className={cn(
                  'flex w-full min-h-14 items-center gap-3 rounded-2xl border p-4 text-start font-bold transition',
                  active ? 'border-accent-teal bg-accent-teal/10 text-ink' : 'border-line bg-white/55 text-muted',
                )}
              >
                <motion.span
                  initial={false}
                  animate={active ? 'on' : 'off'}
                  variants={{ off: { scale: 1 }, on: { scale: [1, 1.3, 1] } }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-colors',
                    active ? 'border-accent-teal bg-accent-teal text-white' : 'border-line text-transparent',
                  )}
                >
                  <Check size={18} />
                </motion.span>
                <Icon size={20} className={active ? 'text-accent-teal' : 'text-primary-400'} />
                <span className="flex-1">{habit.label}</span>
              </button>

              <AnimatePresence initial={false}>
                {!active && (
                  <motion.div
                    key="tip"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-primary-100 bg-primary-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-bold leading-6 text-primary-800">{habit.tip}</p>
                      {meta?.link && meta.ctaKey && (
                        <Link to={meta.link} className="shrink-0">
                          <Button size="sm" variant="outline">
                            {p[meta.ctaKey]}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>

      {/* Protection score (3+ habits) */}
      <AnimatePresence>
        {count >= 3 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-3xl border border-white/70 bg-card/85 p-5 shadow-petal"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-black text-ink">{p.scoreLabel}</span>
              <span className="text-xl font-black text-primary-600 tabular-nums">{score}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-line/40">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-risk-high via-amber-400 to-risk-low"
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Share card (6/6) */}
      <AnimatePresence>
        {count === TOTAL && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="space-y-3"
          >
            <div className="overflow-hidden rounded-[1.75rem] bg-brand-cta p-6 text-center text-white shadow-petal-xl">
              <Trophy className="mx-auto" size={40} />
              <p className="mt-3 text-lg font-black">{p.shareCardLine1}</p>
              <p className="mt-1 text-2xl font-black">{p.shareCardLine2}</p>
              {/* Solid white, not white/80: any transparency drops below 4.5:1 on the gradient. */}
              <p className="mt-3 text-sm font-bold text-white">sahtek.tech</p>
            </div>
            <Button fullWidth leftIcon={<Share2 size={18} />} onClick={share}>
              {p.shareBtn}
            </Button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Monthly challenge tracker */}
      <section className="rounded-3xl border border-white/70 bg-card/85 p-5 shadow-petal">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-black text-ink">{p.challengeTitle}</h3>
          <span className="rounded-full bg-accent-teal/10 px-3 py-1 text-sm font-black text-accent-teal tabular-nums">
            🔥 {streak} {p.streakLabel}
          </span>
        </div>
        <p className="mt-2 text-sm font-medium leading-6 text-muted">{p.challengeDesc}</p>
        <div className="mt-4 grid grid-cols-10 gap-1.5" dir={dir}>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const done = challenge.days.includes(day);
            const isToday = day === today;
            return (
              <span
                key={day}
                aria-hidden
                className={cn(
                  'aspect-square rounded-full transition-colors',
                  done ? 'bg-accent-teal' : 'bg-line/50',
                  isToday && 'ring-2 ring-primary-400 ring-offset-1 ring-offset-card',
                )}
              />
            );
          })}
        </div>
        <Button
          className="mt-4"
          fullWidth
          variant={confirmedToday ? 'secondary' : 'primary'}
          disabled={confirmedToday}
          onClick={confirmToday}
        >
          {confirmedToday ? p.confirmedToday : p.confirmTodayBtn}
        </Button>
      </section>
    </div>
  );
}
