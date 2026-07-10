// Credentials come from the environment (.env, gitignored) — never hardcode
// secrets in source. See .env.example for the required variables.
const OPENWA_URL = import.meta.env.VITE_OPENWA_URL || 'http://localhost:2785/api';
const OPENWA_KEY = import.meta.env.VITE_OPENWA_KEY || '';
const SESSION_ID = import.meta.env.VITE_OPENWA_SESSION || '';

const TIME_LABELS: Record<string, Record<string, string>> = {
  morning: {
    ar: 'الصباح — 8:00',
    fr: 'Le matin — 8h00',
    en: 'Morning — 8:00 AM',
    es: 'Mañana — 8:00',
    de: 'Morgens — 8:00 Uhr',
    ru: 'Утро — 8:00',
    pt: 'Manhã — 8:00',
  },
  afternoon: {
    ar: 'بعد الظهر — 14:00',
    fr: 'L\'après-midi — 14h00',
    en: 'Afternoon — 2:00 PM',
    es: 'Tarde — 14:00',
    de: 'Nachmittag — 14:00 Uhr',
    ru: 'День — 14:00',
    pt: 'Tarde — 14:00',
  },
  evening: {
    ar: 'المسا — 20:00',
    fr: 'Le soir — 20h00',
    en: 'Evening — 8:00 PM',
    es: 'Noche — 20:00',
    de: 'Abends — 20:00 Uhr',
    ru: 'Вечер — 20:00',
    pt: 'Noite — 20:00',
  },
};

function getConfirmationMessage(day: number, time: string, lang: string): string {
  const timeLabel = TIME_LABELS[time]?.[lang] || TIME_LABELS[time]?.en || time;

  const messages: Record<string, string> = {
    ar: `🎀 *صحّتك — تأكيد التذكير*\n\nمرحبا بيك! التذكير ديالك مفعّل بنجاح ✅\n\n📅 *اليوم:* ${day} من كل شهر\n⏰ *الوقت:* ${timeLabel}\n\nغادي نذكّروك بالفحص الذاتي للثدي كل شهر. الفحص كياخد غير 5 دقائق وكيساعدك تحافظي على صحتك.\n\n🩺 *باش تبداي الفحص:*\nhttps://sahtek.tech/self-check\n\nصحتك أمانة، وحنا معاك 💗`,

    fr: `🎀 *Sahtek — Confirmation du rappel*\n\nBienvenue ! Votre rappel a été activé avec succès ✅\n\n📅 *Jour :* le ${day} de chaque mois\n⏰ *Heure :* ${timeLabel}\n\nNous vous rappellerons l'auto-examen mammaire chaque mois. L'examen ne prend que 5 minutes et vous aide à préserver votre santé.\n\n🩺 *Pour commencer l'examen :*\nhttps://sahtek.tech/self-check\n\nVotre santé est précieuse, nous sommes avec vous 💗`,

    en: `🎀 *Sahtek — Reminder Confirmation*\n\nWelcome! Your reminder has been activated successfully ✅\n\n📅 *Day:* ${day}th of every month\n⏰ *Time:* ${timeLabel}\n\nWe will remind you about your monthly breast self-examination. The exam takes only 5 minutes and helps you protect your health.\n\n🩺 *To start your exam:*\nhttps://sahtek.tech/self-check\n\nYour health matters, we are with you 💗`,

    es: `🎀 *Sahtek — Confirmación del recordatorio*\n\nBienvenida! Su recordatorio ha sido activado con éxito ✅\n\n📅 *Día:* ${day} de cada mes\n⏰ *Hora:* ${timeLabel}\n\nLe recordaremos el autoexamen mamario cada mes. El examen solo toma 5 minutos y le ayuda a cuidar su salud.\n\n🩺 *Para comenzar el examen:*\nhttps://sahtek.tech/self-check\n\nSu salud es valiosa, estamos con usted 💗`,

    de: `🎀 *Sahtek — Erinnerungsbestätigung*\n\nWillkommen! Ihre Erinnerung wurde erfolgreich aktiviert ✅\n\n📅 *Tag:* ${day}. jedes Monats\n⏰ *Uhrzeit:* ${timeLabel}\n\nWir erinnern Sie monatlich an die Brust-Selbstuntersuchung. Die Untersuchung dauert nur 5 Minuten und hilft Ihnen, Ihre Gesundheit zu schützen.\n\n🩺 *Um die Untersuchung zu starten:*\nhttps://sahtek.tech/self-check\n\nIhre Gesundheit ist wertvoll, wir sind für Sie da 💗`,

    ru: `🎀 *Sahtek — Подтверждение напоминания*\n\nДобро пожаловать! Ваше напоминание успешно активировано ✅\n\n📅 *День:* ${day}-е число каждого месяца\n⏰ *Время:* ${timeLabel}\n\nМы будем напоминать вам о ежемесячном самообследовании молочных желёз. Обследование занимает всего 5 минут и помогает сохранить ваше здоровье.\n\n🩺 *Чтобы начать обследование:*\nhttps://sahtek.tech/self-check\n\nВаше здоровье важно, мы с вами 💗`,

    pt: `🎀 *Sahtek — Confirmação do lembrete*\n\nBem-vinda! Seu lembrete foi ativado com sucesso ✅\n\n📅 *Dia:* ${day} de cada mês\n⏰ *Horário:* ${timeLabel}\n\nNós lembraremos você do autoexame mamário mensal. O exame leva apenas 5 minutos e ajuda a proteger sua saúde.\n\n🩺 *Para iniciar o exame:*\nhttps://sahtek.tech/self-check\n\nSua saúde é preciosa, estamos com você 💗`,
  };

  return messages[lang] || messages.en;
}

