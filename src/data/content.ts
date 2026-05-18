import type { Language, ContentResponse, SelfCheckGuide, Statistics } from '@/types/api';

// ════════════════════════════════════════════════════════════════════
//  Static educational content - trilingual, medically reviewed copy.
//  Mirrors the GET /content, /self-check-guide and /statistics shapes.
// ════════════════════════════════════════════════════════════════════

// ── Overview facts (Learn → Overview tab) ───────────────────────────
export interface OverviewFact {
  icon: string;
  stat: string;
  title: string;
  text: string;
}

export const overviewFacts: Record<Language, OverviewFact[]> = {
  ar: [
    { icon: '🎀', stat: '#1', title: 'الأكثر انتشاراً', text: 'سرطان الثدي هو السرطان الأكثر شيوعاً عند النساء فالعالم وفالمغرب.' },
    { icon: '💪', stat: '99٪', title: 'قابل للشفاء', text: 'ملي يتكتشف بكري، نسبة الشفاء كتوصل ل99٪. الكشف المبكر كينقذ الأرواح.' },
    { icon: '🧬', stat: '85٪', title: 'بلا تاريخ عائلي', text: '85٪ من النساء المصابات ماعندهمش تاريخ عائلي. الوقاية تخص الجميع.' },
    { icon: '👩', stat: '48', title: 'متوسط سن التشخيص', text: 'فالمغرب، متوسط سن التشخيص هو 48 عام - ولكن كيقدر يصيب فأي سن.' },
    { icon: '⏰', stat: '60٪', title: 'تشخيص متأخر', text: '60٪ من الحالات فالمغرب كيتشخّصو متأخر. الفحص المنتظم كيغيّر كولشي.' },
    { icon: '🩺', stat: '5 د', title: 'فحص بسيط', text: 'الفحص الذاتي كياخد 5 دقائق فالشهر فقط. عادة صغيرة، حماية كبيرة.' },
  ],
  fr: [
    { icon: '🎀', stat: '#1', title: 'Le plus fréquent', text: 'Le cancer du sein est le cancer le plus fréquent chez les femmes, au monde et au Maroc.' },
    { icon: '💪', stat: '99 %', title: 'Très traitable', text: 'Détecté tôt, le taux de survie atteint 99 %. La détection précoce sauve des vies.' },
    { icon: '🧬', stat: '85 %', title: 'Sans antécédent', text: '85 % des femmes touchées n’ont aucun antécédent familial. La prévention concerne toutes.' },
    { icon: '👩', stat: '48', title: 'Âge moyen', text: 'Au Maroc, l’âge moyen au diagnostic est de 48 ans - mais il peut survenir à tout âge.' },
    { icon: '⏰', stat: '60 %', title: 'Diagnostic tardif', text: '60 % des cas au Maroc sont diagnostiqués tardivement. Un suivi régulier change tout.' },
    { icon: '🩺', stat: '5 min', title: 'Un examen simple', text: 'L’auto-examen prend 5 minutes par mois. Une petite habitude, une grande protection.' },
  ],
  en: [
    { icon: '🎀', stat: '#1', title: 'Most common', text: 'Breast cancer is the most common cancer among women, worldwide and in Morocco.' },
    { icon: '💪', stat: '99%', title: 'Highly treatable', text: 'Found early, survival reaches 99%. Early detection saves lives.' },
    { icon: '🧬', stat: '85%', title: 'No family history', text: '85% of affected women have no family history. Prevention is for everyone.' },
    { icon: '👩', stat: '48', title: 'Average age', text: 'In Morocco the average age at diagnosis is 48 - but it can occur at any age.' },
    { icon: '⏰', stat: '60%', title: 'Late diagnosis', text: '60% of cases in Morocco are diagnosed late. Regular checks change everything.' },
    { icon: '🩺', stat: '5 min', title: 'A simple exam', text: 'A self-check takes 5 minutes a month. A small habit, a big protection.' },
  ],
};

