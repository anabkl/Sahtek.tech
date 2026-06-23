import type { Language } from '@/types/api';
import type { RiskLevel, RiskQuestionId, RiskRecommendation } from '@/types/risk';

// ════════════════════════════════════════════════════════════════════
//  Localized copy for the risk-assessment result (DEMO MODE).
// ════════════════════════════════════════════════════════════════════

/** For each question, the option value that counts as a protective factor. */
export const PROTECTIVE_ANSWER: Partial<Record<RiskQuestionId, string>> = {
  family_history: 'none',
  exercise: 'daily',
  smoking_alcohol: 'never',
  self_exam: 'monthly',
  overweight: 'no',
  breastfeeding: 'yes',
  first_pregnancy_age: 'before_30',
};

/** Human phrasing for an identified risk / protective factor. */
export const FACTOR_COPY: Record<
  Language,
  Partial<Record<RiskQuestionId, { risk?: string; protective?: string }>>
> = {
  ar: {
    age: { risk: 'العمر فوق 40 عام' },
    family_history: { risk: 'تاريخ عائلي لسرطان الثدي', protective: 'غياب التاريخ العائلي' },
    exercise: { risk: 'قلة النشاط البدني', protective: 'ممارسة الرياضة بانتظام' },
    smoking_alcohol: { risk: 'التدخين أو الكحول', protective: 'عدم التدخين والكحول' },
    self_exam: { risk: 'عدم انتظام الفحص الذاتي', protective: 'الفحص الذاتي المنتظم' },
    overweight: { risk: 'وزن زائد', protective: 'الحفاظ على وزن صحي' },
    breastfeeding: { risk: 'عدم الرضاعة الطبيعية', protective: 'الرضاعة الطبيعية' },
    first_period_age: { risk: 'بداية مبكرة للدورة الشهرية' },
    hormone_therapy: { risk: 'العلاج الهرموني' },
    first_pregnancy_age: { risk: 'الحمل الأول بعد 30 أو عدمه', protective: 'الحمل الأول قبل 30' },
  },
  fr: {
    age: { risk: 'Âge supérieur à 40 ans' },
    family_history: { risk: 'Antécédents familiaux de cancer du sein', protective: 'Absence d’antécédents familiaux' },
    exercise: { risk: 'Manque d’activité physique', protective: 'Activité physique régulière' },
    smoking_alcohol: { risk: 'Tabac ou alcool', protective: 'Pas de tabac ni d’alcool' },
    self_exam: { risk: 'Auto-examen irrégulier', protective: 'Auto-examen régulier' },
    overweight: { risk: 'Surpoids', protective: 'Poids santé maintenu' },
    breastfeeding: { risk: 'Absence d’allaitement', protective: 'Allaitement' },
    first_period_age: { risk: 'Règles précoces' },
    hormone_therapy: { risk: 'Traitement hormonal' },
    first_pregnancy_age: { risk: 'Première grossesse après 30 ans ou absente', protective: 'Première grossesse avant 30 ans' },
  },
  en: {
    age: { risk: 'Age over 40' },
    family_history: { risk: 'Family history of breast cancer', protective: 'No family history' },
    exercise: { risk: 'Low physical activity', protective: 'Regular physical activity' },
    smoking_alcohol: { risk: 'Tobacco or alcohol use', protective: 'No tobacco or alcohol' },
    self_exam: { risk: 'Irregular self-checks', protective: 'Regular self-checks' },
    overweight: { risk: 'Excess weight', protective: 'Healthy weight maintained' },
    breastfeeding: { risk: 'No breastfeeding', protective: 'Breastfeeding' },
    first_period_age: { risk: 'Early first period' },
    hormone_therapy: { risk: 'Hormone therapy' },
    first_pregnancy_age: { risk: 'First pregnancy after 30 or none', protective: 'First pregnancy before 30' },
  },
  es: {
    age: { risk: 'Edad superior a 40 años' },
    family_history: { risk: 'Antecedentes familiares de cáncer de mama', protective: 'Sin antecedentes familiares' },
    exercise: { risk: 'Poca actividad física', protective: 'Actividad física regular' },
    smoking_alcohol: { risk: 'Tabaco o alcohol', protective: 'Sin tabaco ni alcohol' },
    self_exam: { risk: 'Autoexamen irregular', protective: 'Autoexamen regular' },
    overweight: { risk: 'Sobrepeso', protective: 'Peso saludable mantenido' },
    breastfeeding: { risk: 'Sin lactancia', protective: 'Lactancia' },
    first_period_age: { risk: 'Primera regla temprana' },
    hormone_therapy: { risk: 'Terapia hormonal' },
    first_pregnancy_age: { risk: 'Primer embarazo después de los 30 o ninguno', protective: 'Primer embarazo antes de los 30' },
  },
  de: {
    age: { risk: 'Alter über 40 Jahre' },
    family_history: { risk: 'Familiengeschichte von Brustkrebs', protective: 'Keine Familiengeschichte' },
    exercise: { risk: 'Geringe körperliche Aktivität', protective: 'Regelmäßige körperliche Aktivität' },
    smoking_alcohol: { risk: 'Tabak- oder Alkoholkonsum', protective: 'Kein Tabak oder Alkohol' },
    self_exam: { risk: 'Unregelmäßige Selbstuntersuchungen', protective: 'Regelmäßige Selbstuntersuchungen' },
    overweight: { risk: 'Übergewicht', protective: 'Gesundes Gewicht gehalten' },
    breastfeeding: { risk: 'Kein Stillen', protective: 'Stillen' },
    first_period_age: { risk: 'Frühe erste Periode' },
    hormone_therapy: { risk: 'Hormontherapie' },
    first_pregnancy_age: { risk: 'Erste Schwangerschaft nach 30 oder keine', protective: 'Erste Schwangerschaft vor 30' },
  },
  ru: {
    age: { risk: 'Возраст старше 40 лет' },
    family_history: { risk: 'Семейная история рака груди', protective: 'Отсутствие семейной истории' },
    exercise: { risk: 'Низкая физическая активность', protective: 'Регулярная физическая активность' },
    smoking_alcohol: { risk: 'Курение или алкоголь', protective: 'Без курения и алкоголя' },
    self_exam: { risk: 'Нерегулярное самообследование', protective: 'Регулярное самообследование' },
    overweight: { risk: 'Лишний вес', protective: 'Поддержание здорового веса' },
    breastfeeding: { risk: 'Отсутствие грудного вскармливания', protective: 'Грудное вскармливание' },
    first_period_age: { risk: 'Раннее начало месячных' },
    hormone_therapy: { risk: 'Гормональная терапия' },
    first_pregnancy_age: { risk: 'Первая беременность после 30 или её отсутствие', protective: 'Первая беременность до 30' },
  },
  pt: {
    age: { risk: 'Idade acima de 40 anos' },
    family_history: { risk: 'Histórico familiar de câncer de mama', protective: 'Sem histórico familiar' },
    exercise: { risk: 'Pouca atividade física', protective: 'Atividade física regular' },
    smoking_alcohol: { risk: 'Tabaco ou álcool', protective: 'Sem tabaco nem álcool' },
    self_exam: { risk: 'Autoexame irregular', protective: 'Autoexame regular' },
    overweight: { risk: 'Excesso de peso', protective: 'Peso saudável mantido' },
    breastfeeding: { risk: 'Sem amamentação', protective: 'Amamentação' },
    first_period_age: { risk: 'Primeira menstruação precoce' },
    hormone_therapy: { risk: 'Terapia hormonal' },
    first_pregnancy_age: { risk: 'Primeira gravidez depois dos 30 ou nenhuma', protective: 'Primeira gravidez antes dos 30' },
  },
};

