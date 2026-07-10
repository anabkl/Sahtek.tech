// ════════════════════════════════════════════════════════════════════
//  Reads the user's in-app progress from localStorage so the AI chat can
//  give personalized, context-aware answers. Keys/shapes here mirror what
//  the feature hooks actually persist:
//    • self-check  → sahtek_selfcheck            (useSelfCheck: stage === 'done')
//    • reminder    → sahtek.reminder             (ReminderPage: ReminderSettings)
//    • risk        → sahtek_risk                 (useRiskAssessment: { value: { result } })
//    • myths       → sahtek_myths_flipped        (MythsWall: string[])
//    • habits      → sahtek.prevention.checked   (PreventionTracker: string[])
//  Everything is defensive: a missing/corrupt entry just leaves its default.
// ════════════════════════════════════════════════════════════════════

export interface UserContext {
  completedSelfCheck: boolean;
  hasReminder: boolean;
  reminderDay?: number;
  reminderTime?: string;
  reminderMethods?: string[];
  completedRiskAssessment: boolean;
  riskLevel?: string;
  flippedMythsCount: number;
  checkedHabitsCount: number;
}

export function getUserContext(): UserContext {
  const ctx: UserContext = {
    completedSelfCheck: false,
    hasReminder: false,
    completedRiskAssessment: false,
    flippedMythsCount: 0,
    checkedHabitsCount: 0,
  };

  // Self-check — completion is the wizard reaching the 'done' stage.
  try {
    const raw = localStorage.getItem('sahtek_selfcheck');
    if (raw) {
      const data = JSON.parse(raw) as { stage?: string };
      ctx.completedSelfCheck = data?.stage === 'done';
    }
  } catch {
    /* ignore corrupt/unavailable storage */
  }

  // Reminder — ReminderSettings object.
  try {
    const raw = localStorage.getItem('sahtek.reminder');
    if (raw) {
      const data = JSON.parse(raw) as {
        isActive?: boolean;
        reminderDay?: number;
        reminderTime?: string;
        methods?: string[];
      };
      ctx.hasReminder = !!data?.isActive;
      ctx.reminderDay = data?.reminderDay;
      ctx.reminderTime = data?.reminderTime;
      if (Array.isArray(data?.methods)) ctx.reminderMethods = data.methods;
    }
  } catch {
    /* ignore */
  }

  // Risk assessment — persisted as { value: { result }, _timestamp }.
  try {
    const raw = localStorage.getItem('sahtek_risk');
    if (raw) {
      const data = JSON.parse(raw) as {
        value?: { result?: { risk_level?: string } | null };
      };
      const result = data?.value?.result;
      ctx.completedRiskAssessment = !!result;
      ctx.riskLevel = result?.risk_level;
    }
  } catch {
    /* ignore */
  }

  // Myths flipped — array of card ids.
  try {
    const raw = localStorage.getItem('sahtek_myths_flipped');
    if (raw) {
      const arr = JSON.parse(raw) as unknown;
      if (Array.isArray(arr)) ctx.flippedMythsCount = arr.length;
    }
  } catch {
    /* ignore */
  }

  // Prevention habits checked — array of habit keys.
  try {
    const raw = localStorage.getItem('sahtek.prevention.checked');
    if (raw) {
      const arr = JSON.parse(raw) as unknown;
      if (Array.isArray(arr)) ctx.checkedHabitsCount = arr.length;
    }
  } catch {
    /* ignore */
  }

  return ctx;
}

// ── Localized context summary appended to the chat system prompt ────────
// Kept short and framed as background the model should weave in naturally —
// never read back to the user as a list.
interface ContextCopy {
  header: string;
  selfCheckYes: string;
  selfCheckNo: string;
  reminderYes: (day?: number) => string;
  reminderNo: string;
  riskYes: (level?: string) => string;
  riskNo: string;
  footer: string;
}

