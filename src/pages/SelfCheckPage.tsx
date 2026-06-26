import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, CheckCircle2, Clock, MapPin, Pause, Play, RotateCcw, TimerReset } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Confetti } from '@/components/ui/Confetti';
import { useLanguage, interpolate } from '@/hooks/useLanguage';
import { useSelfCheck } from '@/hooks/useSelfCheck';
import { useSpeech } from '@/hooks/useSpeech';
import { formatDuration } from '@/utils/formatters';
import type { SelfCheckStep } from '@/types/api';

// Shared, language-independent metadata for the 5 self-check steps.
const STEP_META = [
  { step_number: 1, icon: 'mirror', duration_seconds: 60 },
  { step_number: 2, icon: 'arms', duration_seconds: 45 },
  { step_number: 3, icon: 'touch', duration_seconds: 90 },
  { step_number: 4, icon: 'rest', duration_seconds: 90 },
  { step_number: 5, icon: 'alert', duration_seconds: 30 },
];

type StepText = { title: string; instruction: string; tags: string[] };

// Localized title / instruction / symptom tags for each step, in step order.
// Every supported language is covered; unknown languages fall back to English.
const STEP_TEXT: Record<string, StepText[]> = {
  ar: [
    { title: 'راقبي فالمرآة', instruction: 'وقفي قدام المرآة وشوفي واش كاين تغيير فالشكل، الحجم أو لون الجلد.', tags: ['تغيير فالحجم', 'تورم', 'تغيير فالجلد'] },
    { title: 'رفعي يديك', instruction: 'رفعي يديك فوق راسك وراقبي نفس العلامات من زاوية جديدة.', tags: ['انكماش', 'اختلاف بين الجهتين'] },
    { title: 'فحصي وانتي واقفة', instruction: 'استعملي أصابعك بحركات دائرية وضغط خفيف ثم متوسط.', tags: ['كتلة', 'ألم فبلاصة وحدة'] },
    { title: 'فحصي وانتي مستلقية', instruction: 'حطي وسادة تحت الكتف وكرري الحركات على كل ثدي.', tags: ['فرق بين الثديين', 'صلابة'] },
    { title: 'راقبي الحلمة', instruction: 'ضغطي بلطف وشوفي واش كاين إفراز غير عادي.', tags: ['إفرازات', 'دم', 'تغيير فالشكل'] },
  ],
  fr: [
    { title: 'Observer au miroir', instruction: 'Regardez la forme, la taille et la peau.', tags: ['Forme', 'Taille', 'Peau'] },
    { title: 'Lever les bras', instruction: 'Levez les bras et observez encore.', tags: ['Gonflement', 'Changements du mamelon'] },
    { title: 'Examiner debout', instruction: 'Faites des cercles avec les doigts, doucement.', tags: ['Masse', 'Dureté', 'Douleur'] },
    { title: 'Examiner allongée', instruction: 'Allongez-vous et répétez sur chaque sein.', tags: ['Différences', 'Texture'] },
    { title: 'Vérifier le mamelon', instruction: 'Pressez doucement et observez.', tags: ['Écoulement', 'Sang', 'Forme'] },
  ],
  en: [
    { title: 'Look in the mirror', instruction: 'Look for changes in shape, size or skin.', tags: ['Shape', 'Size', 'Skin'] },
    { title: 'Raise your arms', instruction: 'Raise your arms and look again from a new angle.', tags: ['Swelling', 'Nipple changes'] },
    { title: 'Examine standing', instruction: 'Use circular finger motions with gentle pressure.', tags: ['Lump', 'Hardness', 'Pain'] },
    { title: 'Examine lying down', instruction: 'Lie down and repeat the same pattern on each breast.', tags: ['Differences', 'Texture'] },
    { title: 'Check the nipple', instruction: 'Gently squeeze and check for unusual discharge.', tags: ['Discharge', 'Blood', 'Shape'] },
  ],
  es: [
    { title: 'Observar en el espejo', instruction: 'Frente al espejo, observa la forma, el tamaño y la piel.', tags: ['Forma', 'Tamaño', 'Piel'] },
    { title: 'Levantar los brazos', instruction: 'Levanta los brazos y observa de nuevo desde otro ángulo.', tags: ['Hinchazón', 'Cambios en el pezón'] },
    { title: 'Examen de pie', instruction: 'Haz movimientos circulares con los dedos, con presión suave.', tags: ['Bulto', 'Dureza', 'Dolor'] },
    { title: 'Examen acostada', instruction: 'Acuéstate y repite el mismo patrón en cada seno.', tags: ['Diferencias', 'Textura'] },
    { title: 'Revisar el pezón', instruction: 'Presiona suavemente y revisa si hay secreción inusual.', tags: ['Secreción', 'Sangre', 'Forma'] },
  ],
  de: [
    { title: 'Im Spiegel betrachten', instruction: 'Achte im Spiegel auf Form, Größe und Haut.', tags: ['Form', 'Größe', 'Haut'] },
    { title: 'Arme heben', instruction: 'Hebe die Arme und betrachte alles aus einem neuen Winkel.', tags: ['Schwellung', 'Veränderung der Brustwarze'] },
    { title: 'Im Stehen untersuchen', instruction: 'Taste mit kreisenden Fingerbewegungen und sanftem Druck.', tags: ['Knoten', 'Verhärtung', 'Schmerz'] },
    { title: 'Im Liegen untersuchen', instruction: 'Lege dich hin und wiederhole das Muster an jeder Brust.', tags: ['Unterschiede', 'Struktur'] },
    { title: 'Brustwarze prüfen', instruction: 'Drücke sanft und prüfe auf ungewöhnlichen Ausfluss.', tags: ['Ausfluss', 'Blut', 'Form'] },
  ],
  ru: [
    { title: 'Осмотр в зеркале', instruction: 'Перед зеркалом обратите внимание на форму, размер и кожу.', tags: ['Форма', 'Размер', 'Кожа'] },
    { title: 'Поднимите руки', instruction: 'Поднимите руки и осмотрите снова под новым углом.', tags: ['Отёк', 'Изменения соска'] },
    { title: 'Осмотр стоя', instruction: 'Круговыми движениями пальцев с лёгким нажимом ощупайте грудь.', tags: ['Уплотнение', 'Твёрдость', 'Боль'] },
    { title: 'Осмотр лёжа', instruction: 'Лягте и повторите те же движения на каждой груди.', tags: ['Различия', 'Текстура'] },
    { title: 'Проверьте сосок', instruction: 'Слегка сожмите и проверьте, нет ли необычных выделений.', tags: ['Выделения', 'Кровь', 'Форма'] },
  ],
  pt: [
    { title: 'Observar no espelho', instruction: 'Em frente ao espelho, observe a forma, o tamanho e a pele.', tags: ['Forma', 'Tamanho', 'Pele'] },
    { title: 'Levantar os braços', instruction: 'Levante os braços e observe novamente de um novo ângulo.', tags: ['Inchaço', 'Alterações no mamilo'] },
    { title: 'Exame em pé', instruction: 'Faça movimentos circulares com os dedos, com pressão suave.', tags: ['Nódulo', 'Rigidez', 'Dor'] },
    { title: 'Exame deitada', instruction: 'Deite-se e repita o mesmo padrão em cada mama.', tags: ['Diferenças', 'Textura'] },
    { title: 'Verificar o mamilo', instruction: 'Pressione suavemente e verifique se há secreção incomum.', tags: ['Secreção', 'Sangue', 'Forma'] },
  ],
};