export const RISK_SUMMARY: Record<Language, Record<RiskLevel, string>> = {
  ar: {
    low: 'المخاطر ديالك منخفضة 💚. راكي كتهتمّي مزيان بصحتك — كملّي هكا وحافظي على الفحص الذاتي المنتظم.',
    moderate: 'المخاطر ديالك متوسطة 🧡. من الأحسن تزيدي الاهتمام بصحتك وتديري الفحص الذاتي بانتظام، وتستشيري الطبيب.',
    high: 'المخاطر ديالك مرتفعة نسبياً ❤️. ما تخافيش — هادشي معناه غير خاصك تكوني أكثر يقظة وتحجزي موعد عند الطبيب.',
  },
  fr: {
    low: 'Votre risque est faible 💚. Vous prenez bien soin de vous — continuez ainsi et gardez un auto-examen régulier.',
    moderate: 'Votre risque est modéré 🧡. Mieux vaut renforcer votre suivi, faire l’auto-examen régulièrement et consulter un médecin.',
    high: 'Votre risque est relativement élevé ❤️. Ne paniquez pas — cela signifie simplement plus de vigilance et un rendez-vous médical.',
  },
  en: {
    low: 'Your risk is low 💚. You are taking good care of yourself — keep it up and maintain a regular self-check.',
    moderate: 'Your risk is moderate 🧡. It is best to strengthen your follow-up, self-check regularly and consult a doctor.',
    high: 'Your risk is relatively elevated ❤️. Do not panic — it simply means more vigilance and a medical appointment.',
  },
  es: {
    low: 'Tu riesgo es bajo 💚. Te cuidas bien — sigue así y mantén un autoexamen regular.',
    moderate: 'Tu riesgo es moderado 🧡. Conviene reforzar tu seguimiento, autoexaminarte con regularidad y consultar a un médico.',
    high: 'Tu riesgo es relativamente elevado ❤️. No te asustes — simplemente significa más vigilancia y una cita médica.',
  },
  de: {
    low: 'Dein Risiko ist niedrig 💚. Du kümmerst dich gut um dich — mach weiter so und behalte eine regelmäßige Selbstuntersuchung bei.',
    moderate: 'Dein Risiko ist mäßig 🧡. Am besten verstärkst du deine Nachsorge, untersuchst dich regelmäßig und konsultierst eine Ärztin.',
    high: 'Dein Risiko ist relativ erhöht ❤️. Keine Panik — es bedeutet einfach mehr Wachsamkeit und einen Arzttermin.',
  },
  ru: {
    low: 'Ваш риск низкий 💚. Вы хорошо заботитесь о себе — продолжайте так и сохраняйте регулярное самообследование.',
    moderate: 'Ваш риск умеренный 🧡. Лучше усилить наблюдение, регулярно делать самообследование и обратиться к врачу.',
    high: 'Ваш риск относительно повышен ❤️. Не паникуйте — это просто означает больше внимания и визит к врачу.',
  },
  pt: {
    low: 'Seu risco é baixo 💚. Você se cuida bem — continue assim e mantenha um autoexame regular.',
    moderate: 'Seu risco é moderado 🧡. É melhor reforçar o acompanhamento, fazer o autoexame com regularidade e consultar um médico.',
    high: 'Seu risco é relativamente elevado ❤️. Não entre em pânico — significa apenas mais vigilância e uma consulta médica.',
  },
};

