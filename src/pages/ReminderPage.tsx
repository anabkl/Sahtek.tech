import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCircle2, Pencil } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Confetti } from '@/components/ui/Confetti';
import { GlassCalendar } from '@/components/reminder/GlassCalendar';
import { USE_MOCK } from '@/config/api';
import { useToast } from '@/components/ui/toastStore';
import { useLanguage, interpolate } from '@/hooks/useLanguage';
import { formatDate, nextReminderDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';

type ReminderTime = 'morning' | 'afternoon' | 'evening';
type Method = 'push' | 'email' | 'whatsapp';

const TIME_CLOCK: Record<ReminderTime, string> = { morning: '8:00', afternoon: '14:00', evening: '20:00' };
const TIME_META: { key: ReminderTime; emoji: string; ring: string }[] = [
  { key: 'morning', emoji: '☀️', ring: 'border-amber-200' },
  { key: 'afternoon', emoji: '🌤️', ring: 'border-orange-200' },
  { key: 'evening', emoji: '🌙', ring: 'border-indigo-200' },
];
const METHOD_META: { key: Method; emoji: string }[] = [
  { key: 'push', emoji: '🔔' },
  { key: 'email', emoji: '📧' },
  { key: 'whatsapp', emoji: '💬' },
];

const STORAGE_KEY = 'sahtek.reminder';

interface ReminderSettings {
  reminderDay: number;
  reminderTime: ReminderTime;
  notificationMethods: Method[];
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

function loadSettings(): ReminderSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReminderSettings) : null;
  } catch {
    return null;
  }
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => v.replace(/\D/g, '').length >= 6;

