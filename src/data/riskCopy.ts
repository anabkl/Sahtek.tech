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
};

export const RISK_DISCLAIMER: Record<Language, string> = {
  ar: '⚕️ هاد التقييم للتوعية فقط وماشي تشخيص طبي. استشيري طبيبك ديما.',
  fr: '⚕️ Cette évaluation est à but de sensibilisation uniquement, pas un diagnostic. Consultez toujours votre médecin.',
  en: '⚕️ This assessment is for awareness only, not a diagnosis. Always consult your doctor.',
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
};
