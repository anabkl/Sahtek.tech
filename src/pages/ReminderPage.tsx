import { useEffect, useMemo, useState, type ReactNode } from 'react';
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
import { REMINDER_STORAGE_KEY, scheduleNotificationCheck, showNotification } from '@/utils/notificationScheduler';
import { sendWhatsAppConfirmation, checkWhatsAppAvailable } from '@/services/whatsappService';
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
];

const STORAGE_KEY = REMINDER_STORAGE_KEY;

// Notification UI strings, kept inline (not in the i18n files) for all 7 languages.
const NOTIF_BADGE: Record<'granted' | 'denied' | 'unsupported', Record<string, string>> = {
  granted: {
    ar: '🔔 الإشعارات مفعّلة — غادي نذكّروك',
    fr: '🔔 Notifications activées — nous vous rappellerons',
    en: '🔔 Notifications on — we will remind you',
    es: '🔔 Notificaciones activadas — te recordaremos',
    de: '🔔 Benachrichtigungen aktiv — wir erinnern dich',
    ru: '🔔 Уведомления включены — мы напомним вам',
    pt: '🔔 Notificações ativadas — vamos lembrá-la',
  },
  denied: {
    ar: '⚠️ خاصك تفعّلي الإشعارات من إعدادات المتصفح',
    fr: '⚠️ Activez les notifications dans les réglages du navigateur',
    en: '⚠️ Enable notifications in your browser settings',
    es: '⚠️ Activa las notificaciones en los ajustes del navegador',
    de: '⚠️ Aktiviere Benachrichtigungen in den Browser-Einstellungen',
    ru: '⚠️ Включите уведомления в настройках браузера',
    pt: '⚠️ Ative as notificações nas configurações do navegador',
  },
  unsupported: {
    ar: '📱 المتصفح ديالك ما كيدعمش الإشعارات',
    fr: '📱 Votre navigateur ne supporte pas les notifications',
    en: '📱 Your browser does not support notifications',
    es: '📱 Tu navegador no admite notificaciones',
    de: '📱 Dein Browser unterstützt keine Benachrichtigungen',
    ru: '📱 Ваш браузер не поддерживает уведомления',
    pt: '📱 Seu navegador não suporta notificações',
  },
};

const NOTIF_BADGE_STYLE: Record<'granted' | 'denied' | 'unsupported', { bg: string; fg: string; border: string }> = {
  granted: { bg: '#ECFDF5', fg: '#16A34A', border: '#BBF7D0' },
  denied: { bg: '#FFF7ED', fg: '#EA580C', border: '#FED7AA' },
  unsupported: { bg: '#F3F4F6', fg: '#6B7280', border: '#E5E7EB' },
};

