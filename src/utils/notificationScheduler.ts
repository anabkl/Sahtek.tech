import { useLanguageStore } from '@/stores/languageStore';

/**
 * LocalStorage key for the saved reminder. The ReminderPage reads/writes the
 * same key — exported here so there is a single source of truth and the
 * app-load reader can never drift from the writer.
 */
export const REMINDER_STORAGE_KEY = 'sahtek.reminder';

const LAST_NOTIFIED_KEY = 'sahtek.reminder.lastNotified';

const TIME_MAP: Record<string, number> = {
  morning: 8,
  afternoon: 14,
  evening: 20,
};

export interface ScheduledReminder {
  reminderDay: number;
  reminderTime: string;
  isActive: boolean;
}

// Module-scoped so the app-load schedule and the "activate" schedule can never
// stack two intervals on top of each other.
let reminderInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Poll once a minute and fire the monthly reminder when the saved day + time
 * arrives.
 *
 * IMPORTANT: this is an in-app reminder — it only runs while a tab is open. It
 * is NOT true background push (that needs the Push API + a push service worker
 * + a server). Good enough to demo and to remind an active user.
 */
export function scheduleNotificationCheck(reminder: ScheduledReminder) {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
  if (!reminder.isActive) return;

  reminderInterval = setInterval(() => {
    const now = new Date();
    const targetHour = TIME_MAP[reminder.reminderTime] ?? 8;
    const today = now.toISOString().slice(0, 10);

    if (
      now.getDate() === reminder.reminderDay &&
      now.getHours() === targetHour &&
      now.getMinutes() < 5 && // within the first 5 minutes of the hour
      readLastNotified() !== today // fire once per day, not every minute
    ) {
      try {
        localStorage.setItem(LAST_NOTIFIED_KEY, today);
      } catch {
        /* ignore unavailable storage */
      }
      showNotification();
    }
  }, 60_000);
}

function readLastNotified(): string | null {
  try {
    return localStorage.getItem(LAST_NOTIFIED_KEY);
  } catch {
    return null;
  }
}

/** Read the active language from the store (works outside React). */
function activeLang(explicit?: string): string {
  if (explicit) return explicit;
  try {
    return useLanguageStore.getState().lang;
  } catch {
    return 'ar';
  }
}

/** Show the reminder notification now. Used by the scheduler and the test button. */
export function showNotification(lang?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const l = activeLang(lang);

  const titles: Record<string, string> = {
    ar: '🎀 صحّتك — وقت الفحص الذاتي',
    fr: '🎀 Sahtek — Heure de l\'auto-examen',
    en: '🎀 Sahtek — Time for self-check',
    es: '🎀 Sahtek — Hora del autoexamen',
    de: '🎀 Sahtek — Zeit zur Selbstuntersuchung',
    ru: '🎀 Sahtek — Время самообследования',
    pt: '🎀 Sahtek — Hora do autoexame',
  };

  const bodies: Record<string, string> = {
    ar: 'ما تنساي الفحص الذاتي ديال هاد الشهر! 5 دقائق غادي تحميك. 💗',
    fr: 'N\'oubliez pas votre auto-examen ce mois-ci ! 5 minutes pour vous protéger. 💗',
    en: 'Don\'t forget your self-exam this month! 5 minutes to protect yourself. 💗',
    es: '¡No olvides tu autoexamen este mes! 5 minutos para protegerte. 💗',
    de: 'Vergiss deine Selbstuntersuchung diesen Monat nicht! 5 Minuten für deinen Schutz. 💗',
    ru: 'Не забудьте самообследование в этом месяце! 5 минут для вашей защиты. 💗',
    pt: 'Não esqueça seu autoexame este mês! 5 minutos para se proteger. 💗',
  };

  try {
    const notification = new Notification(titles[l] || titles.en, {
      body: bodies[l] || bodies.en,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'sahtek-reminder', // collapses duplicates into one
      requireInteraction: true, // stays until the user acts on it
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = '/self-check';
      notification.close();
    };
  } catch {
    // Some mobile browsers forbid the Notification constructor and require a
    // ServiceWorkerRegistration instead. Fail silently rather than crash.
  }
}

export function cancelReminder() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
  try {
    localStorage.removeItem(REMINDER_STORAGE_KEY);
  } catch {
    /* ignore unavailable storage */
  }
}