// ── Symptoms content (mirrors GET /content/symptoms) ────────────────
export const symptomsContent: Record<Language, ContentResponse> = {
  ar: {
    topic: 'symptoms',
    title: 'الأعراض اللي خاصك تراقبيها',
    last_updated: '2026-05-18',
    content: {
      introduction:
        'سرطان الثدي عندو عدة علامات. مهم تعرفيهم باش تقدري تتصرفي بسرعة. أغلب التغييرات ماشي سرطان، ولكن كل تغيير جديد خاصو يتفحص.',
      call_to_action:
        'إذا لاحظتي أي واحدة من هاد الأعراض، ما تخافيش ولكن سيري عند الطبيب فأقرب وقت.',
      sections: [
        {
          title: 'علامات مرئية',
          icon: '👁️',
          items: [
            { symptom: 'كتلة أو تورّم فالثدي', description: 'أي كتلة جديدة فالثدي خاصها تتفحص عند الطبيب.', severity: 'high' },
            { symptom: 'تغيّر فشكل أو حجم الثدي', description: 'تغيّر مفاجئ فالحجم أو الشكل ديال واحد الثدي.', severity: 'high' },
          ],
        },
        {
          title: 'علامات جلدية',
          icon: '🔍',
          items: [
            { symptom: 'احمرار أو تقشّر الجلد', description: 'تغيّر فلون أو ملمس جلد الثدي.', severity: 'medium' },
            { symptom: 'تنقير الجلد (قشرة البرتقال)', description: 'الجلد كيولّي حافر بحال قشرة البرتقالة.', severity: 'high' },
          ],
        },
        {
          title: 'علامات الحلمة',
          icon: '⚠️',
          items: [
            { symptom: 'إفرازات غير عادية', description: 'إفرازات من الحلمة بلا عصر، خصوصاً إلا كان فيها دم.', severity: 'high' },
            { symptom: 'انكماش أو انقلاب الحلمة', description: 'الحلمة كتدخل للداخل بشكل جديد.', severity: 'high' },
          ],
        },
        {
          title: 'أحاسيس',
          icon: '🤚',
          items: [
            { symptom: 'كتلة تحت الإبط', description: 'تورّم أو كتلة فمنطقة الإبط.', severity: 'high' },
            { symptom: 'ألم مستمر فبلاصة وحدة', description: 'ألم ما كيمشيش، مركّز فنقطة وحدة.', severity: 'medium' },
          ],
        },
      ],
    },
  },
  fr: {
    topic: 'symptoms',
    title: 'Les signes à surveiller',
    last_updated: '2026-05-18',
    content: {
      introduction:
        'Le cancer du sein peut présenter plusieurs signes. Les connaître permet d’agir vite. La plupart des changements ne sont pas un cancer, mais chaque nouveau changement mérite un examen.',
      call_to_action:
        'Si vous remarquez l’un de ces signes, ne paniquez pas mais consultez un médecin au plus vite.',
      sections: [
        {
          title: 'Signes visibles',
          icon: '👁️',
          items: [
            { symptom: 'Masse ou gonflement', description: 'Toute nouvelle masse dans le sein doit être examinée par un médecin.', severity: 'high' },
            { symptom: 'Changement de forme ou de taille', description: 'Changement soudain de la forme ou du volume d’un sein.', severity: 'high' },
          ],
        },
        {
          title: 'Signes cutanés',
          icon: '🔍',
          items: [
            { symptom: 'Rougeur ou desquamation', description: 'Changement de couleur ou de texture de la peau du sein.', severity: 'medium' },
            { symptom: 'Peau capitonnée (peau d’orange)', description: 'La peau prend un aspect grumeleux, comme une peau d’orange.', severity: 'high' },
          ],
        },
        {
          title: 'Signes du mamelon',
          icon: '⚠️',
          items: [
            { symptom: 'Écoulement inhabituel', description: 'Écoulement spontané du mamelon, surtout s’il contient du sang.', severity: 'high' },
            { symptom: 'Rétraction du mamelon', description: 'Le mamelon se rétracte vers l’intérieur de façon nouvelle.', severity: 'high' },
          ],
        },
        {
          title: 'Sensations',
          icon: '🤚',
          items: [
            { symptom: 'Masse sous l’aisselle', description: 'Gonflement ou masse dans la zone de l’aisselle.', severity: 'high' },
            { symptom: 'Douleur persistante localisée', description: 'Une douleur qui ne passe pas, concentrée en un point.', severity: 'medium' },
          ],
        },
      ],
    },
  },
  en: {
    topic: 'symptoms',
    title: 'Signs to watch for',
    last_updated: '2026-05-18',
    content: {
      introduction:
        'Breast cancer can show several signs. Knowing them helps you act quickly. Most changes are not cancer, but every new change deserves a check.',
      call_to_action:
        'If you notice any of these signs, do not panic - but see a doctor as soon as possible.',
      sections: [
        {
          title: 'Visible signs',
          icon: '👁️',
          items: [
            { symptom: 'Lump or swelling', description: 'Any new lump in the breast should be examined by a doctor.', severity: 'high' },
            { symptom: 'Change in shape or size', description: 'A sudden change in the shape or volume of one breast.', severity: 'high' },
          ],
        },
        {
          title: 'Skin signs',
          icon: '🔍',
          items: [
            { symptom: 'Redness or flaking', description: 'A change in the colour or texture of the breast skin.', severity: 'medium' },
            { symptom: 'Dimpling (orange-peel skin)', description: 'The skin takes on a pitted look, like an orange peel.', severity: 'high' },
          ],
        },
        {
          title: 'Nipple signs',
          icon: '⚠️',
          items: [
            { symptom: 'Unusual discharge', description: 'Spontaneous discharge from the nipple, especially if bloody.', severity: 'high' },
            { symptom: 'Nipple retraction', description: 'The nipple newly turns or pulls inward.', severity: 'high' },
          ],
        },
        {
          title: 'Sensations',
          icon: '🤚',
          items: [
            { symptom: 'Lump under the arm', description: 'Swelling or a lump in the underarm area.', severity: 'high' },
            { symptom: 'Persistent localised pain', description: 'A pain that does not go away, concentrated in one spot.', severity: 'medium' },
          ],
        },
      ],
    },
  },
};