const TEST_BTN_LABEL: Record<string, string> = {
  ar: '🔔 جربي الإشعار',
  fr: '🔔 Tester la notification',
  en: '🔔 Test notification',
  es: '🔔 Probar notificación',
  de: '🔔 Benachrichtigung testen',
  ru: '🔔 Тест уведомления',
  pt: '🔔 Testar notificação',
};

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
  // Retained from saved settings for backward-compat; WhatsApp now goes through
  // the OpenWA section below, not this reminder method.
  const [phone] = useState(existing?.phone ?? '');
  const [confetti, setConfetti] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported',
  );

  const [whatsappAvailable, setWhatsappAvailable] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappSending, setWhatsappSending] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [whatsappError, setWhatsappError] = useState('');

  useEffect(() => {
    checkWhatsAppAvailable().then(setWhatsappAvailable);
  }, []);

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
  const canActivate = day != null && time != null && methods.length > 0 && emailOk;

  const activate = async () => {
    if (!canActivate || day == null || time == null) return;

    // Request notification permission up front when push is among the methods.
    if (methods.includes('push')) {
      if (!('Notification' in window)) {
        setPermissionStatus('unsupported');
      } else {
        const perm =
          Notification.permission === 'default'
            ? await Notification.requestPermission()
            : Notification.permission;
        setPermissionStatus(perm);
        if (perm !== 'granted') toast(r.pushBlockedToast, 'error');
      }
    }

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
    // Start the in-app reminder check (fires while a tab is open).
    scheduleNotificationCheck({ reminderDay: day, reminderTime: time, isActive: true });
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
                </span>
              ))}
            </div>
          </div>

          {methods.includes('push') && permissionStatus !== 'default' && (
            <div className="mt-4">
              <span
                style={{
                  display: 'inline-block',
                  borderRadius: 999,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  background: NOTIF_BADGE_STYLE[permissionStatus].bg,
                  color: NOTIF_BADGE_STYLE[permissionStatus].fg,
                  border: `1px solid ${NOTIF_BADGE_STYLE[permissionStatus].border}`,
                }}
              >
                {NOTIF_BADGE[permissionStatus][lang] || NOTIF_BADGE[permissionStatus].en}
              </span>
            </div>
          )}

          {methods.includes('push') && permissionStatus === 'granted' && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => showNotification(lang)}
                style={{
                  background: 'none',
                  border: '1px solid #D63384',
                  color: '#D63384',
                  borderRadius: 999,
                  padding: '6px 16px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {TEST_BTN_LABEL[lang] || TEST_BTN_LABEL.en}
              </button>
            </div>
          )}

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

          {/* ── WhatsApp Reminder ── */}
          <div style={{
            marginTop: 20,
            padding: 24,
            background: 'white',
            borderRadius: 20,
            border: whatsappAvailable ? '2px solid #25D366' : '2px solid #E0E0E0',
            boxShadow: '0 4px 20px rgba(37,211,102,0.1)',
            opacity: whatsappAvailable ? 1 : 0.6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>💬</span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2D1F2D', margin: 0 }}>
                  {lang === 'ar' ? 'تذكير بالواتساب' :
                   lang === 'fr' ? 'Rappel WhatsApp' :
                   lang === 'es' ? 'Recordatorio WhatsApp' :
                   lang === 'de' ? 'WhatsApp-Erinnerung' :
                   lang === 'ru' ? 'Напоминание WhatsApp' :
                   lang === 'pt' ? 'Lembrete WhatsApp' :
                   'WhatsApp Reminder'}
                </h3>
                <p style={{ fontSize: 12, color: whatsappAvailable ? '#25D366' : '#999', margin: 0, marginTop: 2 }}>
                  {whatsappAvailable
                    ? (lang === 'ar' ? '✅ الخدمة متوفرة' :
                       lang === 'fr' ? '✅ Service disponible' :
                       lang === 'es' ? '✅ Servicio disponible' :
                       lang === 'de' ? '✅ Dienst verfügbar' :
                       lang === 'ru' ? '✅ Сервис доступен' :
                       lang === 'pt' ? '✅ Serviço disponível' :
                       '✅ Service available')
                    : (lang === 'ar' ? '⚪ غير متوفر حالياً' :
                       lang === 'fr' ? '⚪ Non disponible' :
                       lang === 'es' ? '⚪ No disponible' :
                       lang === 'de' ? '⚪ Nicht verfügbar' :
                       lang === 'ru' ? '⚪ Недоступно' :
                       lang === 'pt' ? '⚪ Indisponível' :
                       '⚪ Not available')}
                </p>
              </div>
            </div>

            {whatsappAvailable && !whatsappSent && (
              <>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
                  {lang === 'ar' ? 'دخلي رقم الواتساب ديالك باش نوجدو ليك تأكيد و تذكير شهري:' :
                   lang === 'fr' ? 'Entrez votre numéro WhatsApp pour recevoir une confirmation et un rappel mensuel :' :
                   lang === 'es' ? 'Ingrese su número de WhatsApp para recibir confirmación y recordatorio mensual:' :
                   lang === 'de' ? 'Geben Sie Ihre WhatsApp-Nummer ein für Bestätigung und monatliche Erinnerung:' :
                   lang === 'ru' ? 'Введите номер WhatsApp для подтверждения и ежемесячного напоминания:' :
                   lang === 'pt' ? 'Digite seu número do WhatsApp para confirmação e lembrete mensal:' :
                   'Enter your WhatsApp number for confirmation and monthly reminder:'}
                </p>
                <div style={{ display: 'flex', gap: 0, marginBottom: 12 }} dir="ltr">
                  <span style={{
                    background: '#F0F0F0', borderRadius: '12px 0 0 12px',
                    padding: '12px 14px', fontSize: 14, color: '#666',
                    border: '2px solid #E0E0E0', borderRight: 'none',
                    fontWeight: 600,
                  }}>+212</span>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="6XXXXXXXX"
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: '0 12px 12px 0',
                      border: '2px solid #E0E0E0', fontSize: 14, outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button
                  onClick={async () => {
                    if (!whatsappNumber || whatsappNumber.length < 9) return;
                    setWhatsappSending(true);
                    setWhatsappError('');

                    const result = await sendWhatsAppConfirmation(
                      whatsappNumber,
                      lang,
                      day,
                      time,
                    );
                    setWhatsappSending(false);
                    if (result.success) {
                      setWhatsappSent(true);
                    } else {
                      setWhatsappError(
                        lang === 'ar' ? 'ما قدرناش نوجدو الرسالة. عاودي مرة أخرى.' :
                        lang === 'fr' ? 'Impossible d\'envoyer. Réessayez.' :
                        lang === 'es' ? 'No se pudo enviar. Inténtelo de nuevo.' :
                        lang === 'de' ? 'Senden fehlgeschlagen. Versuchen Sie es erneut.' :
                        lang === 'ru' ? 'Не удалось отправить. Попробуйте снова.' :
                        lang === 'pt' ? 'Não foi possível enviar. Tente novamente.' :
                        'Could not send. Please try again.'
                      );
                    }
                  }}
                  disabled={whatsappSending || !whatsappNumber || whatsappNumber.length < 9}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 12,
                    background: whatsappSending ? '#ccc' : '#25D366',
                    color: 'white', border: 'none', fontSize: 15,
                    fontWeight: 700, cursor: whatsappSending ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {whatsappSending
                    ? (lang === 'ar' ? '⏳ كنوجد...' :
                       lang === 'fr' ? '⏳ Envoi...' :
                       lang === 'es' ? '⏳ Enviando...' :
                       lang === 'de' ? '⏳ Wird gesendet...' :
                       lang === 'ru' ? '⏳ Отправка...' :
                       lang === 'pt' ? '⏳ Enviando...' :
                       '⏳ Sending...')
                    : (lang === 'ar' ? '💬 فعّلي التذكير بالواتساب' :
                       lang === 'fr' ? '💬 Activer le rappel WhatsApp' :
                       lang === 'es' ? '💬 Activar recordatorio WhatsApp' :
                       lang === 'de' ? '💬 WhatsApp-Erinnerung aktivieren' :
                       lang === 'ru' ? '💬 Активировать напоминание WhatsApp' :
                       lang === 'pt' ? '💬 Ativar lembrete WhatsApp' :
                       '💬 Activate WhatsApp Reminder')}
                </button>

                {whatsappError && (
                  <p style={{ color: '#DC2626', fontSize: 12, marginTop: 8, textAlign: 'center' }}>{whatsappError}</p>
                )}
              </>
            )}

            {whatsappSent && (
              <div style={{ textAlign: 'center', padding: 16 }}>
                <span style={{ fontSize: 48 }}>✅</span>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#25D366', marginTop: 8 }}>
                  {lang === 'ar' ? 'التذكير مفعّل! شوفي الواتساب 💬' :
                   lang === 'fr' ? 'Rappel activé ! Vérifiez WhatsApp 💬' :
                   lang === 'es' ? '¡Recordatorio activado! Revise WhatsApp 💬' :
                   lang === 'de' ? 'Erinnerung aktiviert! Prüfen Sie WhatsApp 💬' :
                   lang === 'ru' ? 'Напоминание активировано! Проверьте WhatsApp 💬' :
                   lang === 'pt' ? 'Lembrete ativado! Verifique o WhatsApp 💬' :
                   'Reminder activated! Check WhatsApp 💬'}
                </p>
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  {lang === 'ar' ? 'توصلك رسالة تأكيد + تذكير كل شهر' :
                   lang === 'fr' ? 'Vous recevrez une confirmation + rappel mensuel' :
                   lang === 'es' ? 'Recibirá confirmación + recordatorio mensual' :
                   lang === 'de' ? 'Sie erhalten Bestätigung + monatliche Erinnerung' :
                   lang === 'ru' ? 'Вы получите подтверждение + ежемесячное напоминание' :
                   lang === 'pt' ? 'Você receberá confirmação + lembrete mensal' :
                   'You will receive confirmation + monthly reminder'}
                </p>
              </div>
            )}

            {!whatsappAvailable && (
              <p style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
                {lang === 'ar' ? 'خدمة الواتساب غير متوفرة حالياً. جربي الإشعارات 🔔' :
                 lang === 'fr' ? 'Service WhatsApp non disponible. Essayez les notifications 🔔' :
                 lang === 'es' ? 'Servicio WhatsApp no disponible. Pruebe notificaciones 🔔' :
                 lang === 'de' ? 'WhatsApp-Dienst nicht verfügbar. Versuchen Sie Benachrichtigungen 🔔' :
                 lang === 'ru' ? 'WhatsApp недоступен. Попробуйте уведомления 🔔' :
                 lang === 'pt' ? 'Serviço WhatsApp indisponível. Tente notificações 🔔' :
                 'WhatsApp service not available. Try notifications 🔔'}
              </p>
            )}
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
              <div className="mt-4 grid grid-cols-2 gap-2">
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