const CONTEXT_COPY: Record<string, ContextCopy> = {
  ar: {
    header: 'معلومات على المستخدمة الحالية (استعمليها باش تعطي جواب شخصي وطبيعي، بلا ما تعدّدي عليها كلشي):',
    selfCheckYes: '- كمّلات الفحص الذاتي ✅',
    selfCheckNo: '- ما كمّلاتش الفحص الذاتي بعد',
    reminderYes: (day) => `- فعّلات التذكير الشهري${day ? ` (يوم ${day})` : ''}`,
    reminderNo: '- ما فعّلاتش التذكير بعد',
    riskYes: (level) => `- دارت تقييم المخاطر${level ? ` (النتيجة: ${level})` : ''}`,
    riskNo: '- ما دارتش تقييم المخاطر بعد',
    footer: 'اقترحي عليها الخطوات اللي ما كمّلاتهمش إلا كان مناسب، بطريقة طبيعية وحنونة.',
  },
  fr: {
    header: "Contexte de l'utilisatrice actuelle (à utiliser pour personnaliser naturellement, sans tout énumérer):",
    selfCheckYes: "- A complété l'auto-examen ✅",
    selfCheckNo: "- N'a pas encore fait l'auto-examen",
    reminderYes: (day) => `- A activé le rappel mensuel${day ? ` (jour ${day})` : ''}`,
    reminderNo: "- N'a pas activé de rappel",
    riskYes: (level) => `- A fait l'évaluation des risques${level ? ` (résultat: ${level})` : ''}`,
    riskNo: "- N'a pas fait l'évaluation des risques",
    footer: 'Suggérez les étapes non complétées si pertinent, de façon naturelle.',
  },
  en: {
    header: 'Current user context (use it to personalize naturally — do not read it back to her as a list):',
    selfCheckYes: '- Has completed the self-check ✅',
    selfCheckNo: '- Has NOT done the self-check yet',
    reminderYes: (day) => `- Has an active monthly reminder${day ? ` (day ${day})` : ''}`,
    reminderNo: '- Has NOT set a reminder yet',
    riskYes: (level) => `- Completed the risk assessment${level ? ` (result: ${level})` : ''}`,
    riskNo: '- Has NOT done the risk assessment yet',
    footer: 'Suggest the uncompleted steps when relevant, woven in naturally.',
  },
  es: {
    header: 'Contexto de la usuaria actual (úsalo para personalizar de forma natural, sin enumerarlo todo):',
    selfCheckYes: '- Ha completado el autoexamen ✅',
    selfCheckNo: '- Aún NO ha hecho el autoexamen',
    reminderYes: (day) => `- Tiene un recordatorio mensual activo${day ? ` (día ${day})` : ''}`,
    reminderNo: '- Aún NO ha configurado un recordatorio',
    riskYes: (level) => `- Completó la evaluación de riesgo${level ? ` (resultado: ${level})` : ''}`,
    riskNo: '- Aún NO ha hecho la evaluación de riesgo',
    footer: 'Sugiere los pasos no completados cuando sea relevante, de forma natural.',
  },
  de: {
    header: 'Kontext der aktuellen Nutzerin (nutze ihn, um natürlich zu personalisieren, ohne alles aufzuzählen):',
    selfCheckYes: '- Hat die Selbstuntersuchung abgeschlossen ✅',
    selfCheckNo: '- Hat die Selbstuntersuchung noch NICHT gemacht',
    reminderYes: (day) => `- Hat eine aktive monatliche Erinnerung${day ? ` (Tag ${day})` : ''}`,
    reminderNo: '- Hat noch KEINE Erinnerung eingerichtet',
    riskYes: (level) => `- Hat die Risikobewertung abgeschlossen${level ? ` (Ergebnis: ${level})` : ''}`,
    riskNo: '- Hat die Risikobewertung noch NICHT gemacht',
    footer: 'Schlage die nicht abgeschlossenen Schritte vor, wenn passend — natürlich eingebunden.',
  },
  ru: {
    header: 'Контекст текущей пользовательницы (используйте для естественной персонализации, не перечисляя всё вслух):',
    selfCheckYes: '- Прошла самообследование ✅',
    selfCheckNo: '- Ещё НЕ прошла самообследование',
    reminderYes: (day) => `- Настроила ежемесячное напоминание${day ? ` (день ${day})` : ''}`,
    reminderNo: '- Ещё НЕ настроила напоминание',
    riskYes: (level) => `- Прошла оценку риска${level ? ` (результат: ${level})` : ''}`,
    riskNo: '- Ещё НЕ прошла оценку риска',
    footer: 'Предлагайте незавершённые шаги, когда это уместно, естественно вплетая их.',
  },
  pt: {
    header: 'Contexto da usuária atual (use para personalizar de forma natural, sem listar tudo):',
    selfCheckYes: '- Concluiu o autoexame ✅',
    selfCheckNo: '- Ainda NÃO fez o autoexame',
    reminderYes: (day) => `- Tem um lembrete mensal ativo${day ? ` (dia ${day})` : ''}`,
    reminderNo: '- Ainda NÃO configurou um lembrete',
    riskYes: (level) => `- Concluiu a avaliação de risco${level ? ` (resultado: ${level})` : ''}`,
    riskNo: '- Ainda NÃO fez a avaliação de risco',
    footer: 'Sugira os passos não concluídos quando for relevante, de forma natural.',
  },
};

/** Build a short, natural-language context summary for the AI in `lang`. */
export function buildContextPrompt(ctx: UserContext, lang: string): string {
  const c = CONTEXT_COPY[lang] || CONTEXT_COPY.en;
  return [
    c.header,
    ctx.completedSelfCheck ? c.selfCheckYes : c.selfCheckNo,
    ctx.hasReminder ? c.reminderYes(ctx.reminderDay) : c.reminderNo,
    ctx.completedRiskAssessment ? c.riskYes(ctx.riskLevel) : c.riskNo,
    c.footer,
  ].join('\n');
}
