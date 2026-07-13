import { nextReminderDate } from '@/utils/formatters';

// ════════════════════════════════════════════════════════════════════
//  Monthly self-check reminder as a calendar file (RFC 5545 .ics).
//
//  Why this exists: a web page cannot notify anyone once it is closed. The
//  in-app scheduler only fires if a tab happens to be open at the right hour,
//  and the "email" method never sent anything at all. Handing the woman a
//  recurring calendar event moves the reminder to the one scheduler that is
//  always running — her own phone.
//
//  It is also the most private option available: the file is built in the
//  browser and saved to her device. Nothing is uploaded, no address is stored,
//  and no server ever learns that she uses a breast-health app.
// ════════════════════════════════════════════════════════════════════

const HOUR_OF_DAY: Record<string, number> = { morning: 8, afternoon: 14, evening: 20 };

const SUMMARY: Record<string, string> = {
  ar: '🎀 صحّتك — وقت الفحص الذاتي',
  fr: '🎀 Sahtek — Heure de l’auto-examen',
  en: '🎀 Sahtek — Time for your self-check',
  es: '🎀 Sahtek — Hora del autoexamen',
  de: '🎀 Sahtek — Zeit für die Selbstuntersuchung',
  ru: '🎀 Sahtek — Время самообследования',
  pt: '🎀 Sahtek — Hora do autoexame',
};

const DESCRIPTION: Record<string, string> = {
  ar: 'خمس دقائق فقط لصحتك. الفحص الذاتي الشهري كيعاونك تعرفي شنو هو الطبيعي عندك. 💗',
  fr: 'Cinq minutes pour vous. L’auto-examen mensuel vous aide à connaître votre normal. 💗',
  en: 'Five quiet minutes for you. The monthly self-check helps you know your normal. 💗',
  es: 'Cinco minutos para ti. El autoexamen mensual te ayuda a conocer tu normalidad. 💗',
  de: 'Fünf Minuten für dich. Die monatliche Selbstuntersuchung hilft dir, dein Normal zu kennen. 💗',
  ru: 'Пять минут для себя. Ежемесячное самообследование помогает узнать вашу норму. 💗',
  pt: 'Cinco minutos para você. O autoexame mensal ajuda a conhecer o seu normal. 💗',
};

/** Escape per RFC 5545 §3.3.11: backslash, semicolon, comma, newline. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Fold long lines to 75 octets (RFC 5545 §3.1). Counted in BYTES, not
 * characters — Arabic and emoji are multi-byte, so a naive character count
 * would emit lines that break strict parsers.
 */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const out: string[] = [];
  let current = '';
  let currentBytes = 0;
  let limit = 75;

  for (const char of line) {
    const size = encoder.encode(char).length;
    if (currentBytes + size > limit) {
      out.push(current);
      current = ' '; // continuation lines begin with a space
      currentBytes = 1;
      limit = 75;
    }
    current += char;
    currentBytes += size;
  }
  out.push(current);
  return out.join('\r\n');
}

/** Local wall-clock stamp: YYYYMMDDTHHMMSS, no trailing Z. */
function floatingStamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  );
}

function utcStamp(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

/**
 * Build the .ics for a monthly reminder on `day` at `time`.
 *
 * DTSTART is a *floating* local time (no Z, no TZID) on purpose: it means
 * "08:00 wherever she is", which survives her travelling and Morocco's Ramadan
 * clock shift. A UTC stamp would drift by an hour.
 *
 * Days 29–31 are deliberately not special-cased — the ReminderPage already
 * caps the choice at 28 so the event exists in every month.
 */
export function buildReminderIcs(day: number, time: string, lang: string): string {
  const hour = HOUR_OF_DAY[time] ?? 8;

  const start = nextReminderDate(day);
  start.setHours(hour, 0, 0, 0);

  const summary = SUMMARY[lang] ?? SUMMARY.en;
  const description = DESCRIPTION[lang] ?? DESCRIPTION.en;
  const uid = `sahtek-selfcheck-${day}-${time}-${Date.now()}@sahtek.tech`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sahtek//Self-check reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${floatingStamp(start)}`,
    'DURATION:PT15M',
    `RRULE:FREQ=MONTHLY;BYMONTHDAY=${day}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    'URL:https://sahtek.tech/self-check',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(summary)}`,
    'TRIGGER:PT0S',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/** Build the reminder and hand it to the browser as a download. */
export function downloadReminderIcs(day: number, time: string, lang: string): void {
  const blob = new Blob([buildReminderIcs(day, time, lang)], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'sahtek-self-check.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Give the browser a beat to start the download before revoking.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
