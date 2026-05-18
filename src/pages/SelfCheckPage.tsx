import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Pause, Play, RotateCcw, TimerReset } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
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
  const guide = stepsFor(lang);
  const check = useSelfCheck(guide);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - check.stepProgress);

  return (
    <PageTransition>
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
        <section className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-card/85 p-6 text-center shadow-petal-xl">
          <CheckCircle2 className="mx-auto text-accent-teal" size={56} />
          <h1 className="mt-4 text-4xl font-black text-ink">{t.selfCheck.completeTitle}</h1>
          <p className="mt-3 font-medium leading-7 text-muted">{t.selfCheck.completeText}</p>
          <p className="mt-4 rounded-2xl bg-primary-50 p-4 text-sm font-bold text-primary-800">{t.selfCheck.importantNote}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link to="/reminder"><Button fullWidth>{t.selfCheck.completeCta}</Button></Link>
            <Button fullWidth variant="secondary" onClick={check.restart} leftIcon={<RotateCcw size={18} />}>{t.selfCheck.restart}</Button>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
