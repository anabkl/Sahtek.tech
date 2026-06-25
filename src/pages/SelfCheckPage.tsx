import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, CheckCircle2, Clock, MapPin, Pause, Play, RotateCcw, TimerReset } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Confetti } from '@/components/ui/Confetti';
import { useLanguage, interpolate } from '@/hooks/useLanguage';
import { useSelfCheck } from '@/hooks/useSelfCheck';
import { formatDuration } from '@/utils/formatters';
import type { SelfCheckStep } from '@/types/api';

function stepsFor(lang: string): SelfCheckStep[] {
  if (lang === 'ar') {
    return [
      { step_number: 1, title: 'راقبي فالمرآة', icon: 'mirror', duration_seconds: 60, instruction: 'وقفي قدام المرآة وشوفي واش كاين تغيير فالشكل، الحجم أو لون الجلد.', what_to_look_for: ['تغيير فالحجم', 'تورم', 'تغيير فالجلد'], image_url: '' },
      { step_number: 2, title: 'رفعي يديك', icon: 'arms', duration_seconds: 45, instruction: 'رفعي يديك فوق راسك وراقبي نفس العلامات من زاوية جديدة.', what_to_look_for: ['انكماش', 'اختلاف بين الجهتين'], image_url: '' },
      { step_number: 3, title: 'فحصي وانتي واقفة', icon: 'touch', duration_seconds: 90, instruction: 'استعملي أصابعك بحركات دائرية وضغط خفيف ثم متوسط.', what_to_look_for: ['كتلة', 'ألم فبلاصة وحدة'], image_url: '' },
      { step_number: 4, title: 'فحصي وانتي مستلقية', icon: 'rest', duration_seconds: 90, instruction: 'حطي وسادة تحت الكتف وكرري الحركات على كل ثدي.', what_to_look_for: ['فرق بين الثديين', 'صلابة'], image_url: '' },
      { step_number: 5, title: 'راقبي الحلمة', icon: 'alert', duration_seconds: 30, instruction: 'ضغطي بلطف وشوفي واش كاين إفراز غير عادي.', what_to_look_for: ['إفرازات', 'دم', 'تغيير فالشكل'], image_url: '' },
    ];
  }
  return [
    { step_number: 1, title: lang === 'fr' ? 'Observer au miroir' : 'Look in the mirror', icon: 'mirror', duration_seconds: 60, instruction: lang === 'fr' ? 'Regardez la forme, la taille et la peau.' : 'Look for changes in shape, size or skin.', what_to_look_for: ['Shape', 'Size', 'Skin'], image_url: '' },
    { step_number: 2, title: lang === 'fr' ? 'Lever les bras' : 'Raise your arms', icon: 'arms', duration_seconds: 45, instruction: lang === 'fr' ? 'Levez les bras et observez encore.' : 'Raise your arms and look again from a new angle.', what_to_look_for: ['Swelling', 'Nipple changes'], image_url: '' },
    { step_number: 3, title: lang === 'fr' ? 'Examiner debout' : 'Examine standing', icon: 'touch', duration_seconds: 90, instruction: lang === 'fr' ? 'Faites des cercles avec les doigts, doucement.' : 'Use circular finger motions with gentle pressure.', what_to_look_for: ['Lump', 'Hardness', 'Pain'], image_url: '' },
    { step_number: 4, title: lang === 'fr' ? 'Examiner allongee' : 'Examine lying down', icon: 'rest', duration_seconds: 90, instruction: lang === 'fr' ? 'Allongez-vous et repetez sur chaque sein.' : 'Lie down and repeat the same pattern on each breast.', what_to_look_for: ['Differences', 'Texture'], image_url: '' },
    { step_number: 5, title: lang === 'fr' ? 'Verifier le mamelon' : 'Check the nipple', icon: 'alert', duration_seconds: 30, instruction: lang === 'fr' ? 'Pressez doucement et observez.' : 'Gently squeeze and check for unusual discharge.', what_to_look_for: ['Discharge', 'Blood', 'Shape'], image_url: '' },
  ];
}