/** A wizard step that slides up when it appears. */
function StepCard({ children }: { children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}

/** SVG checkmark that draws itself in. */
function DrawnCheck() {
  return (
    <motion.svg viewBox="0 0 52 52" className="mx-auto h-20 w-20" initial="hidden" animate="visible">
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="#16A34A"
        strokeWidth="3"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M15 27 l8 8 l15 -17"
        fill="none"
        stroke="#16A34A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
      />
    </motion.svg>
  );
}

export function ReminderPage() {
  const { t, lang, isRTL } = useLanguage();
  const r = t.reminder;
  const existing = useMemo(loadSettings, []);

  const [mode, setMode] = useState<'setup' | 'confirmed'>(existing?.isActive ? 'confirmed' : 'setup');
  const [day, setDay] = useState<number | null>(existing?.reminderDay ?? null);
  const [time, setTime] = useState<ReminderTime | null>(existing?.reminderTime ?? null);
  const [methods, setMethods] = useState<Method[]>(existing?.notificationMethods ?? []);
  const [email, setEmail] = useState(existing?.email ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [confetti, setConfetti] = useState(false);

  const toast = useToast();
  const selectedDate = day != null ? new Date(new Date().getFullYear(), new Date().getMonth(), day) : null;

  const selectDay = (date: Date) => {
    if (date.getDate() > 28) {
      toast(r.dayInvalidToast, 'info');
      return;
    }
    setDay(date.getDate());
  };

  const toggleMethod = (m: Method) => {
    const willEnable = !methods.includes(m);
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
    if (m === 'push' && willEnable && typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission()
        .then((perm) => {
          if (perm === 'denied') toast(r.pushBlockedToast, 'error');
        })
        .catch(() => {});
    }
  };

  const emailOk = !methods.includes('email') || isEmail(email);
  const phoneOk = !methods.includes('whatsapp') || isPhone(phone);
  const canActivate = day != null && time != null && methods.length > 0 && emailOk && phoneOk;

  const activate = () => {
    if (!canActivate || day == null || time == null) return;
    const settings: ReminderSettings = {
      reminderDay: day,
      reminderTime: time,
      notificationMethods: methods,
      email,
      phone,
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable */
    }
    setConfetti(true);
    setMode('confirmed');
    window.setTimeout(() => setConfetti(false), 1600);
  };

  const timeLabel = time ? `${r.times[time].label} — ${TIME_CLOCK[time]}` : '';

  // --- Confirmed view -------------------------------------------------------
  if (mode === 'confirmed' && day != null && time != null) {
    return (
      <PageTransition>
        <section className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/70 bg-card/85 p-6 text-center shadow-petal-xl">
          {confetti && <Confetti />}
          <DrawnCheck />
          <h1 className="mt-4 text-3xl font-black text-ink">{r.confirmTitle}</h1>
          <p className="mt-3 text-lg font-bold leading-8 text-primary-800">
            {interpolate(r.confirmSummary, { day, time: timeLabel })}
          </p>

          <div className="mt-5 rounded-3xl bg-primary-50 p-4">
            <p className="text-sm font-black text-muted">{r.nextReminderLabel}</p>
            <p className="mt-1 text-xl font-black text-primary-800">{formatDate(nextReminderDate(day), lang)}</p>
          </div>

          <div className="mt-4 text-start">
            <p className="text-sm font-black text-muted">{r.viaLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {methods.map((m) => (
                <span key={m} className="rounded-full bg-primary-100 px-3 py-1.5 text-sm font-bold text-primary-700">
                  {METHOD_META.find((x) => x.key === m)?.emoji} {r.methods[m].label}
                  {m === 'email' && email ? ` · ${email}` : ''}
                  {m === 'whatsapp' && phone ? ` · +212 ${phone}` : ''}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <GlassCalendar
              selectedDate={selectedDate}
              onDateSelect={() => {}}
              isRTL={isRTL}
              months={r.calendar.months}
              weekdays={r.calendar.weekdays}
              readOnly
            />
          </div>

          {USE_MOCK && <p className="mt-3 text-sm font-semibold leading-6 text-muted">{r.demoNote}</p>}

          <Button className="mt-6" variant="secondary" fullWidth leftIcon={<Pencil size={18} />} onClick={() => setMode('setup')}>
            {r.editBtn}
          </Button>
        </section>
      </PageTransition>
    );
  }

  // --- Setup wizard ---------------------------------------------------------
  return (
    <PageTransition>
      <div className="mx-auto max-w-xl space-y-6">
        {/* Step 1 — Day */}
        <section>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">{r.stepDayTitle}</h1>
          <p className="mt-2 font-medium leading-7 text-muted">{r.stepDaySubtitle}</p>
          <div className="mt-4">
            <GlassCalendar
              selectedDate={selectedDate}
              onDateSelect={selectDay}
              isRTL={isRTL}
              months={r.calendar.months}
              weekdays={r.calendar.weekdays}
            />
          </div>
        </section>

        {/* Step 2 — Time */}
        <AnimatePresence>
          {day != null && (
            <StepCard>
              <h2 className="text-xl font-black text-ink">{r.stepTimeTitle}</h2>
              <div className="mt-4 space-y-3">
                {TIME_META.map(({ key, emoji, ring }) => {
                  const selected = time === key;
                  return (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => setTime(key)}
                      animate={{ scale: selected ? 1.02 : 1 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                      aria-pressed={selected}
                      className={cn(
                        'relative w-full rounded-3xl border-2 bg-card/85 p-4 text-start shadow-petal transition-colors',
                        selected ? 'border-primary-500' : ring,
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl" aria-hidden>{emoji}</span>
                        <div className="min-w-0">
                          <p className="font-black text-ink">
                            {r.times[key].label} — {TIME_CLOCK[key]}
                          </p>
                          <p className="text-sm font-medium text-muted">{r.times[key].hint}</p>
                        </div>
                        {selected && <CheckCircle2 className="ms-auto shrink-0 text-primary-500" size={24} />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </StepCard>
          )}
        </AnimatePresence>

        {/* Step 3 — Method */}
        <AnimatePresence>
          {day != null && time != null && (
            <StepCard>
              <h2 className="text-xl font-black text-ink">{r.stepMethodTitle}</h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {METHOD_META.map(({ key, emoji }) => {
                  const selected = methods.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleMethod(key)}
                      aria-pressed={selected}
                      className={cn(
                        'flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center text-sm font-black transition',
                        selected ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-line bg-white/55 text-muted',
                      )}
                    >
                      <span className="text-2xl" aria-hidden>{emoji}</span>
                      {r.methods[key].label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {methods.includes('email') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-4">
                      <label htmlFor="reminder-email" className="text-sm font-black text-muted">{r.emailLabel}</label>
                      <input
                        id="reminder-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={r.emailPlaceholder}
                        className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-white/70 px-4 font-bold text-ink outline-none focus:border-primary-300"
                      />
                      {!emailOk && email.length > 0 && <p className="mt-1.5 text-sm font-bold text-risk-high">{r.emailInvalid}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {methods.includes('whatsapp') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-4">
                      <label htmlFor="reminder-phone" className="text-sm font-black text-muted">{r.phoneLabel}</label>
                      <div className="mt-2 flex min-h-12 items-center overflow-hidden rounded-2xl border border-line bg-white/70 focus-within:border-primary-300" dir="ltr">
                        <span className="grid h-12 place-items-center bg-primary-50 px-3 font-black text-primary-700">+212</span>
                        <input
                          id="reminder-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="6 00 00 00 00"
                          className="min-w-0 flex-1 bg-transparent px-3 font-bold text-ink outline-none"
                        />
                      </div>
                      {!phoneOk && phone.length > 0 && <p className="mt-1.5 text-sm font-bold text-risk-high">{r.phoneInvalid}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </StepCard>
          )}
        </AnimatePresence>

        {/* Activate */}
        <AnimatePresence>
          {day != null && time != null && methods.length > 0 && (
            <StepCard>
              <Button fullWidth size="lg" leftIcon={<Bell size={18} />} disabled={!canActivate} onClick={activate}>
                {r.activateBtn}
              </Button>
            </StepCard>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
