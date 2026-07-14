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
  es: [
    { icon: '🎀', stat: '#1', title: 'El más frecuente', text: 'El cáncer de mama es el cáncer más común entre las mujeres, en el mundo y en Marruecos.' },
    { icon: '💪', stat: '99%', title: 'Muy tratable', text: 'Detectado a tiempo, la tasa de supervivencia llega al 99%. La detección temprana salva vidas.' },
    { icon: '🧬', stat: '85%', title: 'Sin antecedentes', text: 'El 85% de las mujeres afectadas no tienen antecedentes familiares. La prevención es para todas.' },
    { icon: '👩', stat: '48', title: 'Edad media', text: 'En Marruecos la edad media de diagnóstico es de 48 años, pero puede ocurrir a cualquier edad.' },
    { icon: '⏰', stat: '60%', title: 'Diagnóstico tardío', text: 'El 60% de los casos en Marruecos se diagnostican tarde. Un seguimiento regular lo cambia todo.' },
    { icon: '🩺', stat: '5 min', title: 'Un examen sencillo', text: 'Un autoexamen lleva 5 minutos al mes. Un pequeño hábito, una gran protección.' },
  ],
  de: [
    { icon: '🎀', stat: '#1', title: 'Am häufigsten', text: 'Brustkrebs ist die häufigste Krebsart bei Frauen, weltweit und in Marokko.' },
    { icon: '💪', stat: '99%', title: 'Gut behandelbar', text: 'Früh erkannt erreicht die Überlebensrate 99%. Früherkennung rettet Leben.' },
    { icon: '🧬', stat: '85%', title: 'Keine Familiengeschichte', text: '85% der betroffenen Frauen haben keine Familiengeschichte. Vorbeugung ist für alle da.' },
    { icon: '👩', stat: '48', title: 'Durchschnittsalter', text: 'In Marokko liegt das durchschnittliche Diagnosealter bei 48 Jahren, doch er kann in jedem Alter auftreten.' },
    { icon: '⏰', stat: '60%', title: 'Späte Diagnose', text: '60% der Fälle in Marokko werden spät diagnostiziert. Regelmäßige Kontrollen verändern alles.' },
    { icon: '🩺', stat: '5 Min', title: 'Eine einfache Untersuchung', text: 'Eine Selbstuntersuchung dauert 5 Minuten im Monat. Eine kleine Gewohnheit, ein großer Schutz.' },
  ],
  ru: [
    { icon: '🎀', stat: '#1', title: 'Самый частый', text: 'Рак груди — самый частый рак среди женщин в мире и в Марокко.' },
    { icon: '💪', stat: '99%', title: 'Хорошо лечится', text: 'При раннем выявлении выживаемость достигает 99%. Раннее выявление спасает жизни.' },
    { icon: '🧬', stat: '85%', title: 'Без семейной истории', text: '85% заболевших женщин не имеют семейной истории. Профилактика нужна всем.' },
    { icon: '👩', stat: '48', title: 'Средний возраст', text: 'В Марокко средний возраст диагноза — 48 лет, но он может возникнуть в любом возрасте.' },
    { icon: '⏰', stat: '60%', title: 'Поздний диагноз', text: '60% случаев в Марокко диагностируются поздно. Регулярные проверки меняют всё.' },
    { icon: '🩺', stat: '5 мин', title: 'Простой осмотр', text: 'Самообследование занимает 5 минут в месяц. Маленькая привычка, большая защита.' },
  ],
  pt: [
    { icon: '🎀', stat: '#1', title: 'O mais frequente', text: 'O câncer de mama é o câncer mais comum entre as mulheres, no mundo e em Marrocos.' },
    { icon: '💪', stat: '99%', title: 'Muito tratável', text: 'Detectado cedo, a taxa de sobrevivência chega a 99%. A detecção precoce salva vidas.' },
    { icon: '🧬', stat: '85%', title: 'Sem histórico', text: '85% das mulheres afetadas não têm histórico familiar. A prevenção é para todas.' },
    { icon: '👩', stat: '48', title: 'Idade média', text: 'Em Marrocos a idade média de diagnóstico é 48 anos, mas pode ocorrer em qualquer idade.' },
    { icon: '⏰', stat: '60%', title: 'Diagnóstico tardio', text: '60% dos casos em Marrocos são diagnosticados tarde. O acompanhamento regular muda tudo.' },
    { icon: '🩺', stat: '5 min', title: 'Um exame simples', text: 'Um autoexame leva 5 minutos por mês. Um pequeno hábito, uma grande proteção.' },
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
        'إلا لاحظتي شي وحدة من هاد العلامات، حجزي موعد مع طبيب فأقرب وقت. أغلب التغييرات ماشي سرطان، والطبيب هو أسرع طريقة باش تعرفي.',
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
        'Si vous remarquez l’un de ces signes, prenez rendez-vous rapidement. La plupart des changements ne sont pas un cancer, et un médecin est le moyen le plus rapide de le savoir.',
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
        'If you notice any of these signs, book an appointment soon. Most changes are not cancer, and a doctor is the fastest way to know.',
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
  es: {
    topic: 'symptoms',
    title: 'Las señales a vigilar',
    last_updated: '2026-05-18',
    content: {
      introduction:
        'El cáncer de mama puede presentar varias señales. Conocerlas permite actuar rápido. La mayoría de los cambios no son cáncer, pero todo cambio nuevo merece un examen.',
      call_to_action:
        'Si notas alguna de estas señales, pide cita pronto y consulta a un médico lo antes posible.',
      sections: [
        {
          title: 'Señales visibles',
          icon: '👁️',
          items: [
            { symptom: 'Bulto o hinchazón', description: 'Todo bulto nuevo en la mama debe ser examinado por un médico.', severity: 'high' },
            { symptom: 'Cambio de forma o tamaño', description: 'Un cambio repentino en la forma o el volumen de una mama.', severity: 'high' },
          ],
        },
        {
          title: 'Señales cutáneas',
          icon: '🔍',
          items: [
            { symptom: 'Enrojecimiento o descamación', description: 'Un cambio en el color o la textura de la piel de la mama.', severity: 'medium' },
            { symptom: 'Piel con hoyuelos (piel de naranja)', description: 'La piel adquiere un aspecto rugoso, como una piel de naranja.', severity: 'high' },
          ],
        },
        {
          title: 'Señales del pezón',
          icon: '⚠️',
          items: [
            { symptom: 'Secreción inusual', description: 'Secreción espontánea del pezón, sobre todo si contiene sangre.', severity: 'high' },
            { symptom: 'Retracción del pezón', description: 'El pezón se retrae hacia dentro de forma nueva.', severity: 'high' },
          ],
        },
        {
          title: 'Sensaciones',
          icon: '🤚',
          items: [
            { symptom: 'Bulto bajo el brazo', description: 'Hinchazón o bulto en la zona de la axila.', severity: 'high' },
            { symptom: 'Dolor localizado persistente', description: 'Un dolor que no desaparece, concentrado en un punto.', severity: 'medium' },
          ],
        },
      ],
    },
  },
  de: {
    topic: 'symptoms',
    title: 'Die Anzeichen, auf die zu achten ist',
    last_updated: '2026-05-18',
    content: {
      introduction:
        'Brustkrebs kann mehrere Anzeichen zeigen. Sie zu kennen hilft, schnell zu handeln. Die meisten Veränderungen sind kein Krebs, aber jede neue Veränderung verdient eine Untersuchung.',
      call_to_action:
        'Wenn dir eines dieser Anzeichen auffällt, vereinbare bald einen Termin. Die meisten Veränderungen sind kein Krebs, und eine Ärztin ist der schnellste Weg, es zu wissen.',
      sections: [
        {
          title: 'Sichtbare Anzeichen',
          icon: '👁️',
          items: [
            { symptom: 'Knoten oder Schwellung', description: 'Jeder neue Knoten in der Brust sollte von einer Ärztin untersucht werden.', severity: 'high' },
            { symptom: 'Veränderung von Form oder Größe', description: 'Eine plötzliche Veränderung der Form oder des Volumens einer Brust.', severity: 'high' },
          ],
        },
        {
          title: 'Hautanzeichen',
          icon: '🔍',
          items: [
            { symptom: 'Rötung oder Schuppung', description: 'Eine Veränderung der Farbe oder Textur der Brusthaut.', severity: 'medium' },
            { symptom: 'Grübchenhaut (Orangenhaut)', description: 'Die Haut nimmt ein narbiges Aussehen an, wie eine Orangenschale.', severity: 'high' },
          ],
        },
        {
          title: 'Anzeichen an der Brustwarze',
          icon: '⚠️',
          items: [
            { symptom: 'Ungewöhnlicher Austritt', description: 'Spontaner Austritt aus der Brustwarze, besonders wenn er Blut enthält.', severity: 'high' },
            { symptom: 'Einziehung der Brustwarze', description: 'Die Brustwarze zieht sich neu nach innen.', severity: 'high' },
          ],
        },
        {
          title: 'Empfindungen',
          icon: '🤚',
          items: [
            { symptom: 'Knoten unter dem Arm', description: 'Schwellung oder Knoten im Bereich der Achsel.', severity: 'high' },
            { symptom: 'Anhaltender lokaler Schmerz', description: 'Ein Schmerz, der nicht verschwindet und auf einen Punkt konzentriert ist.', severity: 'medium' },
          ],
        },
      ],
    },
  },
  ru: {
    topic: 'symptoms',
    title: 'Признаки, на которые стоит обратить внимание',
    last_updated: '2026-05-18',
    content: {
      introduction:
        'Рак груди может проявляться несколькими признаками. Знание их помогает действовать быстро. Большинство изменений — не рак, но каждое новое изменение заслуживает осмотра.',
      call_to_action:
        'Если вы заметили любой из этих признаков, как можно скорее обратитесь к врачу.',
      sections: [
        {
          title: 'Видимые признаки',
          icon: '👁️',
          items: [
            { symptom: 'Уплотнение или припухлость', description: 'Любое новое уплотнение в груди должен осмотреть врач.', severity: 'high' },
            { symptom: 'Изменение формы или размера', description: 'Внезапное изменение формы или объёма одной груди.', severity: 'high' },
          ],
        },
        {
          title: 'Кожные признаки',
          icon: '🔍',
          items: [
            { symptom: 'Покраснение или шелушение', description: 'Изменение цвета или текстуры кожи груди.', severity: 'medium' },
            { symptom: 'Втяжения (апельсиновая корка)', description: 'Кожа приобретает бугристый вид, как апельсиновая корка.', severity: 'high' },
          ],
        },
        {
          title: 'Признаки соска',
          icon: '⚠️',
          items: [
            { symptom: 'Необычные выделения', description: 'Самопроизвольные выделения из соска, особенно с кровью.', severity: 'high' },
            { symptom: 'Втяжение соска', description: 'Сосок по-новому втягивается внутрь.', severity: 'high' },
          ],
        },
        {
          title: 'Ощущения',
          icon: '🤚',
          items: [
            { symptom: 'Уплотнение под рукой', description: 'Припухлость или уплотнение в области подмышки.', severity: 'high' },
            { symptom: 'Стойкая локальная боль', description: 'Боль, которая не проходит, сосредоточенная в одной точке.', severity: 'medium' },
          ],
        },
      ],
    },
  },
  pt: {
    topic: 'symptoms',
    title: 'Os sinais a observar',
    last_updated: '2026-05-18',
    content: {
      introduction:
        'O câncer de mama pode apresentar vários sinais. Conhecê-los permite agir rápido. A maioria das mudanças não é câncer, mas toda mudança nova merece um exame.',
      call_to_action:
        'Se você notar algum desses sinais, procure um médico o quanto antes.',
      sections: [
        {
          title: 'Sinais visíveis',
          icon: '👁️',
          items: [
            { symptom: 'Nódulo ou inchaço', description: 'Todo novo nódulo na mama deve ser examinado por um médico.', severity: 'high' },
            { symptom: 'Mudança de forma ou tamanho', description: 'Uma mudança repentina na forma ou no volume de uma mama.', severity: 'high' },
          ],
        },
        {
          title: 'Sinais na pele',
          icon: '🔍',
          items: [
            { symptom: 'Vermelhidão ou descamação', description: 'Uma mudança na cor ou na textura da pele da mama.', severity: 'medium' },
            { symptom: 'Pele com covinhas (casca de laranja)', description: 'A pele ganha um aspecto enrugado, como uma casca de laranja.', severity: 'high' },
          ],
        },
        {
          title: 'Sinais do mamilo',
          icon: '⚠️',
          items: [
            { symptom: 'Secreção incomum', description: 'Secreção espontânea do mamilo, especialmente se tiver sangue.', severity: 'high' },
            { symptom: 'Retração do mamilo', description: 'O mamilo se retrai para dentro de forma nova.', severity: 'high' },
          ],
        },
        {
          title: 'Sensações',
          icon: '🤚',
          items: [
            { symptom: 'Nódulo sob o braço', description: 'Inchaço ou nódulo na região da axila.', severity: 'high' },
            { symptom: 'Dor localizada persistente', description: 'Uma dor que não passa, concentrada num ponto.', severity: 'medium' },
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
  es: [
    { id: 'self_exam', icon: '🩺', text: 'Hacer un autoexamen cada mes' },
    { id: 'doctor', icon: '👩‍⚕️', text: 'Visitar a un médico una vez al año' },
    { id: 'exercise', icon: '🏃‍♀️', text: '30 minutos de actividad física al día' },
    { id: 'diet', icon: '🥗', text: 'Comer mucha fruta y verdura' },
    { id: 'weight', icon: '⚖️', text: 'Mantener un peso saludable' },
    { id: 'no_smoke', icon: '🚭', text: 'Evitar el tabaco y el alcohol' },
    { id: 'breastfeed', icon: '🤱', text: 'Dar el pecho si es posible' },
    { id: 'sleep', icon: '😴', text: 'Dormir bien y reducir el estrés' },
  ],
  de: [
    { id: 'self_exam', icon: '🩺', text: 'Jeden Monat eine Selbstuntersuchung machen' },
    { id: 'doctor', icon: '👩‍⚕️', text: 'Einmal im Jahr zur Ärztin gehen' },
    { id: 'exercise', icon: '🏃‍♀️', text: '30 Minuten körperliche Aktivität am Tag' },
    { id: 'diet', icon: '🥗', text: 'Viel Obst und Gemüse essen' },
    { id: 'weight', icon: '⚖️', text: 'Ein gesundes Gewicht halten' },
    { id: 'no_smoke', icon: '🚭', text: 'Tabak und Alkohol vermeiden' },
    { id: 'breastfeed', icon: '🤱', text: 'Wenn möglich stillen' },
    { id: 'sleep', icon: '😴', text: 'Gut schlafen und Stress reduzieren' },
  ],
  ru: [
    { id: 'self_exam', icon: '🩺', text: 'Делать самообследование каждый месяц' },
    { id: 'doctor', icon: '👩‍⚕️', text: 'Посещать врача раз в год' },
    { id: 'exercise', icon: '🏃‍♀️', text: '30 минут физической активности в день' },
    { id: 'diet', icon: '🥗', text: 'Есть много фруктов и овощей' },
    { id: 'weight', icon: '⚖️', text: 'Поддерживать здоровый вес' },
    { id: 'no_smoke', icon: '🚭', text: 'Избегать курения и алкоголя' },
    { id: 'breastfeed', icon: '🤱', text: 'Кормить грудью, если возможно' },
    { id: 'sleep', icon: '😴', text: 'Хорошо спать и снижать стресс' },
  ],
  pt: [
    { id: 'self_exam', icon: '🩺', text: 'Fazer um autoexame todo mês' },
    { id: 'doctor', icon: '👩‍⚕️', text: 'Consultar um médico uma vez por ano' },
    { id: 'exercise', icon: '🏃‍♀️', text: '30 minutos de atividade física por dia' },
    { id: 'diet', icon: '🥗', text: 'Comer bastante fruta e verdura' },
    { id: 'weight', icon: '⚖️', text: 'Manter um peso saudável' },
    { id: 'no_smoke', icon: '🚭', text: 'Evitar tabaco e álcool' },
    { id: 'breastfeed', icon: '🤱', text: 'Amamentar quando possível' },
    { id: 'sleep', icon: '😴', text: 'Dormir bem e reduzir o estresse' },
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
  es: [
    { id: 'm1', myth: 'El cáncer de mama solo afecta a las mujeres mayores.', truth: 'Puede aparecer a cualquier edad, incluso en mujeres jóvenes.' },
    { id: 'm2', myth: 'Sin antecedentes familiares, estoy totalmente a salvo.', truth: 'El 85% de los casos no tienen ningún antecedente familiar. El cribado es para todas.' },
    { id: 'm3', myth: 'Cualquier bulto en la mama es cáncer.', truth: 'La mayoría de los bultos son benignos, pero siempre deben examinarse.' },
    { id: 'm4', myth: 'El autoexamen sustituye la visita al médico.', truth: 'El autoexamen es complementario e importante, pero no sustituye el examen médico.' },
    { id: 'm5', myth: 'La mamografía provoca cáncer.', truth: 'La dosis de radiación es muy baja y segura; el beneficio del cribado es enorme.' },
    { id: 'm6', myth: 'El cáncer de mama siempre es mortal.', truth: 'Con la detección temprana, la tasa de supervivencia llega al 99%.' },
    { id: 'm7', myth: 'El desodorante causa cáncer de mama.', truth: 'Ninguna prueba científica relaciona el desodorante con el cáncer de mama.' },
    { id: 'm8', myth: 'La lactancia no tiene nada que ver con la prevención.', truth: 'La lactancia reduce el riesgo de cáncer de mama.' },
  ],
  de: [
    { id: 'm1', myth: 'Brustkrebs betrifft nur ältere Frauen.', truth: 'Er kann in jedem Alter auftreten, auch bei jungen Frauen.' },
    { id: 'm2', myth: 'Ohne Familiengeschichte bin ich völlig sicher.', truth: '85% der Fälle haben keine Familiengeschichte. Vorsorge ist für alle da.' },
    { id: 'm3', myth: 'Jeder Knoten in der Brust ist Krebs.', truth: 'Die meisten Knoten sind gutartig, sollten aber immer untersucht werden.' },
    { id: 'm4', myth: 'Die Selbstuntersuchung ersetzt den Arztbesuch.', truth: 'Die Selbstuntersuchung ist wichtig und ergänzend, aber kein Ersatz für die ärztliche Untersuchung.' },
    { id: 'm5', myth: 'Die Mammografie verursacht Krebs.', truth: 'Die Strahlendosis ist sehr gering und sicher; der Nutzen der Vorsorge ist groß.' },
    { id: 'm6', myth: 'Brustkrebs ist immer tödlich.', truth: 'Mit Früherkennung erreicht die Überlebensrate 99%.' },
    { id: 'm7', myth: 'Deodorant verursacht Brustkrebs.', truth: 'Kein wissenschaftlicher Beweis verbindet Deodorant mit Brustkrebs.' },
    { id: 'm8', myth: 'Stillen hat nichts mit Vorbeugung zu tun.', truth: 'Stillen senkt das Brustkrebsrisiko.' },
  ],
  ru: [
    { id: 'm1', myth: 'Рак груди бывает только у пожилых женщин.', truth: 'Он может возникнуть в любом возрасте, в том числе у молодых женщин.' },
    { id: 'm2', myth: 'Без семейной истории я в полной безопасности.', truth: '85% случаев не имеют семейной истории. Обследование нужно всем.' },
    { id: 'm3', myth: 'Любое уплотнение в груди — это рак.', truth: 'Большинство уплотнений доброкачественные, но их всегда должен осматривать врач.' },
    { id: 'm4', myth: 'Самообследование заменяет визит к врачу.', truth: 'Самообследование важно и дополняет, но не заменяет медицинский осмотр.' },
    { id: 'm5', myth: 'Маммография вызывает рак.', truth: 'Доза облучения очень мала и безопасна; польза скрининга огромна.' },
    { id: 'm6', myth: 'Рак груди всегда смертелен.', truth: 'При раннем выявлении выживаемость достигает 99%.' },
    { id: 'm7', myth: 'Дезодорант вызывает рак груди.', truth: 'Нет научных доказательств связи дезодоранта с раком груди.' },
    { id: 'm8', myth: 'Грудное вскармливание не связано с профилактикой.', truth: 'Грудное вскармливание снижает риск рака груди.' },
  ],
  pt: [
    { id: 'm1', myth: 'O câncer de mama só afeta mulheres mais velhas.', truth: 'Pode ocorrer em qualquer idade, inclusive em mulheres jovens.' },
    { id: 'm2', myth: 'Sem histórico familiar, estou totalmente segura.', truth: '85% dos casos não têm nenhum histórico familiar. O rastreamento é para todas.' },
    { id: 'm3', myth: 'Qualquer nódulo na mama é câncer.', truth: 'A maioria dos nódulos é benigna, mas deve sempre ser examinada.' },
    { id: 'm4', myth: 'O autoexame substitui a visita ao médico.', truth: 'O autoexame é importante e complementar, mas não substitui o exame médico.' },
    { id: 'm5', myth: 'A mamografia provoca câncer.', truth: 'A dose de radiação é muito baixa e segura; o benefício do rastreamento é enorme.' },
    { id: 'm6', myth: 'O câncer de mama é sempre fatal.', truth: 'Com a detecção precoce, a taxa de sobrevivência chega a 99%.' },
    { id: 'm7', myth: 'O desodorante causa câncer de mama.', truth: 'Nenhuma evidência científica liga o desodorante ao câncer de mama.' },
    { id: 'm8', myth: 'A amamentação não tem nada a ver com prevenção.', truth: 'A amamentação reduz o risco de câncer de mama.' },
  ],
};

// ── Self-check guide (mirrors GET /self-check-guide) ────────────────
export const selfCheckGuide: Record<Language, SelfCheckGuide> = {
  ar: {
    title: 'دليل الفحص الذاتي',
    best_time: 'من 3 ل5 أيام بعد نهاية الدورة الشهرية',
    total_duration_minutes: 5,
    important_note: 'الفحص الذاتي ماشي بديل للفحص الطبي. إلا لاحظتي أي تغيير، حجزي موعد مع طبيب.',
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
    important_note: 'L?auto-examen ne remplace pas un examen m?dical. Si vous remarquez un changement, consultez un m?decin.',
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
    important_note: 'A self-check does not replace a medical exam. If you notice a change, book an appointment with a doctor.',
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
  es: {
    title: 'Guía de autoexamen',
    best_time: '3 a 5 días después del final de la regla',
    total_duration_minutes: 5,
    important_note: 'El autoexamen no sustituye un examen médico. Si notas un cambio, pide cita pronto y consulta a un médico.',
    disclaimer: 'Esta guía es solo para concienciación, no una consulta médica.',
    steps: [
      {
        step_number: 1,
        title: 'Observar en el espejo',
        icon: '🪞',
        duration_seconds: 60,
        instruction: 'Ponte frente al espejo, con las manos en las caderas. Busca cualquier cambio de forma, tamaño o color de la piel.',
        what_to_look_for: ['Cambio de tamaño o forma', 'Hinchazón o retracción', 'Cambio de color de la piel'],
        image_url: '/assets/steps/step1.svg',
      },
      {
        step_number: 2,
        title: 'Levantar los brazos',
        icon: '🙌',
        duration_seconds: 45,
        instruction: 'Levanta los brazos por encima de la cabeza y observa los mismos cambios desde un nuevo ángulo.',
        what_to_look_for: ['Hinchazón', 'Retracción del pezón', 'Cambios cutáneos'],
        image_url: '/assets/steps/step2.svg',
      },
      {
        step_number: 3,
        title: 'Examen de pie',
        icon: '🤚',
        duration_seconds: 90,
        instruction: 'Usa la mano derecha para examinar la mama izquierda, y al revés. Haz movimientos circulares, con presión ligera, luego media y luego firme.',
        what_to_look_for: ['Bulto o induración', 'Dolor en un punto concreto', 'Cambio de textura'],
        image_url: '/assets/steps/step3.svg',
      },
      {
        step_number: 4,
        title: 'Examen tumbada',
        icon: '🛏️',
        duration_seconds: 90,
        instruction: 'Túmbate con un cojín bajo el hombro. Repite los mismos movimientos circulares en cada mama.',
        what_to_look_for: ['Bultos en distintas zonas', 'Diferencia entre las dos mamas'],
        image_url: '/assets/steps/step4.svg',
      },
      {
        step_number: 5,
        title: 'Examen del pezón',
        icon: '⚠️',
        duration_seconds: 30,
        instruction: 'Presiona suavemente el pezón y comprueba que no haya secreción inusual.',
        what_to_look_for: ['Secreción inusual', 'Presencia de sangre', 'Cambio de forma del pezón'],
        image_url: '/assets/steps/step5.svg',
      },
    ],
  },
  de: {
    title: 'Anleitung zur Selbstuntersuchung',
    best_time: '3 bis 5 Tage nach dem Ende der Periode',
    total_duration_minutes: 5,
    important_note: 'Die Selbstuntersuchung ersetzt keine ärztliche Untersuchung. Wenn du eine Veränderung bemerkst, vereinbare einen Termin bei einer Ärztin.',
    disclaimer: 'Diese Anleitung dient nur der Aufklärung, nicht der medizinischen Beratung.',
    steps: [
      {
        step_number: 1,
        title: 'Im Spiegel betrachten',
        icon: '🪞',
        duration_seconds: 60,
        instruction: 'Stell dich vor den Spiegel, die Hände in die Hüften. Achte auf jede Veränderung von Form, Größe oder Hautfarbe.',
        what_to_look_for: ['Veränderung von Größe oder Form', 'Schwellung oder Einziehung', 'Veränderung der Hautfarbe'],
        image_url: '/assets/steps/step1.svg',
      },
      {
        step_number: 2,
        title: 'Arme heben',
        icon: '🙌',
        duration_seconds: 45,
        instruction: 'Heb die Arme über den Kopf und beobachte dieselben Veränderungen aus einem neuen Winkel.',
        what_to_look_for: ['Schwellung', 'Einziehung der Brustwarze', 'Hautveränderungen'],
        image_url: '/assets/steps/step2.svg',
      },
      {
        step_number: 3,
        title: 'Untersuchung im Stehen',
        icon: '🤚',
        duration_seconds: 90,
        instruction: 'Untersuche mit der rechten Hand die linke Brust und umgekehrt. Mach kreisende Bewegungen mit leichtem, dann mittlerem, dann festem Druck.',
        what_to_look_for: ['Knoten oder Verhärtung', 'Schmerz an einer bestimmten Stelle', 'Veränderung der Textur'],
        image_url: '/assets/steps/step3.svg',
      },
      {
        step_number: 4,
        title: 'Untersuchung im Liegen',
        icon: '🛏️',
        duration_seconds: 90,
        instruction: 'Leg dich hin, ein Kissen unter der Schulter. Wiederhole dieselben kreisenden Bewegungen an jeder Brust.',
        what_to_look_for: ['Knoten in verschiedenen Bereichen', 'Unterschied zwischen beiden Brüsten'],
        image_url: '/assets/steps/step4.svg',
      },
      {
        step_number: 5,
        title: 'Brustwarze prüfen',
        icon: '⚠️',
        duration_seconds: 30,
        instruction: 'Drücke die Brustwarze sanft und prüfe auf ungewöhnlichen Austritt.',
        what_to_look_for: ['Ungewöhnlicher Austritt', 'Blut', 'Veränderung der Form der Brustwarze'],
        image_url: '/assets/steps/step5.svg',
      },
    ],
  },
  ru: {
    title: 'Руководство по самообследованию',
    best_time: 'С 3 по 5 день после окончания месячных',
    total_duration_minutes: 5,
    important_note: 'Самообследование не заменяет медицинский осмотр. Если вы заметили изменение, обратитесь к врачу.',
    disclaimer: 'Это руководство только для информирования, а не медицинская консультация.',
    steps: [
      {
        step_number: 1,
        title: 'Осмотр в зеркале',
        icon: '🪞',
        duration_seconds: 60,
        instruction: 'Встаньте перед зеркалом, руки на бёдрах. Ищите любые изменения формы, размера или цвета кожи.',
        what_to_look_for: ['Изменение размера или формы', 'Припухлость или втяжение', 'Изменение цвета кожи'],
        image_url: '/assets/steps/step1.svg',
      },
      {
        step_number: 2,
        title: 'Поднимите руки',
        icon: '🙌',
        duration_seconds: 45,
        instruction: 'Поднимите руки над головой и осмотрите те же изменения под новым углом.',
        what_to_look_for: ['Припухлость', 'Втяжение соска', 'Изменения кожи'],
        image_url: '/assets/steps/step2.svg',
      },
      {
        step_number: 3,
        title: 'Осмотр стоя',
        icon: '🤚',
        duration_seconds: 90,
        instruction: 'Правой рукой обследуйте левую грудь и наоборот. Двигайте пальцами по кругу с лёгким, затем средним, затем сильным нажимом.',
        what_to_look_for: ['Уплотнение или твёрдость', 'Боль в определённой точке', 'Изменение текстуры'],
        image_url: '/assets/steps/step3.svg',
      },
      {
        step_number: 4,
        title: 'Осмотр лёжа',
        icon: '🛏️',
        duration_seconds: 90,
        instruction: 'Лягте, подложив подушку под плечо. Повторите те же круговые движения на каждой груди.',
        what_to_look_for: ['Уплотнения в разных областях', 'Разница между двумя грудями'],
        image_url: '/assets/steps/step4.svg',
      },
      {
        step_number: 5,
        title: 'Осмотр соска',
        icon: '⚠️',
        duration_seconds: 30,
        instruction: 'Аккуратно сожмите сосок и проверьте, нет ли необычных выделений.',
        what_to_look_for: ['Необычные выделения', 'Кровь', 'Изменение формы соска'],
        image_url: '/assets/steps/step5.svg',
      },
    ],
  },
  pt: {
    title: 'Guia de autoexame',
    best_time: '3 a 5 dias após o fim da menstruação',
    total_duration_minutes: 5,
    important_note: 'O autoexame não substitui um exame médico. Se você notar uma mudança, procure um médico.',
    disclaimer: 'Este guia é apenas para conscientização, não uma consulta médica.',
    steps: [
      {
        step_number: 1,
        title: 'Observar no espelho',
        icon: '🪞',
        duration_seconds: 60,
        instruction: 'Fique em frente ao espelho, mãos nos quadris. Procure qualquer mudança de forma, tamanho ou cor da pele.',
        what_to_look_for: ['Mudança de tamanho ou forma', 'Inchaço ou retração', 'Mudança de cor da pele'],
        image_url: '/assets/steps/step1.svg',
      },
      {
        step_number: 2,
        title: 'Levantar os braços',
        icon: '🙌',
        duration_seconds: 45,
        instruction: 'Levante os braços acima da cabeça e observe as mesmas mudanças de um novo ângulo.',
        what_to_look_for: ['Inchaço', 'Retração do mamilo', 'Mudanças na pele'],
        image_url: '/assets/steps/step2.svg',
      },
      {
        step_number: 3,
        title: 'Exame em pé',
        icon: '🤚',
        duration_seconds: 90,
        instruction: 'Use a mão direita para examinar a mama esquerda e vice-versa. Faça movimentos circulares, com pressão leve, depois média e depois firme.',
        what_to_look_for: ['Nódulo ou endurecimento', 'Dor num ponto específico', 'Mudança de textura'],
        image_url: '/assets/steps/step3.svg',
      },
      {
        step_number: 4,
        title: 'Exame deitada',
        icon: '🛏️',
        duration_seconds: 90,
        instruction: 'Deite-se com um travesseiro sob o ombro. Repita os mesmos movimentos circulares em cada mama.',
        what_to_look_for: ['Nódulos em diferentes áreas', 'Diferença entre as duas mamas'],
        image_url: '/assets/steps/step4.svg',
      },
      {
        step_number: 5,
        title: 'Exame do mamilo',
        icon: '⚠️',
        duration_seconds: 30,
        instruction: 'Pressione suavemente o mamilo e verifique se há secreção incomum.',
        what_to_look_for: ['Secreção incomum', 'Presença de sangue', 'Mudança na forma do mamilo'],
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
  es: {
    global: { affected_ratio: '1 / 8', early_detection_survival: '99%', most_common_cancer_women: true, new_cases_yearly: '2,3 millones' },
    morocco: {
      new_cases_yearly: '~12.000',
      average_diagnosis_age: 48,
      late_diagnosis_percentage: 60,
      awareness_note: 'El 60% de los casos en Marruecos se diagnostican tarde. La detección temprana salva vidas.',
    },
    key_facts: [
      { stat: '85%', description: 'de las mujeres afectadas no tienen antecedentes familiares' },
      { stat: '5 min', description: 'es el tiempo que lleva un autoexamen cada mes' },
      { stat: '99%', description: 'tasa de supervivencia con detección temprana' },
    ],
  },
  de: {
    global: { affected_ratio: '1 / 8', early_detection_survival: '99%', most_common_cancer_women: true, new_cases_yearly: '2,3 Millionen' },
    morocco: {
      new_cases_yearly: '~12.000',
      average_diagnosis_age: 48,
      late_diagnosis_percentage: 60,
      awareness_note: '60% der Fälle in Marokko werden spät diagnostiziert. Früherkennung rettet Leben.',
    },
    key_facts: [
      { stat: '85%', description: 'der betroffenen Frauen haben keine Familiengeschichte' },
      { stat: '5 Min', description: 'ist die Zeit, die eine Selbstuntersuchung pro Monat braucht' },
      { stat: '99%', description: 'Überlebensrate bei Früherkennung' },
    ],
  },
  ru: {
    global: { affected_ratio: '1 / 8', early_detection_survival: '99%', most_common_cancer_women: true, new_cases_yearly: '2,3 миллиона' },
    morocco: {
      new_cases_yearly: '~12 000',
      average_diagnosis_age: 48,
      late_diagnosis_percentage: 60,
      awareness_note: '60% случаев в Марокко диагностируются поздно. Раннее выявление спасает жизни.',
    },
    key_facts: [
      { stat: '85%', description: 'заболевших женщин не имеют семейной истории' },
      { stat: '5 мин', description: 'столько времени занимает самообследование в месяц' },
      { stat: '99%', description: 'выживаемость при раннем выявлении' },
    ],
  },
  pt: {
    global: { affected_ratio: '1 / 8', early_detection_survival: '99%', most_common_cancer_women: true, new_cases_yearly: '2,3 milhões' },
    morocco: {
      new_cases_yearly: '~12.000',
      average_diagnosis_age: 48,
      late_diagnosis_percentage: 60,
      awareness_note: '60% dos casos em Marrocos são diagnosticados tarde. A detecção precoce salva vidas.',
    },
    key_facts: [
      { stat: '85%', description: 'das mulheres afetadas não têm histórico familiar' },
      { stat: '5 min', description: 'é o tempo que um autoexame leva por mês' },
      { stat: '99%', description: 'taxa de sobrevivência com detecção precoce' },
    ],
  },
};