export const RISK_NEXT_STEPS: Record<Language, Record<RiskLevel, string>> = {
  ar: {
    low: 'كملّي العادات الصحية ديالك وديري الفحص الذاتي كل شهر. زيارة سنوية للطبيب كافية.',
    moderate: 'من الأحسن تحجزي موعد عند الطبيب لفحص سريري. الماموغرافيا مهمة بعد سن 40.',
    high: 'ننصحوك تحجزي موعد عند الطبيب قريباً لفحص سريري وتناقشي معاه الماموغرافيا والمتابعة.',
  },
  fr: {
    low: 'Poursuivez vos bonnes habitudes et faites l’auto-examen chaque mois. Une visite annuelle chez le médecin suffit.',
    moderate: 'Mieux vaut prendre rendez-vous chez un médecin pour un examen clinique. La mammographie est importante après 40 ans.',
    high: 'Nous vous conseillons de prendre rendez-vous prochainement pour un examen clinique et de discuter du dépistage.',
  },
  en: {
    low: 'Keep up your healthy habits and self-check every month. A yearly doctor visit is enough.',
    moderate: 'It is best to book a doctor’s appointment for a clinical exam. A mammogram matters after age 40.',
    high: 'We advise booking a doctor’s appointment soon for a clinical exam and to discuss screening and follow-up.',
  },
  es: {
    low: 'Mantén tus hábitos saludables y autoexamínate cada mes. Una visita anual al médico es suficiente.',
    moderate: 'Conviene pedir cita con un médico para un examen clínico. La mamografía importa después de los 40.',
    high: 'Te aconsejamos pedir cita con un médico pronto para un examen clínico y hablar del cribado y el seguimiento.',
  },
  de: {
    low: 'Behalte deine gesunden Gewohnheiten bei und untersuche dich jeden Monat selbst. Ein jährlicher Arztbesuch genügt.',
    moderate: 'Am besten vereinbarst du einen Arzttermin für eine klinische Untersuchung. Eine Mammografie ist nach 40 wichtig.',
    high: 'Wir empfehlen, bald einen Arzttermin für eine klinische Untersuchung zu vereinbaren und Vorsorge und Nachsorge zu besprechen.',
  },
  ru: {
    low: 'Сохраняйте здоровые привычки и делайте самообследование каждый месяц. Ежегодного визита к врачу достаточно.',
    moderate: 'Лучше записаться к врачу на клинический осмотр. Маммография важна после 40 лет.',
    high: 'Советуем вскоре записаться к врачу на клинический осмотр и обсудить скрининг и наблюдение.',
  },
  pt: {
    low: 'Mantenha seus hábitos saudáveis e faça o autoexame todo mês. Uma visita anual ao médico é suficiente.',
    moderate: 'É melhor marcar uma consulta médica para um exame clínico. A mamografia importa depois dos 40.',
    high: 'Aconselhamos marcar uma consulta médica em breve para um exame clínico e discutir o rastreamento e o acompanhamento.',
  },
};

