import type { Language } from '@/types/api';
import type { RiskQuestion, RiskQuestionId } from '@/types/risk';

interface QuestionMeta {
  id: RiskQuestionId;
  icon: string;
  options: { value: string; weight: number }[];
}

const META: QuestionMeta[] = [
  { id: 'age', icon: 'age', options: [{ value: 'under_30', weight: 0 }, { value: '30-39', weight: 1 }, { value: '40-49', weight: 2 }, { value: '50_plus', weight: 3 }] },
  { id: 'family_history', icon: 'family', options: [{ value: 'none', weight: 0 }, { value: 'distant', weight: 1 }, { value: 'mother_or_sister', weight: 3 }] },
  { id: 'exercise', icon: 'move', options: [{ value: 'daily', weight: 0 }, { value: 'sometimes', weight: 1 }, { value: 'rarely', weight: 2 }] },
  { id: 'smoking_alcohol', icon: 'habit', options: [{ value: 'never', weight: 0 }, { value: 'sometimes', weight: 1 }, { value: 'regularly', weight: 2 }] },
  { id: 'self_exam', icon: 'check', options: [{ value: 'monthly', weight: 0 }, { value: 'sometimes', weight: 1 }, { value: 'never', weight: 2 }] },
  { id: 'overweight', icon: 'weight', options: [{ value: 'no', weight: 0 }, { value: 'slightly', weight: 1 }, { value: 'yes', weight: 2 }] },
  { id: 'breastfeeding', icon: 'care', options: [{ value: 'yes', weight: 0 }, { value: 'no', weight: 1 }, { value: 'no_children', weight: 0 }] },
  { id: 'first_period_age', icon: 'cycle', options: [{ value: 'before_12', weight: 1 }, { value: '12_or_after', weight: 0 }] },
  { id: 'hormone_therapy', icon: 'medical', options: [{ value: 'yes', weight: 1 }, { value: 'no', weight: 0 }] },
  { id: 'first_pregnancy_age', icon: 'mother', options: [{ value: 'before_30', weight: 0 }, { value: 'after_30', weight: 1 }, { value: 'no_pregnancy', weight: 1 }] },
];

export const MAX_RISK_SCORE = META.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.weight)), 0);

interface QuestionText {
  question: string;
  hint?: string;
  options: Record<string, string>;
}

