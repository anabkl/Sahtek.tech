import type { Language } from '@/types/api';
import type { ChatCategory } from '@/types/chat';

// ════════════════════════════════════════════════════════════════════
//  DEMO-MODE chat brain — keyword-matched, empathetic, trilingual.
//  Used by mockService when no backend is connected.
// ════════════════════════════════════════════════════════════════════

export interface KnowledgeEntry {
  key: string;
  category: ChatCategory;
  /** Matched (case-insensitive) against the user's message. */
  pattern: RegExp;
  related: string[];
  disclaimer: boolean;
  responses: Record<Language, string>;
}

/**
 * Order matters: specific topics are tested before greeting/thanks,
 * so "مرحبا، شنو الأعراض؟" still resolves to the symptoms answer.
 */
export const knowledgeBase: KnowledgeEntry[] = [
  {
    key: 'symptoms',
    category: 'symptoms',
    pattern: /(أعراض|اعراض|علامات|symptom|symptôm|signe|sign|كتلة|lump)/i,
    related: ['self_check', 'prevention', 'when_to_see_doctor'],
    disclaimer: true,
    responses: {
      ar: 'العلامات اللي خاصك تراقبي 🎀:\n— كتلة فالثدي أو تحت الإبط\n— تغيّر فالشكل أو الحجم\n— احمرار أو تنقير الجلد (بحال قشرة البرتقالة)\n— إفرازات من الحلمة أو انكماشها\nأغلب التغييرات ماشي سرطان، ولكن إلا لاحظتي شي حاجة جديدة، ما تخافيش وسيري عند الطبيب باش يطمّنك. 💗',
      fr: 'Les signes à surveiller 🎀 :\n— une masse dans le sein ou sous l’aisselle\n— un changement de forme ou de taille\n— une rougeur ou un capitonnage de la peau\n— un écoulement du mamelon ou une rétraction\nLa plupart des changements ne sont pas un cancer, mais si vous remarquez quelque chose de nouveau, consultez un médecin pour être rassurée. 💗',
      en: 'Signs to watch for 🎀:\n— a lump in the breast or underarm\n— a change in shape or size\n— redness or dimpling of the skin\n— nipple discharge or retraction\nMost changes are not cancer, but if you notice anything new, do not worry alone — see a doctor to be reassured. 💗',
    },
  },
  {
    key: 'self_check',
    category: 'self_check',
    pattern: /(فحص ذاتي|فحص|كشف|auto.?exam|self.?check|examen|dépistage|screening|كيفاش نفحص)/i,
    related: ['symptoms', 'reminder', 'prevention'],
    disclaimer: true,
    responses: {
      ar: 'الفحص الذاتي ساهل وكياخد 5 دقائق فالشهر 🩺:\n1. شوفي فالمرآة، يديك على الوركين\n2. رفعي يديك وعاودي شوفي\n3. فحصي بحركات دائرية وقفة\n4. عاودي مستلقية\n5. شوفي الحلمة\nأحسن وقت هو من 3 ل5 أيام بعد الدورة. عندنا دليل كامل مع مؤقّت فالتطبيق! إلا حسّيتي بشي حاجة، استشيري الطبيب. 💗',
      fr: 'L’auto-examen est simple et prend 5 minutes par mois 🩺 :\n1. Observez dans le miroir, mains sur les hanches\n2. Levez les bras et observez à nouveau\n3. Palpez debout en mouvements circulaires\n4. Recommencez allongée\n5. Vérifiez le mamelon\nLe meilleur moment : 3 à 5 jours après les règles. Un guide complet avec minuteur vous attend dans l’app ! En cas de doute, consultez un médecin. 💗',
      en: 'A self-check is simple and takes 5 minutes a month 🩺:\n1. Look in the mirror, hands on hips\n2. Raise your arms and look again\n3. Feel standing, in circular motions\n4. Repeat lying down\n5. Check the nipple\nBest time: 3–5 days after your period. A full guided check with a timer is in the app! If anything feels off, see a doctor. 💗',
    },
  },
  {
    key: 'mammography',
    category: 'treatment',
    pattern: /(ماموغراف|mammogr|أشعة|اشعة|radiograph|ماموغ)/i,
    related: ['self_check', 'prevention', 'age'],
    disclaimer: true,
    responses: {
      ar: 'الماموغرافيا هي صورة بالأشعة كتساعد فالكشف المبكر، حتى قبل ما تبان شي كتلة 🔬. كتنصح عموماً للنساء من 40 عام فما فوق، أو بكري إلا كان تاريخ عائلي. جرعة الإشعاع ضعيفة جداً وآمنة. هي ماشي بديلة للفحص الذاتي ولكن كتكمّلو. خاصك تستشيري الطبيب باش يحدّد ليك الوقت المناسب. 💗',
      fr: 'La mammographie est une radiographie qui aide à la détection précoce, avant même qu’une masse soit palpable 🔬. Elle est généralement recommandée dès 40 ans, ou plus tôt en cas d’antécédents familiaux. La dose de rayonnement est très faible et sûre. Elle ne remplace pas l’auto-examen mais le complète. Consultez un médecin pour le bon moment. 💗',
      en: 'A mammogram is an X-ray that helps with early detection, even before a lump can be felt 🔬. It is generally recommended from age 40, or earlier with a family history. The radiation dose is very low and safe. It does not replace a self-check but completes it. Talk to a doctor about the right time for you. 💗',
    },
  },
  {
    key: 'treatment',
    category: 'treatment',
    pattern: /(علاج|شفاء|guérison|traitement|treatment|cure|chimio|chemo|chirurgie|surgery)/i,
    related: ['symptoms', 'emotional_support', 'mammography'],
    disclaimer: true,
    responses: {
      ar: 'علاج سرطان الثدي تقدّم بزّاف 💪. كاينة عدة طرق: الجراحة، العلاج الكيميائي، الإشعاعي، والهرموني — والطبيب كيختار اللي مناسب لكل حالة. أهم حاجة: ملي يتكتشف بكري، نسبة الشفاء كتوصل ل99٪. إلا عندك أسئلة على حالة معينة، الطبيب المختص هو اللي يقدر يجاوبك بدقة. ما تبقايش وحدك مع أسئلتك. 💗',
      fr: 'Le traitement du cancer du sein a beaucoup progressé 💪. Plusieurs approches existent : chirurgie, chimiothérapie, radiothérapie, hormonothérapie — le médecin choisit selon chaque cas. L’essentiel : détecté tôt, le taux de survie atteint 99 %. Pour une situation précise, seul un médecin spécialiste peut répondre avec exactitude. Ne restez pas seule avec vos questions. 💗',
      en: 'Breast cancer treatment has advanced enormously 💪. Several approaches exist: surgery, chemotherapy, radiotherapy, hormone therapy — a doctor chooses based on each case. The key point: caught early, survival reaches 99%. For a specific situation, only a specialist doctor can answer precisely. Do not stay alone with your questions. 💗',
    },
  },
  {
    key: 'prevention',
    category: 'prevention',
    pattern: /(وقاية|حماية|prévent|prevent|protection|نتجنّب|كيفاش نوقّي)/i,
    related: ['diet', 'exercise', 'self_check'],
    disclaimer: true,
    responses: {
      ar: 'ماتقدريش تتحكمي فكل شي، ولكن كاينة عادات كتنقص الخطر 🌿:\n— رياضة منتظمة (30 دقيقة فاليوم)\n— أكل صحي غني بالخضر والفواكه\n— وزن صحي\n— تجنّبي التدخين والكحول\n— الرضاعة الطبيعية إلا أمكن\n— الفحص الذاتي كل شهر\nهاد العادات كتحميك ماشي غير من سرطان الثدي، حتى من أمراض أخرى. استشيري الطبيب على فحوصات منتظمة. 💗',
      fr: 'On ne contrôle pas tout, mais certaines habitudes réduisent le risque 🌿 :\n— activité physique régulière (30 min/jour)\n— alimentation saine, riche en fruits et légumes\n— poids santé\n— éviter tabac et alcool\n— allaiter si possible\n— auto-examen chaque mois\nCes habitudes vous protègent au-delà du cancer du sein. Demandez à un médecin un suivi régulier. 💗',
      en: 'You cannot control everything, but some habits lower the risk 🌿:\n— regular physical activity (30 min/day)\n— a healthy diet rich in fruit and vegetables\n— a healthy weight\n— avoiding tobacco and alcohol\n— breastfeeding when possible\n— a monthly self-check\nThese habits protect you beyond breast cancer. Ask a doctor about regular check-ups. 💗',
    },
  },
  {
    key: 'fear',
    category: 'emotional_support',
    pattern: /(خوف|خايفة|قلق|قلقانة|scared|afraid|peur|inquièt|anxious|worried|نخاف|stress)/i,
    related: ['self_check', 'symptoms', 'treatment'],
    disclaimer: true,
    responses: {
      ar: 'أنا فاهمة، الخوف حاجة طبيعية بزّاف ولا عيب فيه 💗. ولكن تعرفي؟ المعرفة هي أقوى سلاح ضد الخوف. ملي تفهمي جسمك وتديري الفحص بانتظام، كتولّي مرتاحة أكثر. تذكّري: أغلب التغييرات فالثدي ماشي سرطان، والكشف المبكر كيوصل ل99٪ نسبة شفاء. ما تبقايش وحدك — هضري مع طبيب أو مع حد قريب ليك. راكي قوية، وحنا معاك. 🎀',
      fr: 'Je comprends, la peur est tout à fait naturelle et il n’y a aucune honte à la ressentir 💗. Mais vous savez ? Le savoir est l’arme la plus puissante contre la peur. En comprenant votre corps et en vous examinant régulièrement, vous serez plus sereine. Rappelez-vous : la plupart des changements ne sont pas un cancer, et la détection précoce atteint 99 % de survie. Ne restez pas seule — parlez à un médecin ou à un proche. Vous êtes forte, et nous sommes avec vous. 🎀',
      en: 'I understand — fear is completely natural and there is no shame in feeling it 💗. But you know what? Knowledge is the most powerful weapon against fear. Understanding your body and checking regularly will make you calmer. Remember: most breast changes are not cancer, and early detection reaches 99% survival. Do not stay alone — talk to a doctor or someone close to you. You are strong, and we are with you. 🎀',
    },
  },
  {
    key: 'myths',
    category: 'myths',
    pattern: /(خراف|myth|mythe|صحيح ولا|كذب|faux|vrai ou)/i,
    related: ['prevention', 'genetics', 'mammography'],
    disclaimer: true,
    responses: {
      ar: 'خلّينا نوضّحو شي خرافات مشهورة ✅:\n— «الكتلة معناها سرطان» → غالط، أغلب الكتل حميدة\n— «بلا تاريخ عائلي راني فأمان» → غالط، 85٪ ماعندهمش تاريخ عائلي\n— «الماموغرافيا كتسبب السرطان» → غالط، آمنة تماماً\n— «مزيل العرق كيسبب السرطان» → غالط، ماكاينش دليل علمي\nالحقائق كتطمّنك أكثر من الخرافات. إلا عندك سؤال على شي اعتقاد، سوليني أو سولي الطبيب. 💗',
      fr: 'Clarifions quelques mythes répandus ✅ :\n— « une masse = cancer » → faux, la plupart sont bénignes\n— « sans antécédent familial je suis à l’abri » → faux, 85 % n’en ont aucun\n— « la mammographie cause le cancer » → faux, elle est sûre\n— « le déodorant cause le cancer » → faux, aucune preuve scientifique\nLes faits rassurent plus que les mythes. Pour toute croyance, demandez-moi ou consultez un médecin. 💗',
      en: 'Let us clear up some common myths ✅:\n— "a lump means cancer" → false, most are benign\n— "no family history means I am safe" → false, 85% have none\n— "mammograms cause cancer" → false, they are safe\n— "deodorant causes cancer" → false, no scientific evidence\nFacts reassure more than myths. For any belief you are unsure about, ask me or a doctor. 💗',
    },
  },
  {
    key: 'diet',
    category: 'diet',
    pattern: /(أكل|ماكلة|تغذية|diet|aliment|nutrition|food|ناكل|manger)/i,
    related: ['prevention', 'exercise'],
    disclaimer: true,
    responses: {
      ar: 'التغذية الصحية كتساعد فالوقاية 🥗:\n— زيدي الخضر والفواكه الملوّنة\n— الحبوب الكاملة بدل المكرّرة\n— زيت الزيتون والمكسّرات\n— قلّلي من اللحوم المصنّعة والسكّر والدهون\n— قلّلي من الكحول\nالهدف ماشي حمية قاسية، بل توازن وانتظام. أكل صحي + وزن صحي = حماية أحسن. للنصائح الخاصة بصحتك، استشيري طبيب أو أخصائي تغذية. 💗',
      fr: 'Une alimentation saine aide à la prévention 🥗 :\n— plus de fruits et légumes colorés\n— des céréales complètes plutôt que raffinées\n— huile d’olive et fruits à coque\n— moins de viandes transformées, de sucre et de graisses\n— moins d’alcool\nLe but n’est pas un régime strict, mais l’équilibre et la régularité. Pour des conseils adaptés, consultez un médecin ou un nutritionniste. 💗',
      en: 'A healthy diet supports prevention 🥗:\n— more colourful fruit and vegetables\n— whole grains rather than refined ones\n— olive oil and nuts\n— less processed meat, sugar and fat\n— less alcohol\nThe goal is not a strict diet, but balance and consistency. For advice tailored to you, see a doctor or a nutritionist. 💗',
    },
  },
  {
    key: 'exercise',
    category: 'exercise',
    pattern: /(رياضة|تمارين|exercice|sport|exercise|activité physique|نتحرّك)/i,
    related: ['prevention', 'diet'],
    disclaimer: true,
    responses: {
      ar: 'الرياضة من أقوى عوامل الوقاية 🏃‍♀️! 30 دقيقة فاليوم كتنقص الخطر بشكل ملحوظ. ماشي ضروري قاعة رياضية — المشي بسرعة، الرقص، أو السباحة كافيين. الرياضة كتساعد على وزن صحي، كتنظّم الهرمونات، وكتحسّن المزاج. ابدئي بشوية وزيدي شوية بشوية. جسمك غادي يشكرك! للنصائح المناسبة لحالتك الصحية، استشيري طبيب. 💗',
      fr: 'L’activité physique est l’un des plus puissants facteurs de prévention 🏃‍♀️ ! 30 minutes par jour réduisent nettement le risque. Pas besoin de salle — marche rapide, danse ou natation suffisent. Le sport aide à garder un poids santé, régule les hormones et améliore l’humeur. Commencez doucement et augmentez progressivement. Votre corps vous remerciera ! Pour des conseils adaptés, consultez un médecin. 💗',
      en: 'Exercise is one of the most powerful prevention factors 🏃‍♀️! 30 minutes a day clearly lowers the risk. No gym needed — brisk walking, dancing or swimming are enough. Activity helps keep a healthy weight, balances hormones and lifts your mood. Start gently and build up gradually. Your body will thank you! For advice suited to your health, see a doctor. 💗',
    },
  },
  {
    key: 'genetics',
    category: 'genetics',
    pattern: /(وراثة|وراثي|génétiqu|genetic|hérédit|عائلة|عائلي|family|familial|BRCA)/i,
    related: ['prevention', 'mammography', 'risk'],
    disclaimer: true,
    responses: {
      ar: 'التاريخ العائلي كيرفع الخطر، ولكن خاصك تعرفي 🧬: 85٪ من النساء المصابات ماعندهمش أي تاريخ عائلي! يعني الوقاية تخص الجميع. إلا كانت الأم أو الأخت عندها سرطان الثدي، خبّري الطبيب — يمكن ينصحك بفحوصات بكري أو باختبار جيني (BRCA). وجود الجين ماشي معناه المرض أكيد، بل خطر أعلى يمكن التعامل معاه. استشيري طبيب مختص. 💗',
      fr: 'Les antécédents familiaux augmentent le risque, mais sachez-le 🧬 : 85 % des femmes touchées n’ont aucun antécédent familial ! La prévention concerne donc toutes. Si votre mère ou sœur a eu un cancer du sein, informez-en le médecin — il peut conseiller un dépistage précoce ou un test génétique (BRCA). Porter le gène ne signifie pas une maladie certaine, mais un risque plus élevé que l’on peut gérer. Consultez un spécialiste. 💗',
      en: 'A family history raises the risk, but know this 🧬: 85% of affected women have no family history at all! So prevention is for everyone. If your mother or sister had breast cancer, tell your doctor — they may advise earlier screening or a genetic test (BRCA). Carrying the gene does not mean illness is certain, just a higher, manageable risk. See a specialist. 💗',
    },
  },
  {
    key: 'age',
    category: 'general',
    pattern: /(سن|عمر|شحال عندي|âge|\bage\b|young|شابة|كبيرة فالسن)/i,
    related: ['mammography', 'self_check', 'genetics'],
    disclaimer: true,
    responses: {
      ar: 'الخطر كيزيد مع التقدّم فالسن، خصوصاً بعد 40 عام، ومتوسط سن التشخيص فالمغرب هو 48. ولكن انتبهي 🎀: سرطان الثدي كيقدر يصيب حتى الشابات، حيت ماكاينش سن «آمن» تماماً. لهاد السبب الفحص الذاتي الشهري مهم فأي سن، والماموغرافيا كتنصح من 40 فما فوق. استشيري الطبيب باش يحدّد ليك برنامج الفحص المناسب لعمرك. 💗',
      fr: 'Le risque augmente avec l’âge, surtout après 40 ans, et l’âge moyen au diagnostic au Maroc est de 48 ans. Mais attention 🎀 : le cancer du sein peut aussi toucher les jeunes femmes — il n’y a pas d’âge totalement « sûr ». C’est pourquoi l’auto-examen mensuel compte à tout âge, et la mammographie est conseillée dès 40 ans. Un médecin établira le suivi adapté à votre âge. 💗',
      en: 'Risk rises with age, especially after 40, and the average age at diagnosis in Morocco is 48. But take note 🎀: breast cancer can also affect young women — there is no fully "safe" age. That is why a monthly self-check matters at any age, and mammograms are advised from 40. A doctor can set the screening plan that fits your age. 💗',
    },
  },
  {
    key: 'greeting',
    category: 'greeting',
    pattern: /(مرحبا|سلام|اهلا|أهلا|صباح|مساء|hello|hi|hey|bonjour|salut|coucou|labas|لاباس)/i,
    related: ['symptoms', 'self_check', 'prevention'],
    disclaimer: false,
    responses: {
      ar: 'مرحبا بيك فصحّتك! 🎀 أنا هنا باش نعاونك تفهمي صحة الثدي بلا خوف ولا حكم. تقدري تسوليني على الأعراض، الفحص الذاتي، الوقاية، أو أي سؤال آخر. شنو حابة تعرفي اليوم؟ 💗',
      fr: 'Bienvenue sur Sahtek ! 🎀 Je suis là pour vous aider à comprendre la santé du sein, sans peur ni jugement. Vous pouvez m’interroger sur les symptômes, l’auto-examen, la prévention ou toute autre question. Que souhaitez-vous savoir aujourd’hui ? 💗',
      en: 'Welcome to Sahtek! 🎀 I am here to help you understand breast health, without fear or judgement. You can ask me about symptoms, self-checks, prevention or anything else. What would you like to know today? 💗',
    },
  },
  {
    key: 'thanks',
    category: 'general',
    pattern: /(شكرا|شكرًا|تبارك الله|merci|thank|thanks|thx)/i,
    related: ['self_check', 'reminder'],
    disclaimer: false,
    responses: {
      ar: 'العفو، هادشي من واجبي! 💗 تذكّري: العناية بصحتك ماشي رفاهية، هي حق ديالك. رجعي ليا أي وقت عندك سؤال، وما تنسايش الفحص الذاتي ديال هاد الشهر. خّليك بخير! 🎀',
      fr: 'Avec plaisir, c’est mon rôle ! 💗 Rappelez-vous : prendre soin de votre santé n’est pas un luxe, c’est votre droit. Revenez quand vous voulez, et n’oubliez pas votre auto-examen du mois. Prenez soin de vous ! 🎀',
      en: 'You are very welcome — that is what I am here for! 💗 Remember: caring for your health is not a luxury, it is your right. Come back any time, and do not forget your self-check this month. Take care! 🎀',
    },
  },
];