// ── Prevention checklist (Learn → Prevention tab) ───────────────────
export interface PreventionItem {
  id: string;
  icon: string;
  text: string;
}

export const preventionItems: Record<Language, PreventionItem[]> = {
  ar: [
    { id: 'self_exam', icon: '🩺', text: 'ندير الفحص الذاتي كل شهر' },
    { id: 'doctor', icon: '👩‍⚕️', text: 'نزور الطبيب مرة فالعام' },
    { id: 'exercise', icon: '🏃‍♀️', text: '30 دقيقة ديال الرياضة فاليوم' },
    { id: 'diet', icon: '🥗', text: 'ناكل بزّاف ديال الخضر والفواكه' },
    { id: 'weight', icon: '⚖️', text: 'نحافظ على وزن صحي' },
    { id: 'no_smoke', icon: '🚭', text: 'نتجنّب التدخين والكحول' },
    { id: 'breastfeed', icon: '🤱', text: 'الرضاعة الطبيعية إلا أمكن' },
    { id: 'sleep', icon: '😴', text: 'نوم كافٍ وتقليل التوتر' },
  ],
  fr: [
    { id: 'self_exam', icon: '🩺', text: 'Faire un auto-examen chaque mois' },
    { id: 'doctor', icon: '👩‍⚕️', text: 'Consulter un médecin une fois par an' },
    { id: 'exercise', icon: '🏃‍♀️', text: '30 minutes d’activité physique par jour' },
    { id: 'diet', icon: '??', text: 'Manger beaucoup de fruits et l?gumes' },
    { id: 'weight', icon: '??', text: 'Maintenir un poids sant?' },
    { id: 'no_smoke', icon: '??', text: '?viter le tabac et l?alcool' },
    { id: 'breastfeed', icon: '🤱', text: 'Allaiter si possible' },
    { id: 'sleep', icon: '??', text: 'Dormir suffisamment et r?duire le stress' },
  ],
  en: [
    { id: 'self_exam', icon: '🩺', text: 'Do a self-check every month' },
    { id: 'doctor', icon: '👩‍⚕️', text: 'See a doctor once a year' },
    { id: 'exercise', icon: '🏃‍♀️', text: '30 minutes of physical activity a day' },
    { id: 'diet', icon: '🥗', text: 'Eat plenty of fruit and vegetables' },
    { id: 'weight', icon: '⚖️', text: 'Maintain a healthy weight' },
    { id: 'no_smoke', icon: '🚭', text: 'Avoid tobacco and alcohol' },
    { id: 'breastfeed', icon: '🤱', text: 'Breastfeed when possible' },
    { id: 'sleep', icon: '😴', text: 'Sleep well and reduce stress' },
  ],
};

