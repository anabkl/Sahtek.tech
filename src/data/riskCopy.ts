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

/**
 * The result summary.
 *
 * NEVER a verdict on her body. These sentences used to read "Your risk is low.
 * You are taking good care of yourself" — a conclusion about her chance of
 * disease, drawn from ten questions, and the most dangerous sentence in the
 * product: a woman who later finds a lump and remembers being told her risk was
 * low may wait. HARD RULE 1 forbids exactly this.
 *
 * Every branch now describes the FACTORS SHE TICKED, never her risk of cancer.
 * The `low` branch carries the line that makes it safe to read — most women who
 * are diagnosed had no clear risk factor — so a low count can never be heard as
 * permission to ignore a change. "Do not panic" is gone from `high`: it is a
 * phrase that plants the panic it denies.
 */
export const RISK_SUMMARY: Record<Language, Record<RiskLevel, string>> = {
  ar: {
    low:
      'قليل من العوامل اللي سولناك عليهم كينطبقو عليك. هادشي ماشي ضمانة: أغلب النساء اللي تشخصو ما كان عندهم حتى عامل خطر واضح. كملي الفحص الذاتي كل شهر، وإلا لاحظتي شي تغيير جديد سيري للطبيب — مهما كانت هاد النتيجة.',
    moderate:
      'شي عوامل من اللي سولناك عليهم كينطبقو عليك. العوامل ماشي توقّع، غير حوايج كتستاهل نقاش. هضري عليهم مع طبيب فأول موعد، وكملي الفحص الذاتي.',
    high:
      'بزاف من العوامل اللي سولناك عليهم كينطبقو عليك. هادشي ما كيعنيش أنك غادي تمرضي — كيعني غير أن نقاش مع طبيب على المتابعة يستاهل. حجزي موعد باش تهضري معاه.',
  },
  fr: {
    low:
      'Peu des facteurs sur lesquels nous vous avons interrogée s’appliquent à vous. Ce n’est pas une garantie : la plupart des femmes diagnostiquées n’avaient aucun facteur de risque évident. Gardez l’auto-examen mensuel et, si vous remarquez un changement nouveau, consultez — quel que soit ce résultat.',
    moderate:
      'Certains des facteurs s’appliquent à vous. Un facteur n’est pas une prédiction, c’est un sujet de conversation. Parlez-en à un médecin lors de votre prochain rendez-vous et gardez l’auto-examen.',
    high:
      'Plusieurs des facteurs s’appliquent à vous. Cela ne signifie pas que vous développerez un cancer : cela signifie qu’une conversation avec un médecin sur votre suivi en vaut la peine. Prenez rendez-vous pour en parler.',
  },
  en: {
    low:
      'Few of the factors we asked about apply to you. That is not a guarantee: most women who are diagnosed had no clear risk factor at all. Keep the monthly self-check, and if you notice a new change, see a doctor — whatever this result says.',
    moderate:
      'Some of the factors we asked about apply to you. A factor is not a prediction; it is something worth discussing. Raise them with a doctor at your next appointment, and keep the self-check.',
    high:
      'Several of the factors we asked about apply to you. This does not mean you will develop breast cancer. It means a conversation with a doctor about follow-up is worth having. Book an appointment to talk it through.',
  },
  es: {
    low:
      'Pocos de los factores por los que preguntamos se aplican a ti. No es una garantía: la mayoría de las mujeres diagnosticadas no tenía ningún factor de riesgo claro. Mantén el autoexamen mensual y, si notas un cambio nuevo, consulta — diga lo que diga este resultado.',
    moderate:
      'Algunos de los factores se aplican a ti. Un factor no es una predicción; es algo que conviene comentar. Háblalo con un médico en tu próxima cita y mantén el autoexamen.',
    high:
      'Varios de los factores se aplican a ti. Esto no significa que vayas a desarrollar cáncer de mama. Significa que vale la pena hablar del seguimiento con un médico. Pide una cita para comentarlo.',
  },
  de: {
    low:
      'Nur wenige der abgefragten Faktoren treffen auf dich zu. Das ist keine Garantie: Die meisten diagnostizierten Frauen hatten überhaupt keinen klaren Risikofaktor. Behalte die monatliche Selbstuntersuchung bei, und wenn dir etwas Neues auffällt, geh zur Ärztin — unabhängig von diesem Ergebnis.',
    moderate:
      'Einige der abgefragten Faktoren treffen auf dich zu. Ein Faktor ist keine Vorhersage, sondern ein Gesprächsthema. Sprich sie beim nächsten Termin an und behalte die Selbstuntersuchung bei.',
    high:
      'Mehrere der abgefragten Faktoren treffen auf dich zu. Das heißt nicht, dass du erkranken wirst. Es heißt, dass ein Gespräch mit einer Ärztin über die Nachsorge sich lohnt. Vereinbare einen Termin dafür.',
  },
  ru: {
    low:
      'Немногие из факторов, о которых мы спрашивали, относятся к вам. Это не гарантия: у большинства заболевших женщин не было ни одного явного фактора риска. Сохраняйте ежемесячное самообследование, а если заметите новое изменение — обратитесь к врачу, независимо от этого результата.',
    moderate:
      'Некоторые из факторов относятся к вам. Фактор — это не предсказание, а повод для разговора. Обсудите их с врачом на ближайшем приёме и продолжайте самообследование.',
    high:
      'Несколько факторов относятся к вам. Это не значит, что вы заболеете. Это значит, что разговор с врачом о наблюдении имеет смысл. Запишитесь, чтобы обсудить это.',
  },
  pt: {
    low:
      'Poucos dos fatores sobre os quais perguntamos se aplicam a você. Isso não é garantia: a maioria das mulheres diagnosticadas não tinha nenhum fator de risco claro. Mantenha o autoexame mensal e, se notar uma mudança nova, procure um médico — independentemente deste resultado.',
    moderate:
      'Alguns dos fatores se aplicam a você. Um fator não é uma previsão; é algo que vale a pena conversar. Comente com um médico na próxima consulta e mantenha o autoexame.',
    high:
      'Vários dos fatores se aplicam a você. Isso não significa que você vai desenvolver câncer de mama. Significa que vale a pena conversar com um médico sobre acompanhamento. Marque uma consulta para falar disso.',
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