/** First message shown when the chat opens. */
export const greetingMessage: Record<Language, string> = {
  ar: 'مرحبا بيك! 🎀 أنا مساعدة صحّتك. سوليني على أي حاجة بخصوص سرطان الثدي، الفحص الذاتي، أو الوقاية — أنا هنا باش نعاونك بلا حكم. 💗',
  fr: 'Bonjour ! 🎀 Je suis l’assistante Sahtek. Posez-moi toutes vos questions sur le cancer du sein, l’auto-examen ou la prévention — je suis là pour vous, sans jugement. 💗',
  en: 'Hello! 🎀 I am the Sahtek assistant. Ask me anything about breast cancer, self-checks or prevention — I am here for you, without judgement. 💗',
};

/** Returned when no category matches. */
export const fallbackResponse: Record<Language, string> = {
  ar: 'سؤال مهم! 💗 أنا متخصّصة فالتوعية بسرطان الثدي، فنقدر نعاونك أكثر فهاد المواضيع: الأعراض، الفحص الذاتي، الوقاية، الماموغرافيا، أو الدعم النفسي. إلا كان سؤالك على صحتك بشكل خاص، أحسن حد يجاوبك هو طبيب مختص. جرّبي تسوليني بطريقة أخرى. 🎀',
  fr: 'Bonne question ! 💗 Je suis spécialisée dans la sensibilisation au cancer du sein. Je peux surtout vous aider sur : les symptômes, l’auto-examen, la prévention, la mammographie ou le soutien émotionnel. Pour une question sur votre santé personnelle, le mieux est un médecin spécialiste. Reformulez votre question si vous voulez. 🎀',
  en: 'Good question! 💗 I specialise in breast cancer awareness. I can best help with: symptoms, self-checks, prevention, mammograms or emotional support. For a question about your personal health, a specialist doctor is the best person to ask. Feel free to rephrase your question. 🎀',
};