// ── Myths (Learn → Myths tab) ───────────────────────────────────────
export interface MythItem {
  id: string;
  myth: string;
  truth: string;
}

export const myths: Record<Language, MythItem[]> = {
  ar: [
    { id: 'm1', myth: 'سرطان الثدي كيصيب غير النساء الكبار فالسن.', truth: 'كيقدر يصيب فأي سن، حتى الشابات. التوعية ضرورية للجميع.' },
    { id: 'm2', myth: 'إلا ماعنديش تاريخ عائلي، راني فأمان كامل.', truth: '85٪ من الحالات ماعندهمش تاريخ عائلي. الفحص يخص الجميع.' },
    { id: 'm3', myth: 'أي كتلة فالثدي معناها سرطان.', truth: 'أغلب الكتل حميدة، ولكن خاصها ديما تتفحص عند الطبيب.' },
    { id: 'm4', myth: 'الفحص الذاتي كيعوّض زيارة الطبيب.', truth: 'الفحص الذاتي مكمّل ومهم، ولكن ماشي بديل عن الفحص الطبي.' },
    { id: 'm5', myth: 'الماموغرافيا كتسبب السرطان.', truth: 'جرعة الإشعاع ضعيفة جداً وآمنة، والفائدة فالكشف المبكر كبيرة بزّاف.' },
    { id: 'm6', myth: 'سرطان الثدي ديما مميت.', truth: 'مع الكشف المبكر، نسبة النجاة كتوصل ل99٪.' },
    { id: 'm7', myth: 'مزيل العرق كيسبب سرطان الثدي.', truth: 'ماكاينش أي دليل علمي كيربط مزيل العرق بسرطان الثدي.' },
    { id: 'm8', myth: 'الرضاعة الطبيعية ماعندها علاقة بالوقاية.', truth: 'الرضاعة الطبيعية كتنقص من خطر سرطان الثدي.' },
  ],
  fr: [
    { id: 'm1', myth: 'Le cancer du sein ne touche que les femmes ?g?es.', truth: 'Il peut survenir ? tout ?ge, m?me chez les jeunes femmes.' },
    { id: 'm2', myth: 'Sans ant?c?dent familial, je suis totalement ? l?abri.', truth: '85 % des cas n?ont aucun ant?c?dent familial. Le d?pistage concerne toutes.' },
    { id: 'm3', myth: 'Toute masse dans le sein est un cancer.', truth: 'La plupart des masses sont b?nignes, mais doivent toujours ?tre examin?es.' },
    { id: 'm4', myth: 'L?auto-examen remplace la visite chez le m?decin.', truth: 'L?auto-examen est compl?mentaire et important, mais ne remplace pas l?examen m?dical.' },
    { id: 'm5', myth: 'La mammographie provoque le cancer.', truth: 'La dose de rayonnement est tr?s faible et s?re ; le b?n?fice du d?pistage est majeur.' },
    { id: 'm6', myth: 'Le cancer du sein est toujours mortel.', truth: 'Avec un d?pistage pr?coce, le taux de survie atteint 99 %.' },
    { id: 'm7', myth: 'Le d?odorant cause le cancer du sein.', truth: 'Aucune preuve scientifique ne relie le d?odorant au cancer du sein.' },
    { id: 'm8', myth: 'L?allaitement n?a aucun lien avec la pr?vention.', truth: 'L?allaitement r?duit le risque de cancer du sein.' },
  ],
  en: [
    { id: 'm1', myth: 'Breast cancer only affects older women.', truth: 'It can occur at any age, including in young women.' },
    { id: 'm2', myth: 'With no family history, I am completely safe.', truth: '85% of cases have no family history. Screening is for everyone.' },
    { id: 'm3', myth: 'Any lump in the breast means cancer.', truth: 'Most lumps are benign, but should always be examined by a doctor.' },
    { id: 'm4', myth: 'A self-check replaces a doctor?s visit.', truth: 'A self-check is important and complementary, but not a substitute for a medical exam.' },
    { id: 'm5', myth: 'Mammograms cause cancer.', truth: 'The radiation dose is very low and safe; the screening benefit is major.' },
    { id: 'm6', myth: 'Breast cancer is always fatal.', truth: 'With early detection, the survival rate reaches 99%.' },
    { id: 'm7', myth: 'Deodorant causes breast cancer.', truth: 'No scientific evidence links deodorant to breast cancer.' },
    { id: 'm8', myth: 'Breastfeeding has nothing to do with prevention.', truth: 'Breastfeeding lowers the risk of breast cancer.' },
  ],
};

