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
  es: {
    age: { question: '¿Qué edad tienes?', hint: 'El riesgo aumenta con la edad', options: { under_30: 'Menos de 30', '30-39': '30 a 39', '40-49': '40 a 49', '50_plus': '50 o más' } },
    family_history: { question: '¿Antecedentes familiares de cáncer de mama?', hint: 'Madre, hermana o hija', options: { none: 'No', distant: 'Pariente lejano', mother_or_sister: 'Madre o hermana' } },
    exercise: { question: '¿Con qué frecuencia haces ejercicio?', options: { daily: 'Casi a diario', sometimes: 'Algunas veces por semana', rarely: 'Rara vez' } },
    smoking_alcohol: { question: '¿Tabaco o alcohol?', options: { never: 'Nunca', sometimes: 'A veces', regularly: 'Con regularidad' } },
    self_exam: { question: '¿Con qué frecuencia te autoexaminas?', options: { monthly: 'Cada mes', sometimes: 'A veces', never: 'Nunca' } },
    overweight: { question: '¿Cómo describirías tu peso?', options: { no: 'Peso saludable', slightly: 'Algo de sobrepeso', yes: 'Sobrepeso' } },
    breastfeeding: { question: '¿Has dado el pecho?', options: { yes: 'Sí', no: 'No', no_children: 'Sin hijos' } },
    first_period_age: { question: '¿Cuándo empezaron tus reglas?', options: { before_12: 'Antes de los 12', '12_or_after': '12 o después' } },
    hormone_therapy: { question: '¿Usas terapia hormonal?', hint: 'Anticoncepción o tratamiento de la menopausia', options: { yes: 'Sí', no: 'No' } },
    first_pregnancy_age: { question: '¿Edad en el primer embarazo?', options: { before_30: 'Antes de los 30', after_30: 'Después de los 30', no_pregnancy: 'Sin embarazo' } },
  },
  ru: {
    age: { question: 'Сколько вам лет?', hint: 'Риск растёт с возрастом', options: { under_30: 'До 30', '30-39': 'От 30 до 39', '40-49': 'От 40 до 49', '50_plus': '50 или больше' } },
    family_history: { question: 'Есть ли рак груди в семье?', hint: 'Мать, сестра или дочь', options: { none: 'Нет', distant: 'Дальняя родственница', mother_or_sister: 'Мать или сестра' } },
    exercise: { question: 'Как часто вы занимаетесь спортом?', options: { daily: 'Почти каждый день', sometimes: 'Несколько раз в неделю', rarely: 'Редко' } },
    smoking_alcohol: { question: 'Курите или пьёте алкоголь?', options: { never: 'Никогда', sometimes: 'Иногда', regularly: 'Регулярно' } },
    self_exam: { question: 'Как часто вы делаете самообследование?', options: { monthly: 'Каждый месяц', sometimes: 'Иногда', never: 'Никогда' } },
    overweight: { question: 'Как вы описали бы свой вес?', options: { no: 'Здоровый вес', slightly: 'Небольшой лишний вес', yes: 'Лишний вес' } },
    breastfeeding: { question: 'Вы кормили грудью?', options: { yes: 'Да', no: 'Нет', no_children: 'Нет детей' } },
    first_period_age: { question: 'Когда начались месячные?', options: { before_12: 'До 12', '12_or_after': '12 или позже' } },
    hormone_therapy: { question: 'Вы применяете гормональную терапию?', hint: 'Контрацепция или лечение менопаузы', options: { yes: 'Да', no: 'Нет' } },
    first_pregnancy_age: { question: 'Возраст при первой беременности?', options: { before_30: 'До 30', after_30: 'После 30', no_pregnancy: 'Беременности не было' } },
  },
  pt: {
    age: { question: 'Qual é a sua idade?', hint: 'O risco aumenta com a idade', options: { under_30: 'Menos de 30', '30-39': '30 a 39', '40-49': '40 a 49', '50_plus': '50 ou mais' } },
    family_history: { question: 'Histórico familiar de câncer de mama?', hint: 'Mãe, irmã ou filha', options: { none: 'Não', distant: 'Parente distante', mother_or_sister: 'Mãe ou irmã' } },
    exercise: { question: 'Com que frequência você se exercita?', options: { daily: 'Quase todo dia', sometimes: 'Algumas vezes por semana', rarely: 'Raramente' } },
    smoking_alcohol: { question: 'Você fuma ou bebe álcool?', options: { never: 'Nunca', sometimes: 'Às vezes', regularly: 'Regularmente' } },
    self_exam: { question: 'Com que frequência faz o autoexame?', options: { monthly: 'Todo mês', sometimes: 'Às vezes', never: 'Nunca' } },
    overweight: { question: 'Como você descreveria seu peso?', options: { no: 'Peso saudável', slightly: 'Um pouco acima do peso', yes: 'Acima do peso' } },
    breastfeeding: { question: 'Você amamentou?', options: { yes: 'Sim', no: 'Não', no_children: 'Sem filhos' } },
    first_period_age: { question: 'Quando começou a menstruar?', options: { before_12: 'Antes dos 12', '12_or_after': '12 ou depois' } },
    hormone_therapy: { question: 'Você usa terapia hormonal?', hint: 'Contracepção ou tratamento da menopausa', options: { yes: 'Sim', no: 'Não' } },
    first_pregnancy_age: { question: 'Idade na primeira gravidez?', options: { before_30: 'Antes dos 30', after_30: 'Depois dos 30', no_pregnancy: 'Sem gravidez' } },
  },
  de: {
    age: { question: 'Wie alt bist du?', hint: 'Das Risiko steigt mit dem Alter', options: { under_30: 'Unter 30', '30-39': '30 bis 39', '40-49': '40 bis 49', '50_plus': '50 oder älter' } },
    family_history: { question: 'Brustkrebs in der Familie?', hint: 'Mutter, Schwester oder Tochter', options: { none: 'Nein', distant: 'Entfernte Verwandte', mother_or_sister: 'Mutter oder Schwester' } },
    exercise: { question: 'Wie oft bewegst du dich?', options: { daily: 'Fast täglich', sometimes: 'Ein paar Mal pro Woche', rarely: 'Selten' } },
    smoking_alcohol: { question: 'Tabak oder Alkohol?', options: { never: 'Nie', sometimes: 'Manchmal', regularly: 'Regelmäßig' } },
    self_exam: { question: 'Wie oft untersuchst du dich selbst?', options: { monthly: 'Monatlich', sometimes: 'Manchmal', never: 'Nie' } },
    overweight: { question: 'Wie würdest du dein Gewicht beschreiben?', options: { no: 'Gesundes Gewicht', slightly: 'Leicht übergewichtig', yes: 'Übergewichtig' } },
    breastfeeding: { question: 'Hast du gestillt?', options: { yes: 'Ja', no: 'Nein', no_children: 'Keine Kinder' } },
    first_period_age: { question: 'Wann begann deine Periode?', options: { before_12: 'Vor 12', '12_or_after': '12 oder später' } },
    hormone_therapy: { question: 'Nimmst du eine Hormontherapie?', hint: 'Verhütung oder Wechseljahrs-Behandlung', options: { yes: 'Ja', no: 'Nein' } },
    first_pregnancy_age: { question: 'Alter bei der ersten Schwangerschaft?', options: { before_30: 'Vor 30', after_30: 'Nach 30', no_pregnancy: 'Keine Schwangerschaft' } },
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
