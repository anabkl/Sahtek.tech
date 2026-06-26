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
// Push + email render in the top row; WhatsApp is a full-width card below them.
const METHOD_META: { key: Exclude<Method, 'whatsapp'>; emoji: string }[] = [
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

// WhatsApp card label — Arabic localizes it; everyone else keeps the brand name.
const WA_LABEL: Record<string, string> = {
  ar: 'بالواتساب', fr: 'WhatsApp', en: 'WhatsApp', es: 'WhatsApp', de: 'WhatsApp', ru: 'WhatsApp', pt: 'WhatsApp',
};
const WA_UNAVAILABLE: Record<string, string> = {
  ar: 'غير متوفر حالياً',
  fr: 'Non disponible actuellement',
  en: 'Not available currently',
  es: 'No disponible actualmente',
  de: 'Derzeit nicht verfügbar',
  ru: 'Сейчас недоступно',
  pt: 'Indisponível no momento',
};
const WA_SEND_FAIL: Record<string, string> = {
  ar: 'ما قدرناش نوجدو رسالة الواتساب.',
  fr: "Échec de l'envoi du message WhatsApp.",
  en: 'Could not send the WhatsApp message.',
  es: 'No se pudo enviar el mensaje de WhatsApp.',
  de: 'WhatsApp-Nachricht konnte nicht gesendet werden.',
  ru: 'Не удалось отправить сообщение WhatsApp.',
  pt: 'Não foi possível enviar a mensagem do WhatsApp.',
};
const EDIT_LABEL: Record<string, string> = {
  ar: 'تعديل', fr: 'Modifier', en: 'Edit', es: 'Editar', de: 'Bearbeiten', ru: 'Изменить', pt: 'Editar',
};
const SAVE_LABEL: Record<string, string> = {
  ar: 'حفظ', fr: 'Enregistrer', en: 'Save', es: 'Guardar', de: 'Speichern', ru: 'Сохранить', pt: 'Salvar',
};
const CANCEL_LABEL: Record<string, string> = {
  ar: 'إلغاء', fr: 'Annuler', en: 'Cancel', es: 'Cancelar', de: 'Abbrechen', ru: 'Отмена', pt: 'Cancelar',
};
const ENABLED_LABEL: Record<string, string> = {
  ar: '✅ مفعّل', fr: '✅ Activé', en: '✅ Enabled', es: '✅ Activado', de: '✅ Aktiviert', ru: '✅ Включено', pt: '✅ Ativado',
};
// Shown after a WhatsApp confirmation message is successfully delivered.
const WA_CONFIRMATION_SENT: Record<string, string> = {
  ar: '✅ وجدنا ليك رسالة تأكيد فالواتساب! شوفي الهاتف ديالك 📱',
  fr: '✅ Un message de confirmation a été envoyé sur votre WhatsApp ! Vérifiez votre téléphone 📱',
  en: '✅ A confirmation message has been sent to your WhatsApp! Check your phone 📱',
  es: '✅ Se ha enviado un mensaje de confirmación a su WhatsApp! Revise su teléfono 📱',
  de: '✅ Eine Bestätigungsnachricht wurde an Ihr WhatsApp gesendet! Prüfen Sie Ihr Telefon 📱',
  ru: '✅ Подтверждение отправлено в WhatsApp! Проверьте телефон 📱',
  pt: '✅ Uma mensagem de confirmação foi enviada ao seu WhatsApp! Verifique seu telefone 📱',
};

const tr = (rec: Record<string, string>, lang: string) => rec[lang] || rec.en;

interface ReminderSettings {
  reminderDay: number;
  reminderTime: ReminderTime;
  methods: Method[];
  email: string;
  whatsappNumber: string;
  lang: string;
  isActive: boolean;
}

/** Read saved settings, migrating the older `notificationMethods`/`phone` keys. */
function loadSettings(): ReminderSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<ReminderSettings> & {
      notificationMethods?: Method[];
      phone?: string;
    };
    if (s.reminderDay == null || s.reminderTime == null) return null;
    return {
      reminderDay: s.reminderDay,
      reminderTime: s.reminderTime as ReminderTime,
      methods: s.methods ?? s.notificationMethods ?? [],
      email: s.email ?? '',
      whatsappNumber: s.whatsappNumber ?? s.phone ?? '',
      lang: s.lang ?? 'ar',
      isActive: !!s.isActive,
    };
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
  const [methods, setMethods] = useState<Method[]>(existing?.methods ?? []);
  const [email, setEmail] = useState(existing?.email ?? '');
  const [whatsappNumber, setWhatsappNumber] = useState(existing?.whatsappNumber ?? '');
  const [confetti, setConfetti] = useState(false);
  const [activating, setActivating] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported',
  );

  // Whether the local OpenWA service is reachable (checked on mount).
  const [whatsappAvailable, setWhatsappAvailable] = useState(false);

  // Inline edit state for the confirmed view (email / whatsapp number).
  const [editingField, setEditingField] = useState<null | 'email' | 'whatsapp'>(null);
  const [draft, setDraft] = useState('');
  // True once a WhatsApp confirmation message has actually been delivered this session.
  const [whatsappSent, setWhatsappSent] = useState(false);

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
  const whatsappOk = !methods.includes('whatsapp') || whatsappNumber.length >= 9;
  const canActivate = day != null && time != null && methods.length > 0 && emailOk && whatsappOk;

  /** Persist the current settings (optionally with field overrides) under the shared key. */
  const writeSettings = (overrides?: Partial<ReminderSettings>) => {
    if (day == null || time == null) return;
    const settings: ReminderSettings = {
      reminderDay: day,
      reminderTime: time,
      methods,
      email,
      whatsappNumber,
      lang,
      isActive: true,
      ...overrides,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable */
    }
  };

  const activate = async () => {
    if (!canActivate || day == null || time == null) return;
    setActivating(true);

    // Browser push — request permission up front when selected.
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

    // WhatsApp — fire the confirmation message immediately via the local OpenWA API.
    if (methods.includes('whatsapp') && whatsappAvailable) {
      const result = await sendWhatsAppConfirmation(whatsappNumber, lang, day, time);
      if (result.success) setWhatsappSent(true);
      else toast(tr(WA_SEND_FAIL, lang), 'error');
    }

    writeSettings();
    scheduleNotificationCheck({ reminderDay: day, reminderTime: time, isActive: true });
    setActivating(false);
    setConfetti(true);
    setMode('confirmed');
    window.setTimeout(() => setConfetti(false), 1600);
  };

  const startEdit = (field: 'email' | 'whatsapp') => {
    setDraft(field === 'email' ? email : whatsappNumber);
    setEditingField(field);
  };
  const cancelEdit = () => setEditingField(null);
  const saveEdit = async () => {
    if (editingField === 'email') {
      setEmail(draft);
      writeSettings({ email: draft });
      setEditingField(null);
    } else if (editingField === 'whatsapp') {
      const digits = draft.replace(/[^0-9]/g, '');
      setWhatsappNumber(digits);
      writeSettings({ whatsappNumber: digits });
      setEditingField(null);
      // Re-send the confirmation to the new number so the user gets it on WhatsApp.
      if (whatsappAvailable && digits.length >= 9 && day != null && time != null) {
        const result = await sendWhatsAppConfirmation(digits, lang, day, time);
        if (result.success) setWhatsappSent(true);
        else toast(tr(WA_SEND_FAIL, lang), 'error');
      }
    }
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

          {/* Active notification methods, with inline edit for email + WhatsApp. */}
          <div className="mt-4 text-start">
            <p className="text-sm font-black text-muted">{r.viaLabel}</p>
            <div className="mt-2 space-y-2">
              {methods.includes('push') && (
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-primary-50 px-4 py-3">
                  <span className="font-bold text-primary-800">🔔 {r.methods.push.label}</span>
                  <span className="shrink-0 text-sm font-black text-green-600">{tr(ENABLED_LABEL, lang)}</span>
                </div>
              )}

              {methods.includes('email') && (
                <div className="rounded-2xl bg-primary-50 px-4 py-3">
                  {editingField === 'email' ? (
                    <div>
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={r.emailPlaceholder}
                        className="min-h-11 w-full rounded-xl border border-line bg-white px-3 font-bold text-ink outline-none focus:border-primary-300"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={!isEmail(draft)}
                          className="rounded-full bg-primary-500 px-4 py-1.5 text-sm font-black text-white disabled:opacity-50"
                        >
                          {tr(SAVE_LABEL, lang)}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-full border border-line px-4 py-1.5 text-sm font-black text-muted"
                        >
                          {tr(CANCEL_LABEL, lang)}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate font-bold text-primary-800">📧 {email || r.methods.email.label}</span>
                      <button
                        type="button"
                        onClick={() => startEdit('email')}
                        className="shrink-0 rounded-full border border-primary-200 px-3 py-1 text-xs font-black text-primary-700"
                      >
                        ✏️ {tr(EDIT_LABEL, lang)}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {methods.includes('whatsapp') && (
                <div className="rounded-2xl bg-primary-50 px-4 py-3">
                  {editingField === 'whatsapp' ? (
                    <div>
                      <div className="flex min-h-11 items-center overflow-hidden rounded-xl border border-line bg-white focus-within:border-primary-300" dir="ltr">
                        <span className="grid h-11 place-items-center bg-primary-100 px-3 font-black text-primary-700">+212</span>
                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="6 00 00 00 00"
                          className="min-w-0 flex-1 bg-transparent px-3 font-bold text-ink outline-none"
                        />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={draft.length < 9}
                          className="rounded-full bg-primary-500 px-4 py-1.5 text-sm font-black text-white disabled:opacity-50"
                        >
                          {tr(SAVE_LABEL, lang)}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-full border border-line px-4 py-1.5 text-sm font-black text-muted"
                        >
                          {tr(CANCEL_LABEL, lang)}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate font-bold text-primary-800" dir="ltr">
                        💬 +212 {whatsappNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit('whatsapp')}
                        className="shrink-0 rounded-full border border-primary-200 px-3 py-1 text-xs font-black text-primary-700"
                      >
                        ✏️ {tr(EDIT_LABEL, lang)}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp confirmation delivered — tell the user to check their phone. */}
          {whatsappSent && methods.includes('whatsapp') && (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold leading-6 text-green-700">
              {tr(WA_CONFIRMATION_SENT, lang)}
            </div>
          )}

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

              {/* Top row: Browser Push + Email (equal width) */}
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
                        'relative flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center text-sm font-black transition',
                        selected ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-line bg-white/55 text-muted',
                      )}
                    >
                      {selected && <CheckCircle2 className="absolute end-2 top-2 text-primary-500" size={18} />}
                      <span className="text-2xl" aria-hidden>{emoji}</span>
                      {r.methods[key].label}
                    </button>
                  );
                })}
              </div>

              {/* Bottom row: WhatsApp (full width, slightly bigger). Disabled when unavailable. */}
              <button
                type="button"
                onClick={() => whatsappAvailable && toggleMethod('whatsapp')}
                disabled={!whatsappAvailable}
                aria-pressed={methods.includes('whatsapp')}
                className={cn(
                  'relative mt-2 flex min-h-[104px] w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 p-4 text-center text-base font-black transition',
                  !whatsappAvailable
                    ? 'cursor-not-allowed border-line bg-gray-100 text-gray-400 opacity-60'
                    : methods.includes('whatsapp')
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-line bg-white/55 text-muted',
                )}
              >
                {whatsappAvailable && methods.includes('whatsapp') && (
                  <CheckCircle2 className="absolute end-2 top-2 text-primary-500" size={20} />
                )}
                <span className="text-3xl" aria-hidden>💬</span>
                {tr(WA_LABEL, lang)}
                {!whatsappAvailable && (
                  <span className="text-xs font-bold text-gray-400">{tr(WA_UNAVAILABLE, lang)}</span>
                )}
              </button>

              {/* Email input — below the cards, only when Email is selected. */}
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

              {/* WhatsApp number — below the cards, only when WhatsApp is selected. */}
              <AnimatePresence>
                {methods.includes('whatsapp') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-4">
                      <label htmlFor="reminder-wa" className="text-sm font-black text-muted">{r.phoneLabel}</label>
                      <div className="mt-2 flex min-h-12 items-center overflow-hidden rounded-2xl border border-line bg-white/70 focus-within:border-primary-300" dir="ltr">
                        <span className="grid h-12 place-items-center bg-primary-50 px-3 font-black text-primary-700">+212</span>
                        <input
                          id="reminder-wa"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="6 00 00 00 00"
                          className="min-w-0 flex-1 bg-transparent px-3 font-bold text-ink outline-none"
                        />
                      </div>
                      {!whatsappOk && whatsappNumber.length > 0 && <p className="mt-1.5 text-sm font-bold text-risk-high">{r.phoneInvalid}</p>}
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
              <Button fullWidth size="lg" leftIcon={<Bell size={18} />} disabled={!canActivate || activating} onClick={activate}>
                {r.activateBtn}
              </Button>
            </StepCard>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