// ── Self-check guide (mirrors GET /self-check-guide) ────────────────
export const selfCheckGuide: Record<Language, SelfCheckGuide> = {
  ar: {
    title: 'دليل الفحص الذاتي',
    best_time: 'من 3 ل5 أيام بعد نهاية الدورة الشهرية',
    total_duration_minutes: 5,
    important_note: 'الفحص الذاتي ماشي بديل للفحص الطبي. إلا لاحظتي أي تغيير، ما تخافيش وسيري عند الطبيب.',
    disclaimer: 'هاد الدليل للتوعية فقط وماشي استشارة طبية.',
    steps: [
      {
        step_number: 1,
        title: 'المراقبة فالمرآة',
        icon: '🪞',
        duration_seconds: 60,
        instruction: 'وقفي قدّام المرآة، يديك على الوركين. شوفي إلا كاين شي تغيّر فالشكل، الحجم، أو لون الجلد.',
        what_to_look_for: ['تغيّر فالحجم أو الشكل', 'انتفاخ أو انكماش', 'تغيّر فلون الجلد'],
        image_url: '/assets/steps/step1.svg',
      },
      {
        step_number: 2,
        title: 'رفع اليدين',
        icon: '🙌',
        duration_seconds: 45,
        instruction: 'رفعي يديك فوق راسك وشوفي نفس التغييرات من زاوية جديدة.',
        what_to_look_for: ['انتفاخ', 'انكماش الحلمة', 'تغيّرات جلدية'],
        image_url: '/assets/steps/step2.svg',
      },
      {
        step_number: 3,
        title: 'الفحص واقفة',
        icon: '🤚',
        duration_seconds: 90,
        instruction: 'استعملي يدك اليمنى باش تفحصي الثدي الأيسر والعكس. حركي صبعانك فحركة دائرية بضغط خفيف ثم متوسط ثم قوي.',
        what_to_look_for: ['كتلة أو صلابة', 'ألم فنقطة معينة', 'تغيّر فالملمس'],
        image_url: '/assets/steps/step3.svg',
      },
      {
        step_number: 4,
        title: 'الفحص مستلقية',
        icon: '🛏️',
        duration_seconds: 90,
        instruction: 'استلقاي وحطّي وسادة تحت كتفك. كرّري نفس الحركات الدائرية على كل ثدي.',
        what_to_look_for: ['كتل فمناطق مختلفة', 'فرق بين الثديين'],
        image_url: '/assets/steps/step4.svg',
      },
      {
        step_number: 5,
        title: 'فحص الحلمة',
        icon: '⚠️',
        duration_seconds: 30,
        instruction: 'اعصري الحلمة بلطف وشوفي إلا كاين شي إفرازات غير عادية.',
        what_to_look_for: ['إفرازات غير عادية', 'دم', 'تغيّر فشكل الحلمة'],
        image_url: '/assets/steps/step5.svg',
      },
    ],
  },
  fr: {
    title: 'Guide d?auto-examen',
    best_time: '3 ? 5 jours apr?s la fin des r?gles',
    total_duration_minutes: 5,
    important_note: 'L?auto-examen ne remplace pas un examen m?dical. Si vous remarquez un changement, ne paniquez pas et consultez un m?decin.',
    disclaimer: 'Ce guide est ? but de sensibilisation uniquement, pas une consultation m?dicale.',
    steps: [
      {
        step_number: 1,
        title: 'Observer dans le miroir',
        icon: '🪞',
        duration_seconds: 60,
        instruction: 'Tenez-vous devant le miroir, mains sur les hanches. Cherchez tout changement de forme, de taille ou de couleur de la peau.',
        what_to_look_for: ['Changement de taille ou de forme', 'Gonflement ou r?traction', 'Changement de couleur de la peau'],
        image_url: '/assets/steps/step1.svg',
      },
      {
        step_number: 2,
        title: 'Lever les bras',
        icon: '🙌',
        duration_seconds: 45,
        instruction: 'Levez les bras au-dessus de la t?te et observez les m?mes changements sous un nouvel angle.',
        what_to_look_for: ['Gonflement', 'R?traction du mamelon', 'Changements cutan?s'],
        image_url: '/assets/steps/step2.svg',
      },
      {
        step_number: 3,
        title: 'Examen debout',
        icon: '🤚',
        duration_seconds: 90,
        instruction: 'Utilisez la main droite pour examiner le sein gauche, et inversement. Faites des mouvements circulaires, pression l?g?re puis moyenne puis ferme.',
        what_to_look_for: ['Masse ou induration', 'Douleur en un point pr?cis', 'Changement de texture'],
        image_url: '/assets/steps/step3.svg',
      },
      {
        step_number: 4,
        title: 'Examen allong?e',
        icon: '🛏️',
        duration_seconds: 90,
        instruction: 'Allongez-vous, un coussin sous l??paule. R?p?tez les m?mes mouvements circulaires sur chaque sein.',
        what_to_look_for: ['Masses dans diff?rentes zones', 'Diff?rence entre les deux seins'],
        image_url: '/assets/steps/step4.svg',
      },
      {
        step_number: 5,
        title: 'Examen du mamelon',
        icon: '⚠️',
        duration_seconds: 30,
        instruction: 'Pressez d?licatement le mamelon et v?rifiez l?absence d??coulement inhabituel.',
        what_to_look_for: ['?coulement inhabituel', 'Pr?sence de sang', 'Changement de forme du mamelon'],
        image_url: '/assets/steps/step5.svg',
      },
    ],
  },
  en: {
    title: 'Self-check guide',
    best_time: '3 to 5 days after your period ends',
    total_duration_minutes: 5,
    important_note: 'A self-check does not replace a medical exam. If you notice a change, do not panic and see a doctor.',
    disclaimer: 'This guide is for awareness only, not a medical consultation.',
    steps: [
      {
        step_number: 1,
        title: 'Look in the mirror',
        icon: '🪞',
        duration_seconds: 60,
        instruction: 'Stand in front of the mirror, hands on hips. Look for any change in shape, size or skin colour.',
        what_to_look_for: ['Change in size or shape', 'Swelling or puckering', 'Change in skin colour'],
        image_url: '/assets/steps/step1.svg',
      },
      {
        step_number: 2,
        title: 'Raise your arms',
        icon: '🙌',
        duration_seconds: 45,
        instruction: 'Raise your arms above your head and look for the same changes from a new angle.',
        what_to_look_for: ['Swelling', 'Nipple retraction', 'Skin changes'],
        image_url: '/assets/steps/step2.svg',
      },
      {
        step_number: 3,
        title: 'Examine standing',
        icon: '🤚',
        duration_seconds: 90,
        instruction: 'Use your right hand to examine the left breast and vice versa. Move your fingers in circles with light, then medium, then firm pressure.',
        what_to_look_for: ['Lump or hardness', 'Pain in a specific spot', 'Change in texture'],
        image_url: '/assets/steps/step3.svg',
      },
      {
        step_number: 4,
        title: 'Examine lying down',
        icon: '🛏️',
        duration_seconds: 90,
        instruction: 'Lie down with a pillow under your shoulder. Repeat the same circular movements on each breast.',
        what_to_look_for: ['Lumps in different areas', 'Difference between the two breasts'],
        image_url: '/assets/steps/step4.svg',
      },
      {
        step_number: 5,
        title: 'Check the nipple',
        icon: '⚠️',
        duration_seconds: 30,
        instruction: 'Gently squeeze the nipple and check for any unusual discharge.',
        what_to_look_for: ['Unusual discharge', 'Blood', 'Change in nipple shape'],
        image_url: '/assets/steps/step5.svg',
      },
    ],
  },
};