export const RISK_DISCLAIMER: Record<Language, string> = {
  ar: '⚕️ هاد التقييم للتوعية فقط وماشي تشخيص طبي. استشيري طبيبك ديما.',
  fr: '⚕️ Cette évaluation est à but de sensibilisation uniquement, pas un diagnostic. Consultez toujours votre médecin.',
  en: '⚕️ This assessment is for awareness only, not a diagnosis. Always consult your doctor.',
  es: '⚕️ Esta evaluación es solo para concienciación, no un diagnóstico. Consulta siempre a tu médico.',
  de: '⚕️ Diese Bewertung dient nur der Aufklärung, nicht der Diagnose. Konsultiere immer deine Ärztin.',
  ru: '⚕️ Эта оценка только для информирования, а не диагноз. Всегда консультируйтесь с врачом.',
  pt: '⚕️ Esta avaliação é apenas para conscientização, não um diagnóstico. Consulte sempre o seu médico.',
};

export type RecommendationKey =
  | 'self_check'
  | 'doctor_yearly'
  | 'doctor_soon'
  | 'exercise'
  | 'diet'
  | 'weight'
  | 'quit'
  | 'mammogram';

export const RECOMMENDATIONS: Record<Language, Record<RecommendationKey, RiskRecommendation>> = {
  ar: {
    self_check: { priority: 'high', icon: '🩺', action: 'ديري الفحص الذاتي كل شهر' },
    doctor_yearly: { priority: 'medium', icon: '👩‍⚕️', action: 'استشيري الطبيب مرة فالعام' },
    doctor_soon: { priority: 'high', icon: '🏥', action: 'حجزي موعد عند الطبيب قريباً لفحص سريري' },
    exercise: { priority: 'medium', icon: '🏃‍♀️', action: 'زيدي النشاط البدني — 30 دقيقة فاليوم' },
    diet: { priority: 'medium', icon: '🥗', action: 'نظام غذائي متوازن غني بالخضر والفواكه' },
    weight: { priority: 'medium', icon: '⚖️', action: 'اعملي على الوصول لوزن صحي' },
    quit: { priority: 'high', icon: '🚭', action: 'تجنّبي التدخين والكحول' },
    mammogram: { priority: 'high', icon: '🔬', action: 'ناقشي الماموغرافيا مع الطبيب (موصى بها بعد 40)' },
  },
  fr: {
    self_check: { priority: 'high', icon: '🩺', action: 'Faites un auto-examen chaque mois' },
    doctor_yearly: { priority: 'medium', icon: '👩‍⚕️', action: 'Consultez un médecin une fois par an' },
    doctor_soon: { priority: 'high', icon: '🏥', action: 'Prenez rendez-vous prochainement pour un examen clinique' },
    exercise: { priority: 'medium', icon: '🏃‍♀️', action: 'Augmentez l’activité physique — 30 min par jour' },
    diet: { priority: 'medium', icon: '🥗', action: 'Adoptez une alimentation équilibrée, riche en légumes' },
    weight: { priority: 'medium', icon: '⚖️', action: 'Travaillez vers un poids santé' },
    quit: { priority: 'high', icon: '🚭', action: 'Évitez le tabac et l’alcool' },
    mammogram: { priority: 'high', icon: '🔬', action: 'Discutez de la mammographie avec un médecin (dès 40 ans)' },
  },
  en: {
    self_check: { priority: 'high', icon: '🩺', action: 'Do a self-check every month' },
    doctor_yearly: { priority: 'medium', icon: '👩‍⚕️', action: 'See a doctor once a year' },
    doctor_soon: { priority: 'high', icon: '🏥', action: 'Book a doctor’s appointment soon for a clinical exam' },
    exercise: { priority: 'medium', icon: '🏃‍♀️', action: 'Increase physical activity — 30 minutes a day' },
    diet: { priority: 'medium', icon: '🥗', action: 'Adopt a balanced diet rich in vegetables' },
    weight: { priority: 'medium', icon: '⚖️', action: 'Work towards a healthy weight' },
    quit: { priority: 'high', icon: '🚭', action: 'Avoid tobacco and alcohol' },
    mammogram: { priority: 'high', icon: '🔬', action: 'Discuss a mammogram with a doctor (advised from 40)' },
  },
  es: {
    self_check: { priority: 'high', icon: '🩺', action: 'Hazte un autoexamen cada mes' },
    doctor_yearly: { priority: 'medium', icon: '👩‍⚕️', action: 'Visita a un médico una vez al año' },
    doctor_soon: { priority: 'high', icon: '🏥', action: 'Pide cita con un médico pronto para un examen clínico' },
    exercise: { priority: 'medium', icon: '🏃‍♀️', action: 'Aumenta la actividad física — 30 minutos al día' },
    diet: { priority: 'medium', icon: '🥗', action: 'Adopta una dieta equilibrada rica en verduras' },
    weight: { priority: 'medium', icon: '⚖️', action: 'Trabaja hacia un peso saludable' },
    quit: { priority: 'high', icon: '🚭', action: 'Evita el tabaco y el alcohol' },
    mammogram: { priority: 'high', icon: '🔬', action: 'Habla de la mamografía con un médico (recomendada desde los 40)' },
  },
  de: {
    self_check: { priority: 'high', icon: '🩺', action: 'Mach jeden Monat eine Selbstuntersuchung' },
    doctor_yearly: { priority: 'medium', icon: '👩‍⚕️', action: 'Geh einmal im Jahr zur Ärztin' },
    doctor_soon: { priority: 'high', icon: '🏥', action: 'Vereinbare bald einen Arzttermin für eine klinische Untersuchung' },
    exercise: { priority: 'medium', icon: '🏃‍♀️', action: 'Steigere die körperliche Aktivität — 30 Minuten am Tag' },
    diet: { priority: 'medium', icon: '🥗', action: 'Ernähre dich ausgewogen und gemüsereich' },
    weight: { priority: 'medium', icon: '⚖️', action: 'Arbeite auf ein gesundes Gewicht hin' },
    quit: { priority: 'high', icon: '🚭', action: 'Vermeide Tabak und Alkohol' },
    mammogram: { priority: 'high', icon: '🔬', action: 'Besprich eine Mammografie mit einer Ärztin (ab 40 empfohlen)' },
  },
  ru: {
    self_check: { priority: 'high', icon: '🩺', action: 'Делайте самообследование каждый месяц' },
    doctor_yearly: { priority: 'medium', icon: '👩‍⚕️', action: 'Посещайте врача раз в год' },
    doctor_soon: { priority: 'high', icon: '🏥', action: 'Запишитесь к врачу на клинический осмотр в ближайшее время' },
    exercise: { priority: 'medium', icon: '🏃‍♀️', action: 'Увеличьте физическую активность — 30 минут в день' },
    diet: { priority: 'medium', icon: '🥗', action: 'Придерживайтесь сбалансированного питания, богатого овощами' },
    weight: { priority: 'medium', icon: '⚖️', action: 'Работайте над достижением здорового веса' },
    quit: { priority: 'high', icon: '🚭', action: 'Избегайте курения и алкоголя' },
    mammogram: { priority: 'high', icon: '🔬', action: 'Обсудите маммографию с врачом (рекомендуется с 40)' },
  },
  pt: {
    self_check: { priority: 'high', icon: '🩺', action: 'Faça um autoexame todo mês' },
    doctor_yearly: { priority: 'medium', icon: '👩‍⚕️', action: 'Consulte um médico uma vez por ano' },
    doctor_soon: { priority: 'high', icon: '🏥', action: 'Marque uma consulta médica em breve para um exame clínico' },
    exercise: { priority: 'medium', icon: '🏃‍♀️', action: 'Aumente a atividade física — 30 minutos por dia' },
    diet: { priority: 'medium', icon: '🥗', action: 'Adote uma alimentação equilibrada e rica em vegetais' },
    weight: { priority: 'medium', icon: '⚖️', action: 'Trabalhe para alcançar um peso saudável' },
    quit: { priority: 'high', icon: '🚭', action: 'Evite tabaco e álcool' },
    mammogram: { priority: 'high', icon: '🔬', action: 'Converse sobre a mamografia com um médico (recomendada a partir dos 40)' },
  },
};