export function SelfCheckPage() {
  const { t, lang } = useLanguage();
  // Memoize so the steps array keeps a stable identity across renders —
  // otherwise the timer's reset effect refires every render and freezes the countdown.
  const guide = useMemo(() => stepsFor(lang), [lang]);
  const check = useSelfCheck(guide);
  const navigate = useNavigate();
  const [showReminderCta, setShowReminderCta] = useState(false);
  const ctaTimer = useRef<number | null>(null);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - check.stepProgress);

  // Reveal the reminder nudge ~2s after the user finishes the guide.
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

  return (
    <PageTransition>
      {/* Continue prompt — a recent unfinished session was found */}
      <AnimatePresence>
        {check.savedSnapshot && check.stage === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-sm rounded-3xl border border-white/70 bg-gradient-to-b from-primary-100 to-white p-6 text-center shadow-petal-xl"
            >
              <div className="text-5xl" aria-hidden>🩺</div>
              <h2 className="mt-3 text-2xl font-black text-ink">{t.selfCheck.resumeTitle}</h2>
              <p className="mt-2 font-bold text-primary-800">
                {interpolate(t.selfCheck.resumeSubtitle, { step: check.savedSnapshot.currentStep, total: check.total })}
              </p>
              <div className="mt-6 grid gap-2">
                <Button fullWidth onClick={check.resumeSaved}>{t.selfCheck.resumeYes}</Button>
                <Button fullWidth variant="secondary" onClick={check.discardSaved}>{t.selfCheck.resumeNo}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {check.stage === 'intro' && (
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-black text-ink">{t.selfCheck.title}</h1>
            <p className="mt-3 text-lg font-medium leading-8 text-muted">{t.selfCheck.subtitle}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-card/80 p-5 shadow-petal"><Clock className="text-primary-500" /><p className="mt-2 text-sm font-bold text-muted">{t.selfCheck.bestTime}</p><p className="font-black text-ink">3-5 days</p></div>
              <div className="rounded-3xl bg-card/80 p-5 shadow-petal"><TimerReset className="text-primary-500" /><p className="mt-2 text-sm font-bold text-muted">{t.selfCheck.duration}</p><p className="font-black text-ink">5 min</p></div>
            </div>
            <p className="mt-5 rounded-3xl border border-primary-100 bg-primary-50 p-5 font-medium leading-7 text-primary-900">{t.selfCheck.intro}</p>
            <Button className="mt-6" size="lg" fullWidth onClick={check.start}>{t.selfCheck.startBtn}</Button>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-card/80 p-5 shadow-petal-xl">
            <div className="grid gap-3">
              {guide.map((step) => (
                <div key={step.step_number} className="flex items-center gap-4 rounded-2xl bg-white/55 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-rose-gradient text-lg font-black text-white">{step.step_number}</span>
                  <div><h3 className="font-black text-ink">{step.title}</h3><p className="text-sm font-medium text-muted">{formatDuration(step.duration_seconds)}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {check.stage === 'active' && check.current && (
        <section className="mx-auto max-w-2xl">
          <div className="rounded-[2rem] border border-white/70 bg-card/85 p-5 text-center shadow-petal-xl">
            <p className="font-black text-primary-700">{t.common.step} {check.index + 1} {t.common.of} {check.total}</p>
            <h1 className="mt-2 text-3xl font-black text-ink">{check.current.title}</h1>
            <div className="relative mx-auto my-8 h-44 w-44">
              <svg className="-rotate-90" width="176" height="176">
                <circle cx="88" cy="88" r={radius} fill="none" stroke="rgba(214,51,132,0.12)" strokeWidth="16" />
                <motion.circle cx="88" cy="88" r={radius} fill="none" stroke="#D63384" strokeWidth="16" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: offset }} />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-4xl font-black text-ink">{formatDuration(check.remaining)}</div>
            </div>
            <p className="text-lg font-medium leading-8 text-muted">{check.current.instruction}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {check.current.what_to_look_for.map((item) => <span key={item} className="rounded-full bg-primary-50 px-3 py-2 text-sm font-bold text-primary-700">{item}</span>)}
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={check.togglePause} leftIcon={check.paused ? <Play size={18} /> : <Pause size={18} />}>{check.paused ? t.selfCheck.resume : t.selfCheck.pause}</Button>
              <Button variant="outline" onClick={check.skipTimer}>{t.selfCheck.timerSkip}</Button>
              <Button variant="secondary" disabled={check.isFirst} onClick={check.prev}>{t.selfCheck.prevStep}</Button>
              <Button onClick={check.next}>{check.isLast ? t.selfCheck.finishBtn : t.selfCheck.nextStep}</Button>
            </div>
          </div>
        </section>
      )}

      {check.stage === 'done' && (
        <section className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/70 bg-card/85 p-6 text-center shadow-petal-xl">
          <Confetti />
          <CheckCircle2 className="mx-auto text-accent-teal" size={56} />
          <h1 className="mt-4 text-3xl font-black text-ink sm:text-4xl">{t.selfCheck.celebrateTitle}</h1>
          <p className="mt-3 font-medium leading-7 text-muted">{t.selfCheck.completeText}</p>
          <p className="mt-4 rounded-2xl bg-primary-50 p-4 text-sm font-bold text-primary-800">{t.selfCheck.importantNote}</p>

          <div className="mt-6 rounded-[1.75rem] border border-accent-blue/20 bg-blue-50/60 p-5 text-start dark:bg-accent-blue/10">
            <h2 className="text-lg font-black text-ink">{t.selfCheck.doctorsCtaTitle}</h2>
            <Button
              className="mt-3"
              fullWidth
              variant="secondary"
              onClick={() => navigate('/doctors')}
              leftIcon={<MapPin size={18} className="text-accent-blue" />}
            >
              {t.selfCheck.doctorsCtaBtn}
            </Button>
          </div>

          <AnimatePresence>
            {showReminderCta && (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 28 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="mt-6 rounded-[1.75rem] bg-rose-gradient p-5 text-start text-white shadow-petal-xl"
              >
                <div className="flex items-center gap-2">
                  <BellRing size={22} />
                  <h2 className="text-xl font-black">{t.selfCheck.reminderCtaTitle}</h2>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button variant="secondary" fullWidth onClick={() => navigate('/reminder')}>
                    {t.selfCheck.reminderCtaYes}
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    className="text-white hover:bg-white/15"
                    onClick={() => setShowReminderCta(false)}
                  >
                    {t.selfCheck.reminderCtaNo}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button className="mt-6" fullWidth variant="secondary" onClick={check.restart} leftIcon={<RotateCcw size={18} />}>
            {t.selfCheck.restart}
          </Button>
        </section>
      )}
    </PageTransition>
  );
}