// ── Statistics (mirrors GET /statistics) ────────────────────────────
export const statistics: Record<Language, Statistics> = {
  ar: {
    global: { affected_ratio: '1 / 8', early_detection_survival: '99٪', most_common_cancer_women: true, new_cases_yearly: '2.3 مليون' },
    morocco: {
      new_cases_yearly: '~12,000',
      average_diagnosis_age: 48,
      late_diagnosis_percentage: 60,
      awareness_note: '60٪ من الحالات فالمغرب كيتشخّصو متأخر. الكشف المبكر كينقذ الأرواح.',
    },
    key_facts: [
      { stat: '85٪', description: 'من النساء المصابات ماعندهمش تاريخ عائلي' },
      { stat: '5 دقائق', description: 'هو الوقت اللي خاصو الفحص الذاتي فالشهر' },
      { stat: '99٪', description: 'نسبة النجاة مع الكشف المبكر' },
    ],
  },
  fr: {
    global: { affected_ratio: '1 / 8', early_detection_survival: '99 %', most_common_cancer_women: true, new_cases_yearly: '2,3 millions' },
    morocco: {
      new_cases_yearly: '~12 000',
      average_diagnosis_age: 48,
      late_diagnosis_percentage: 60,
      awareness_note: '60 % des cas au Maroc sont diagnostiqu?s tardivement. Le d?pistage pr?coce sauve des vies.',
    },
    key_facts: [
      { stat: '85 %', description: 'des femmes touch?es n?ont aucun ant?c?dent familial' },
      { stat: '5 min', description: 'c?est le temps qu?un auto-examen prend par mois' },
      { stat: '99 %', description: 'taux de survie avec un d?pistage pr?coce' },
    ],
  },
  en: {
    global: { affected_ratio: '1 / 8', early_detection_survival: '99%', most_common_cancer_women: true, new_cases_yearly: '2.3 million' },
    morocco: {
      new_cases_yearly: '~12,000',
      average_diagnosis_age: 48,
      late_diagnosis_percentage: 60,
      awareness_note: '60% of cases in Morocco are diagnosed late. Early screening saves lives.',
    },
    key_facts: [
      { stat: '85%', description: 'of affected women have no family history' },
      { stat: '5 min', description: 'is the time a self-check takes each month' },
      { stat: '99%', description: 'survival rate with early detection' },
    ],
  },
};