const TEXT: Record<Language, Record<RiskQuestionId, QuestionText>> = {
  ar: {
    age: { question: 'شحال عندك من العمر؟', hint: 'الخطر كيزيد مع السن', options: { under_30: 'أقل من 30', '30-39': 'من 30 حتى 39', '40-49': 'من 40 حتى 49', '50_plus': '50 أو أكثر' } },
    family_history: { question: 'واش كاين سرطان الثدي فالعائلة؟', hint: 'الأم، الأخت أو البنت', options: { none: 'لا', distant: 'قريبة بعيدة', mother_or_sister: 'الأم أو الأخت' } },
    exercise: { question: 'شحال كتمارسي الرياضة؟', options: { daily: 'تقريبا كل نهار', sometimes: 'مرات فالسيمانة', rarely: 'نادرا' } },
    smoking_alcohol: { question: 'واش كتدخني أو كتشربي الكحول؟', options: { never: 'أبدا', sometimes: 'أحيانا', regularly: 'بانتظام' } },
    self_exam: { question: 'شحال كتديري الفحص الذاتي؟', options: { monthly: 'كل شهر', sometimes: 'من وقت لآخر', never: 'عمري درتو' } },
    overweight: { question: 'كيفاش كتشوفي وزنك؟', options: { no: 'وزن صحي', slightly: 'شوية زايد', yes: 'وزن زائد' } },
    breastfeeding: { question: 'واش رضعتي رضاعة طبيعية؟', options: { yes: 'أه', no: 'لا', no_children: 'ماعنديش ولاد' } },
    first_period_age: { question: 'فاش جاتك أول دورة؟', options: { before_12: 'قبل 12 عام', '12_or_after': '12 عام أو أكثر' } },
    hormone_therapy: { question: 'واش كتستعملي علاج هرموني؟', hint: 'بحال منع الحمل أو علاج سن اليأس', options: { yes: 'أه', no: 'لا' } },
    first_pregnancy_age: { question: 'فاش كان أول حمل؟', options: { before_30: 'قبل 30 عام', after_30: 'بعد 30 عام', no_pregnancy: 'ماكانش حمل' } },
  },
  fr: {
    age: { question: 'Quel age avez-vous ?', hint: 'Le risque augmente avec l age', options: { under_30: 'Moins de 30', '30-39': '30 a 39', '40-49': '40 a 49', '50_plus': '50 ou plus' } },
    family_history: { question: 'Cancer du sein dans la famille ?', hint: 'Mere, soeur ou fille', options: { none: 'Non', distant: 'Parente eloignee', mother_or_sister: 'Mere ou soeur' } },
    exercise: { question: 'A quelle frequence bougez-vous ?', options: { daily: 'Presque chaque jour', sometimes: 'Quelques fois par semaine', rarely: 'Rarement' } },
    smoking_alcohol: { question: 'Tabac ou alcool ?', options: { never: 'Jamais', sometimes: 'Parfois', regularly: 'Regulierement' } },
    self_exam: { question: 'Auto-examen ?', options: { monthly: 'Chaque mois', sometimes: 'Parfois', never: 'Jamais' } },
    overweight: { question: 'Votre poids ?', options: { no: 'Poids sante', slightly: 'Un peu en surpoids', yes: 'Surpoids' } },
    breastfeeding: { question: 'Avez-vous allaite ?', options: { yes: 'Oui', no: 'Non', no_children: 'Pas d enfants' } },
    first_period_age: { question: 'Age des premieres regles ?', options: { before_12: 'Avant 12', '12_or_after': '12 ou plus' } },
    hormone_therapy: { question: 'Traitement hormonal ?', hint: 'Pilule ou menopause', options: { yes: 'Oui', no: 'Non' } },
    first_pregnancy_age: { question: 'Age de la premiere grossesse ?', options: { before_30: 'Avant 30', after_30: 'Apres 30', no_pregnancy: 'Pas de grossesse' } },
  },
  en: {
    age: { question: 'What is your age?', hint: 'Risk rises with age', options: { under_30: 'Under 30', '30-39': '30 to 39', '40-49': '40 to 49', '50_plus': '50 or over' } },
    family_history: { question: 'Any family history of breast cancer?', hint: 'Mother, sister or daughter', options: { none: 'No', distant: 'Distant relative', mother_or_sister: 'Mother or sister' } },
    exercise: { question: 'How often do you exercise?', options: { daily: 'Almost daily', sometimes: 'A few times a week', rarely: 'Rarely' } },
    smoking_alcohol: { question: 'Do you smoke or drink alcohol?', options: { never: 'Never', sometimes: 'Sometimes', regularly: 'Regularly' } },
    self_exam: { question: 'How often do you self-check?', options: { monthly: 'Monthly', sometimes: 'Sometimes', never: 'Never' } },
    overweight: { question: 'How would you describe your weight?', options: { no: 'Healthy weight', slightly: 'Slightly overweight', yes: 'Overweight' } },
    breastfeeding: { question: 'Have you breastfed?', options: { yes: 'Yes', no: 'No', no_children: 'No children' } },
    first_period_age: { question: 'When did your periods start?', options: { before_12: 'Before 12', '12_or_after': '12 or later' } },
    hormone_therapy: { question: 'Are you using hormone therapy?', hint: 'Contraception or menopause treatment', options: { yes: 'Yes', no: 'No' } },
    first_pregnancy_age: { question: 'Age at first pregnancy?', options: { before_30: 'Before 30', after_30: 'After 30', no_pregnancy: 'No pregnancy' } },
  },
};

export function getRiskQuestions(lang: Language): RiskQuestion[] {
  return META.map((meta) => {
    const text = TEXT[lang][meta.id];
    return {
      id: meta.id,
      icon: meta.icon,
      question: text.question,
      hint: text.hint,
      options: meta.options.map((option) => ({
        value: option.value,
        weight: option.weight,
        label: text.options[option.value],
      })),
    };
  });
}