function getMonthlyReminderMessage(lang: string): string {
  const messages: Record<string, string> = {
    ar: `🎀 *صحّتك — تذكير الفحص الذاتي*\n\nمرحبا! هاد الشهر ما تنساي الفحص الذاتي للثدي 🩺\n\nالفحص كياخد غير *5 دقائق* وكيقدر ينقذ حياتك.\n\n*الخطوات:*\n1️⃣ راقبي فالمرآة\n2️⃣ رفعي يديك\n3️⃣ افحصي واقفة\n4️⃣ افحصي مستلقية\n5️⃣ افحصي الحلمة\n\n🩺 *ابداي الفحص دابا:*\nhttps://sahtek.tech/self-check\n\nصحتك بين يديك 💗`,

    fr: `🎀 *Sahtek — Rappel d'auto-examen*\n\nBonjour ! Ce mois-ci, n'oubliez pas votre auto-examen mammaire 🩺\n\nL'examen ne prend que *5 minutes* et peut sauver votre vie.\n\n*Les étapes :*\n1️⃣ Observez devant le miroir\n2️⃣ Levez les bras\n3️⃣ Examinez debout\n4️⃣ Examinez allongée\n5️⃣ Vérifiez le mamelon\n\n🩺 *Commencez maintenant :*\nhttps://sahtek.tech/self-check\n\nVotre santé entre vos mains 💗`,

    en: `🎀 *Sahtek — Self-Exam Reminder*\n\nHello! This month, don't forget your breast self-examination 🩺\n\nThe exam takes only *5 minutes* and can save your life.\n\n*The steps:*\n1️⃣ Observe in the mirror\n2️⃣ Raise your arms\n3️⃣ Examine standing\n4️⃣ Examine lying down\n5️⃣ Check the nipple\n\n🩺 *Start your exam now:*\nhttps://sahtek.tech/self-check\n\nYour health is in your hands 💗`,

    es: `🎀 *Sahtek — Recordatorio de autoexamen*\n\nHola! Este mes, no olvides tu autoexamen mamario 🩺\n\nEl examen toma solo *5 minutos* y puede salvar tu vida.\n\n*Los pasos:*\n1️⃣ Observa frente al espejo\n2️⃣ Levanta los brazos\n3️⃣ Examina de pie\n4️⃣ Examina acostada\n5️⃣ Revisa el pezón\n\n🩺 *Comienza ahora:*\nhttps://sahtek.tech/self-check\n\nTu salud está en tus manos 💗`,

    de: `🎀 *Sahtek — Erinnerung an die Selbstuntersuchung*\n\nHallo! Vergessen Sie diesen Monat nicht Ihre Brust-Selbstuntersuchung 🩺\n\nDie Untersuchung dauert nur *5 Minuten* und kann Ihr Leben retten.\n\n*Die Schritte:*\n1️⃣ Im Spiegel beobachten\n2️⃣ Arme heben\n3️⃣ Im Stehen untersuchen\n4️⃣ Im Liegen untersuchen\n5️⃣ Brustwarze prüfen\n\n🩺 *Jetzt starten:*\nhttps://sahtek.tech/self-check\n\nIhre Gesundheit liegt in Ihren Händen 💗`,

    ru: `🎀 *Sahtek — Напоминание о самообследовании*\n\nЗдравствуйте! В этом месяце не забудьте о самообследовании молочных желёз 🩺\n\nОбследование занимает всего *5 минут* и может спасти вашу жизнь.\n\n*Шаги:*\n1️⃣ Осмотр перед зеркалом\n2️⃣ Поднимите руки\n3️⃣ Обследуйте стоя\n4️⃣ Обследуйте лёжа\n5️⃣ Проверьте сосок\n\n🩺 *Начните сейчас:*\nhttps://sahtek.tech/self-check\n\nВаше здоровье в ваших руках 💗`,

    pt: `🎀 *Sahtek — Lembrete de autoexame*\n\nOlá! Neste mês, não esqueça seu autoexame mamário 🩺\n\nO exame leva apenas *5 minutos* e pode salvar sua vida.\n\n*Os passos:*\n1️⃣ Observe no espelho\n2️⃣ Levante os braços\n3️⃣ Examine de pé\n4️⃣ Examine deitada\n5️⃣ Verifique o mamilo\n\n🩺 *Comece agora:*\nhttps://sahtek.tech/self-check\n\nSua saúde está em suas mãos 💗`,
  };

  return messages[lang] || messages.en;
}