function stepsFor(lang: string): SelfCheckStep[] {
  const text = STEP_TEXT[lang] ?? STEP_TEXT.en;
  return STEP_META.map((meta, i) => ({
    step_number: meta.step_number,
    icon: meta.icon,
    duration_seconds: meta.duration_seconds,
    title: text[i].title,
    instruction: text[i].instruction,
    what_to_look_for: text[i].tags,
    image_url: '',
  }));
}

export function SelfCheckPage() {
  const { t, lang } = useLanguage();
  // Memoize so the steps array keeps a stable identity across renders —
  // otherwise the timer's reset effect refires every render and freezes the countdown.
  const guide = useMemo(() => stepsFor(lang), [lang]);
  const check = useSelfCheck(guide);
  const { speak, activeId, stop, voicesLoaded, hasVoice } = useSpeech();
  const navigate = useNavigate();
  const [showReminderCta, setShowReminderCta] = useState(false);
  const ctaTimer = useRef<number | null>(null);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - check.stepProgress);

  // Narration (text-to-speech) for the active step. Read check.current into a
  // string here so the click handler doesn't depend on TS narrowing the
  // possibly-undefined current step inside a closure.
  const speechId = `step-${check.index}`;
  const isNarrating = activeId === speechId;
  const narrationText = check.current ? check.current.instruction || check.current.title : '';
  // Only offer narration once voices are loaded and one exists for this language.
  // voicesLoaded re-renders the page when voices arrive so hasVoice re-evaluates.
  const canNarrate = voicesLoaded && hasVoice(lang);
  const listenLabel =
    lang === 'ar' ? 'سمعي' : lang === 'fr' ? 'Écouter' : lang === 'es' ? 'Escuchar' :
    lang === 'de' ? 'Anhören' : lang === 'ru' ? 'Слушать' : lang === 'pt' ? 'Ouvir' : 'Listen';
  const pauseLabel =
    lang === 'ar' ? 'وقفي' : lang === 'fr' ? 'Pause' : lang === 'es' ? 'Pausa' :
    lang === 'de' ? 'Pause' : lang === 'ru' ? 'Пауза' : lang === 'pt' ? 'Pausa' : 'Pause';

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

  // Stop any narration when the active step changes.
  useEffect(() => {
    stop();
  }, [check.index, stop]);

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
            {canNarrate && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(narrationText, lang, speechId);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: isNarrating ? '#D63384' : 'white',
                    color: isNarrating ? 'white' : '#D63384',
                    border: '2px solid #D63384',
                    borderRadius: 999,
                    padding: '6px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{isNarrating ? '⏸️' : '🔊'}</span>
                  {isNarrating ? pauseLabel : listenLabel}
                </button>
              </div>
            )}
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