function formatPhoneNumber(phone: string): string {
  let num = phone.replace(/[\s\-\(\)\+]/g, '');
  if (num.startsWith('0')) num = '212' + num.slice(1);
  if (!num.startsWith('212')) num = '212' + num;
  return num + '@c.us';
}

export async function sendWhatsAppConfirmation(
  phoneNumber: string,
  lang: string,
  day: number,
  time: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const chatId = formatPhoneNumber(phoneNumber);
    const text = getConfirmationMessage(day, time, lang);

    const response = await fetch(
      `${OPENWA_URL}/sessions/${SESSION_ID}/messages/send-text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': OPENWA_KEY,
        },
        body: JSON.stringify({ chatId, text }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.message || 'Failed to send' };
    }

    // Save phone + lang for monthly reminders
    localStorage.setItem('sahtek_whatsapp', JSON.stringify({
      phone: phoneNumber,
      lang,
      day,
      time,
      active: true,
    }));

    return { success: true };
  } catch (error) {
    return { success: false, error: 'WhatsApp service unavailable' };
  }
}

export async function sendMonthlyReminder(
  phoneNumber: string,
  lang: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const chatId = formatPhoneNumber(phoneNumber);
    const text = getMonthlyReminderMessage(lang);

    const response = await fetch(
      `${OPENWA_URL}/sessions/${SESSION_ID}/messages/send-text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': OPENWA_KEY,
        },
        body: JSON.stringify({ chatId, text }),
      }
    );

    if (!response.ok) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function checkWhatsAppAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OPENWA_URL}/sessions/${SESSION_ID}`, {
      headers: { 'X-API-Key': OPENWA_KEY },
    });
    return res.ok;
  } catch {
    return false;
  }
}
