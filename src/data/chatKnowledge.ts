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
    pattern: /(أعراض|اعراض|علامات|symptom|symptôm|signe|sign|كتلة|lump|síntoma|sintoma|signos|anzeichen|symptome|симптом|признак|sintomas|sinais)/i,
    related: ['self_check', 'prevention', 'when_to_see_doctor'],
    disclaimer: true,
    responses: {
      ar: 'العلامات اللي خاصك تراقبي 🎀:\n— كتلة فالثدي أو تحت الإبط\n— تغيّر فالشكل أو الحجم\n— احمرار أو تنقير الجلد (بحال قشرة البرتقالة)\n— إفرازات من الحلمة أو انكماشها\nأغلب التغييرات ماشي سرطان، ولكن إلا لاحظتي شي حاجة جديدة، ما تخافيش وسيري عند الطبيب باش يطمّنك. 💗',
      fr: 'Les signes à surveiller 🎀 :\n— une masse dans le sein ou sous l’aisselle\n— un changement de forme ou de taille\n— une rougeur ou un capitonnage de la peau\n— un écoulement du mamelon ou une rétraction\nLa plupart des changements ne sont pas un cancer, mais si vous remarquez quelque chose de nouveau, consultez un médecin pour être rassurée. 💗',
      en: 'Signs to watch for 🎀:\n— a lump in the breast or underarm\n— a change in shape or size\n— redness or dimpling of the skin\n— nipple discharge or retraction\nMost changes are not cancer, but if you notice anything new, do not worry alone — see a doctor to be reassured. 💗',
      es: 'Señales a vigilar 🎀:\n— un bulto en la mama o la axila\n— un cambio de forma o tamaño\n— enrojecimiento o hoyuelos en la piel\n— secreción o retracción del pezón\nLa mayoría de los cambios no son cáncer, pero si notas algo nuevo, no te preocupes sola — consulta a un médico para quedarte tranquila. 💗',
      de: 'Anzeichen, auf die du achten solltest 🎀:\n— ein Knoten in der Brust oder Achsel\n— eine Veränderung von Form oder Größe\n— Rötung oder Grübchen in der Haut\n— Austritt oder Einziehung der Brustwarze\nDie meisten Veränderungen sind kein Krebs, aber wenn du etwas Neues bemerkst, sorge dich nicht allein — geh zur Ärztin, um beruhigt zu sein. 💗',
      ru: 'Признаки, на которые стоит обратить внимание 🎀:\n— уплотнение в груди или подмышке\n— изменение формы или размера\n— покраснение или втяжение кожи\n— выделения или втяжение соска\nБольшинство изменений — не рак, но если вы заметили что-то новое, не переживайте в одиночку — обратитесь к врачу, чтобы успокоиться. 💗',
      pt: 'Sinais a observar 🎀:\n— um nódulo na mama ou na axila\n— uma mudança de forma ou tamanho\n— vermelhidão ou retração da pele\n— secreção ou retração do mamilo\nA maioria das mudanças não é câncer, mas se você notar algo novo, não se preocupe sozinha — procure um médico para ficar tranquila. 💗',
    },
  },
  {
    key: 'self_check',
    category: 'self_check',
    pattern: /(فحص ذاتي|فحص|كشف|auto.?exam|self.?check|examen|dépistage|screening|كيفاش نفحص|autoexamen|detección|deteccion|selbstuntersuchung|untersuchung|самообследование|обследование|autoexame|exame)/i,
    related: ['symptoms', 'reminder', 'prevention'],
    disclaimer: true,
    responses: {
      ar: 'الفحص الذاتي ساهل وكياخد 5 دقائق فالشهر 🩺:\n1. شوفي فالمرآة، يديك على الوركين\n2. رفعي يديك وعاودي شوفي\n3. فحصي بحركات دائرية وقفة\n4. عاودي مستلقية\n5. شوفي الحلمة\nأحسن وقت هو من 3 ل5 أيام بعد الدورة. عندنا دليل كامل مع مؤقّت فالتطبيق! إلا حسّيتي بشي حاجة، استشيري الطبيب. 💗',
      fr: 'L’auto-examen est simple et prend 5 minutes par mois 🩺 :\n1. Observez dans le miroir, mains sur les hanches\n2. Levez les bras et observez à nouveau\n3. Palpez debout en mouvements circulaires\n4. Recommencez allongée\n5. Vérifiez le mamelon\nLe meilleur moment : 3 à 5 jours après les règles. Un guide complet avec minuteur vous attend dans l’app ! En cas de doute, consultez un médecin. 💗',
      en: 'A self-check is simple and takes 5 minutes a month 🩺:\n1. Look in the mirror, hands on hips\n2. Raise your arms and look again\n3. Feel standing, in circular motions\n4. Repeat lying down\n5. Check the nipple\nBest time: 3–5 days after your period. A full guided check with a timer is in the app! If anything feels off, see a doctor. 💗',
      es: 'El autoexamen es sencillo y lleva 5 minutos al mes 🩺:\n1. Mírate en el espejo, manos en las caderas\n2. Levanta los brazos y vuelve a mirar\n3. Palpa de pie, con movimientos circulares\n4. Repite tumbada\n5. Revisa el pezón\nMejor momento: 3 a 5 días después de la regla. ¡En la app tienes una guía completa con temporizador! Si algo te parece raro, consulta a un médico. 💗',
      de: 'Eine Selbstuntersuchung ist einfach und dauert 5 Minuten im Monat 🩺:\n1. Schau in den Spiegel, Hände in die Hüften\n2. Heb die Arme und schau erneut\n3. Taste im Stehen, in kreisenden Bewegungen\n4. Wiederhole im Liegen\n5. Prüfe die Brustwarze\nBeste Zeit: 3 bis 5 Tage nach der Periode. In der App findest du eine vollständige geführte Untersuchung mit Timer! Wenn sich etwas falsch anfühlt, geh zur Ärztin. 💗',
      ru: 'Самообследование простое и занимает 5 минут в месяц 🩺:\n1. Посмотрите в зеркало, руки на бёдрах\n2. Поднимите руки и посмотрите снова\n3. Прощупайте стоя, круговыми движениями\n4. Повторите лёжа\n5. Проверьте сосок\nЛучшее время: через 3–5 дней после месячных. В приложении есть полное пошаговое обследование с таймером! Если что-то не так, обратитесь к врачу. 💗',
      pt: 'O autoexame é simples e leva 5 minutos por mês 🩺:\n1. Olhe no espelho, mãos nos quadris\n2. Levante os braços e olhe de novo\n3. Apalpe em pé, em movimentos circulares\n4. Repita deitada\n5. Verifique o mamilo\nMelhor hora: 3 a 5 dias após a menstruação. No app há um exame guiado completo com cronômetro! Se algo parecer estranho, procure um médico. 💗',
    },
  },
  {
    key: 'mammography',
    category: 'treatment',
    pattern: /(ماموغراف|mammogr|أشعة|اشعة|radiograph|ماموغ|mamografía|mamografia|mammographie|маммограф|mamografi)/i,
    related: ['self_check', 'prevention', 'age'],
    disclaimer: true,
    responses: {
      ar: 'الماموغرافيا هي صورة بالأشعة كتساعد فالكشف المبكر، حتى قبل ما تبان شي كتلة 🔬. كتنصح عموماً للنساء من 40 عام فما فوق، أو بكري إلا كان تاريخ عائلي. جرعة الإشعاع ضعيفة جداً وآمنة. هي ماشي بديلة للفحص الذاتي ولكن كتكمّلو. خاصك تستشيري الطبيب باش يحدّد ليك الوقت المناسب. 💗',
      fr: 'La mammographie est une radiographie qui aide à la détection précoce, avant même qu’une masse soit palpable 🔬. Elle est généralement recommandée dès 40 ans, ou plus tôt en cas d’antécédents familiaux. La dose de rayonnement est très faible et sûre. Elle ne remplace pas l’auto-examen mais le complète. Consultez un médecin pour le bon moment. 💗',
      en: 'A mammogram is an X-ray that helps with early detection, even before a lump can be felt 🔬. It is generally recommended from age 40, or earlier with a family history. The radiation dose is very low and safe. It does not replace a self-check but completes it. Talk to a doctor about the right time for you. 💗',
      es: 'La mamografía es una radiografía que ayuda a la detección temprana, incluso antes de que se palpe un bulto 🔬. Suele recomendarse a partir de los 40 años, o antes si hay antecedentes familiares. La dosis de radiación es muy baja y segura. No sustituye el autoexamen, pero lo complementa. Habla con un médico sobre el momento adecuado para ti. 💗',
      de: 'Eine Mammografie ist eine Röntgenaufnahme, die bei der Früherkennung hilft, sogar bevor ein Knoten zu fühlen ist 🔬. Sie wird in der Regel ab 40 Jahren empfohlen, oder früher bei Familiengeschichte. Die Strahlendosis ist sehr gering und sicher. Sie ersetzt keine Selbstuntersuchung, sondern ergänzt sie. Sprich mit einer Ärztin über den richtigen Zeitpunkt für dich. 💗',
      ru: 'Маммография — это рентген, который помогает раннему выявлению, ещё до того как уплотнение можно прощупать 🔬. Обычно её рекомендуют с 40 лет или раньше при семейной истории. Доза облучения очень мала и безопасна. Она не заменяет самообследование, а дополняет его. Поговорите с врачом о подходящем для вас времени. 💗',
      pt: 'A mamografia é um raio-X que ajuda na detecção precoce, mesmo antes de um nódulo poder ser sentido 🔬. Em geral é recomendada a partir dos 40 anos, ou antes com histórico familiar. A dose de radiação é muito baixa e segura. Ela não substitui o autoexame, mas o complementa. Converse com um médico sobre a hora certa para você. 💗',
    },
  },
  {
    key: 'treatment',
    category: 'treatment',
    pattern: /(علاج|شفاء|guérison|traitement|treatment|cure|chimio|chemo|chirurgie|surgery|tratamiento|cura|behandlung|heilung|лечение|терапи|tratamento)/i,
    related: ['symptoms', 'emotional_support', 'mammography'],
    disclaimer: true,
    responses: {
      ar: 'علاج سرطان الثدي تقدّم بزّاف 💪. كاينة عدة طرق: الجراحة، العلاج الكيميائي، الإشعاعي، والهرموني — والطبيب كيختار اللي مناسب لكل حالة. أهم حاجة: ملي يتكتشف بكري، نسبة الشفاء كتوصل ل99٪. إلا عندك أسئلة على حالة معينة، الطبيب المختص هو اللي يقدر يجاوبك بدقة. ما تبقايش وحدك مع أسئلتك. 💗',
      fr: 'Le traitement du cancer du sein a beaucoup progressé 💪. Plusieurs approches existent : chirurgie, chimiothérapie, radiothérapie, hormonothérapie — le médecin choisit selon chaque cas. L’essentiel : détecté tôt, le taux de survie atteint 99 %. Pour une situation précise, seul un médecin spécialiste peut répondre avec exactitude. Ne restez pas seule avec vos questions. 💗',
      en: 'Breast cancer treatment has advanced enormously 💪. Several approaches exist: surgery, chemotherapy, radiotherapy, hormone therapy — a doctor chooses based on each case. The key point: caught early, survival reaches 99%. For a specific situation, only a specialist doctor can answer precisely. Do not stay alone with your questions. 💗',
      es: 'El tratamiento del cáncer de mama ha avanzado enormemente 💪. Existen varios enfoques: cirugía, quimioterapia, radioterapia, hormonoterapia — el médico elige según cada caso. Lo esencial: detectado a tiempo, la supervivencia llega al 99%. Para una situación concreta, solo un médico especialista puede responder con exactitud. No te quedes sola con tus preguntas. 💗',
      de: 'Die Behandlung von Brustkrebs hat enorme Fortschritte gemacht 💪. Es gibt mehrere Ansätze: Operation, Chemotherapie, Strahlentherapie, Hormontherapie — eine Ärztin wählt je nach Fall. Der Kernpunkt: früh erkannt erreicht das Überleben 99%. Für eine konkrete Situation kann nur eine Fachärztin genau antworten. Bleib mit deinen Fragen nicht allein. 💗',
      ru: 'Лечение рака груди значительно продвинулось 💪. Есть несколько подходов: операция, химиотерапия, лучевая терапия, гормональная терапия — врач выбирает в зависимости от случая. Главное: при раннем выявлении выживаемость достигает 99%. В конкретной ситуации точно ответить может только врач-специалист. Не оставайтесь со своими вопросами в одиночку. 💗',
      pt: 'O tratamento do câncer de mama avançou muito 💪. Existem várias abordagens: cirurgia, quimioterapia, radioterapia, terapia hormonal — o médico escolhe conforme cada caso. O essencial: detectado cedo, a sobrevivência chega a 99%. Para uma situação específica, só um médico especialista pode responder com precisão. Não fique sozinha com suas perguntas. 💗',
    },
  },
  {
    key: 'prevention',
    category: 'prevention',
    pattern: /(وقاية|حماية|prévent|prevent|protection|نتجنّب|كيفاش نوقّي|prevención|prevencion|protección|proteccion|vorbeugung|prävention|pravention|schutz|профилактика|защита|prevenção|prevencao|proteção|protecao)/i,
    related: ['diet', 'exercise', 'self_check'],
    disclaimer: true,
    responses: {
      ar: 'ماتقدريش تتحكمي فكل شي، ولكن كاينة عادات كتنقص الخطر 🌿:\n— رياضة منتظمة (30 دقيقة فاليوم)\n— أكل صحي غني بالخضر والفواكه\n— وزن صحي\n— تجنّبي التدخين والكحول\n— الرضاعة الطبيعية إلا أمكن\n— الفحص الذاتي كل شهر\nهاد العادات كتحميك ماشي غير من سرطان الثدي، حتى من أمراض أخرى. استشيري الطبيب على فحوصات منتظمة. 💗',
      fr: 'On ne contrôle pas tout, mais certaines habitudes réduisent le risque 🌿 :\n— activité physique régulière (30 min/jour)\n— alimentation saine, riche en fruits et légumes\n— poids santé\n— éviter tabac et alcool\n— allaiter si possible\n— auto-examen chaque mois\nCes habitudes vous protègent au-delà du cancer du sein. Demandez à un médecin un suivi régulier. 💗',
      en: 'You cannot control everything, but some habits lower the risk 🌿:\n— regular physical activity (30 min/day)\n— a healthy diet rich in fruit and vegetables\n— a healthy weight\n— avoiding tobacco and alcohol\n— breastfeeding when possible\n— a monthly self-check\nThese habits protect you beyond breast cancer. Ask a doctor about regular check-ups. 💗',
      es: 'No puedes controlarlo todo, pero algunos hábitos reducen el riesgo 🌿:\n— actividad física regular (30 min/día)\n— una dieta sana rica en fruta y verdura\n— un peso saludable\n— evitar el tabaco y el alcohol\n— dar el pecho cuando sea posible\n— un autoexamen mensual\nEstos hábitos te protegen más allá del cáncer de mama. Pregunta a un médico por revisiones regulares. 💗',
      de: 'Du kannst nicht alles kontrollieren, aber einige Gewohnheiten senken das Risiko 🌿:\n— regelmäßige körperliche Aktivität (30 Min/Tag)\n— eine gesunde Ernährung reich an Obst und Gemüse\n— ein gesundes Gewicht\n— Tabak und Alkohol vermeiden\n— wenn möglich stillen\n— eine monatliche Selbstuntersuchung\nDiese Gewohnheiten schützen dich über Brustkrebs hinaus. Frag eine Ärztin nach regelmäßigen Kontrollen. 💗',
      ru: 'Вы не можете контролировать всё, но некоторые привычки снижают риск 🌿:\n— регулярная физическая активность (30 мин/день)\n— здоровое питание, богатое фруктами и овощами\n— здоровый вес\n— отказ от табака и алкоголя\n— грудное вскармливание, если возможно\n— ежемесячное самообследование\nЭти привычки защищают вас не только от рака груди. Спросите врача о регулярных осмотрах. 💗',
      pt: 'Você não pode controlar tudo, mas alguns hábitos reduzem o risco 🌿:\n— atividade física regular (30 min/dia)\n— uma alimentação saudável rica em frutas e verduras\n— um peso saudável\n— evitar tabaco e álcool\n— amamentar quando possível\n— um autoexame mensal\nEsses hábitos protegem você para além do câncer de mama. Pergunte a um médico sobre exames regulares. 💗',
    },
  },
  {
    key: 'fear',
    category: 'emotional_support',
    pattern: /(خوف|خايفة|قلق|قلقانة|scared|afraid|peur|inquièt|anxious|worried|نخاف|stress|miedo|preocupada|angst|sorge|страх|боюсь|беспокойство|тревога|medo|preocupada|preocupado|ansiosa)/i,
    related: ['self_check', 'symptoms', 'treatment'],
    disclaimer: true,
    responses: {
      ar: 'أنا فاهمة، الخوف حاجة طبيعية بزّاف ولا عيب فيه 💗. ولكن تعرفي؟ المعرفة هي أقوى سلاح ضد الخوف. ملي تفهمي جسمك وتديري الفحص بانتظام، كتولّي مرتاحة أكثر. تذكّري: أغلب التغييرات فالثدي ماشي سرطان، والكشف المبكر كيوصل ل99٪ نسبة شفاء. ما تبقايش وحدك — هضري مع طبيب أو مع حد قريب ليك. راكي قوية، وحنا معاك. 🎀',
      fr: 'Je comprends, la peur est tout à fait naturelle et il n’y a aucune honte à la ressentir 💗. Mais vous savez ? Le savoir est l’arme la plus puissante contre la peur. En comprenant votre corps et en vous examinant régulièrement, vous serez plus sereine. Rappelez-vous : la plupart des changements ne sont pas un cancer, et la détection précoce atteint 99 % de survie. Ne restez pas seule — parlez à un médecin ou à un proche. Vous êtes forte, et nous sommes avec vous. 🎀',
      en: 'I understand — fear is completely natural and there is no shame in feeling it 💗. But you know what? Knowledge is the most powerful weapon against fear. Understanding your body and checking regularly will make you calmer. Remember: most breast changes are not cancer, and early detection reaches 99% survival. Do not stay alone — talk to a doctor or someone close to you. You are strong, and we are with you. 🎀',
      es: 'Te entiendo — el miedo es completamente natural y no hay vergüenza en sentirlo 💗. Pero ¿sabes qué? El conocimiento es el arma más poderosa contra el miedo. Entender tu cuerpo y revisarte con regularidad te dará más calma. Recuerda: la mayoría de los cambios en la mama no son cáncer, y la detección temprana alcanza el 99% de supervivencia. No te quedes sola — habla con un médico o con alguien cercano. Eres fuerte, y estamos contigo. 🎀',
      de: 'Ich verstehe dich — Angst ist völlig natürlich und es ist keine Schande, sie zu fühlen 💗. Aber weißt du was? Wissen ist die stärkste Waffe gegen die Angst. Deinen Körper zu verstehen und dich regelmäßig zu untersuchen macht dich ruhiger. Denk daran: Die meisten Brustveränderungen sind kein Krebs, und Früherkennung erreicht 99% Überleben. Bleib nicht allein — sprich mit einer Ärztin oder einem nahen Menschen. Du bist stark, und wir sind bei dir. 🎀',
      ru: 'Я понимаю — страх совершенно естественен, и в нём нет ничего постыдного 💗. Но знаете что? Знание — самое сильное оружие против страха. Понимание своего тела и регулярные проверки сделают вас спокойнее. Помните: большинство изменений груди — не рак, а раннее выявление даёт 99% выживаемости. Не оставайтесь одна — поговорите с врачом или близким человеком. Вы сильная, и мы рядом с вами. 🎀',
      pt: 'Eu entendo — o medo é completamente natural e não há vergonha em senti-lo 💗. Mas sabe de uma coisa? O conhecimento é a arma mais poderosa contra o medo. Entender o seu corpo e se examinar com regularidade deixará você mais tranquila. Lembre-se: a maioria das mudanças na mama não é câncer, e a detecção precoce chega a 99% de sobrevivência. Não fique sozinha — fale com um médico ou alguém próximo. Você é forte, e estamos com você. 🎀',
    },
  },
  {
    key: 'myths',
    category: 'myths',
    pattern: /(خراف|myth|mythe|صحيح ولا|كذب|faux|vrai ou|mito|verdadero o falso|falso|mythos|wahr oder falsch|миф|правда или|mito|verdade ou)/i,
    related: ['prevention', 'genetics', 'mammography'],
    disclaimer: true,
    responses: {
      ar: 'خلّينا نوضّحو شي خرافات مشهورة ✅:\n— «الكتلة معناها سرطان» → غالط، أغلب الكتل حميدة\n— «بلا تاريخ عائلي راني فأمان» → غالط، 85٪ ماعندهمش تاريخ عائلي\n— «الماموغرافيا كتسبب السرطان» → غالط، آمنة تماماً\n— «مزيل العرق كيسبب السرطان» → غالط، ماكاينش دليل علمي\nالحقائق كتطمّنك أكثر من الخرافات. إلا عندك سؤال على شي اعتقاد، سوليني أو سولي الطبيب. 💗',
      fr: 'Clarifions quelques mythes répandus ✅ :\n— « une masse = cancer » → faux, la plupart sont bénignes\n— « sans antécédent familial je suis à l’abri » → faux, 85 % n’en ont aucun\n— « la mammographie cause le cancer » → faux, elle est sûre\n— « le déodorant cause le cancer » → faux, aucune preuve scientifique\nLes faits rassurent plus que les mythes. Pour toute croyance, demandez-moi ou consultez un médecin. 💗',
      en: 'Let us clear up some common myths ✅:\n— "a lump means cancer" → false, most are benign\n— "no family history means I am safe" → false, 85% have none\n— "mammograms cause cancer" → false, they are safe\n— "deodorant causes cancer" → false, no scientific evidence\nFacts reassure more than myths. For any belief you are unsure about, ask me or a doctor. 💗',
      es: 'Aclaremos algunos mitos comunes ✅:\n— «un bulto significa cáncer» → falso, la mayoría son benignos\n— «sin antecedentes familiares estoy a salvo» → falso, el 85% no tienen ninguno\n— «las mamografías causan cáncer» → falso, son seguras\n— «el desodorante causa cáncer» → falso, sin pruebas científicas\nLos hechos tranquilizan más que los mitos. Para cualquier creencia que te genere dudas, pregúntame o consulta a un médico. 💗',
      de: 'Räumen wir ein paar verbreitete Mythen aus ✅:\n— „ein Knoten bedeutet Krebs“ → falsch, die meisten sind gutartig\n— „ohne Familiengeschichte bin ich sicher“ → falsch, 85% haben keine\n— „Mammografien verursachen Krebs“ → falsch, sie sind sicher\n— „Deodorant verursacht Krebs“ → falsch, kein wissenschaftlicher Beweis\nFakten beruhigen mehr als Mythen. Bei jedem Glauben, bei dem du unsicher bist, frag mich oder eine Ärztin. 💗',
      ru: 'Развеем несколько распространённых мифов ✅:\n— «уплотнение означает рак» → неверно, большинство доброкачественные\n— «без семейной истории я в безопасности» → неверно, у 85% её нет\n— «маммография вызывает рак» → неверно, она безопасна\n— «дезодорант вызывает рак» → неверно, нет научных доказательств\nФакты успокаивают больше, чем мифы. О любом убеждении, в котором вы не уверены, спросите меня или врача. 💗',
      pt: 'Vamos esclarecer alguns mitos comuns ✅:\n— «um nódulo significa câncer» → falso, a maioria é benigna\n— «sem histórico familiar estou segura» → falso, 85% não têm nenhum\n— «mamografias causam câncer» → falso, são seguras\n— «desodorante causa câncer» → falso, sem evidência científica\nOs fatos tranquilizam mais que os mitos. Para qualquer crença em que tenha dúvida, pergunte a mim ou a um médico. 💗',
    },
  },
  {
    key: 'diet',
    category: 'diet',
    pattern: /(أكل|ماكلة|تغذية|diet|aliment|nutrition|food|ناكل|manger|comida|alimentación|alimentacion|dieta|comer|ernährung|ernahrung|essen|nahrung|питание|еда|пища|alimentação|alimentacao|comida)/i,
    related: ['prevention', 'exercise'],
    disclaimer: true,
    responses: {
      ar: 'التغذية الصحية كتساعد فالوقاية 🥗:\n— زيدي الخضر والفواكه الملوّنة\n— الحبوب الكاملة بدل المكرّرة\n— زيت الزيتون والمكسّرات\n— قلّلي من اللحوم المصنّعة والسكّر والدهون\n— قلّلي من الكحول\nالهدف ماشي حمية قاسية، بل توازن وانتظام. أكل صحي + وزن صحي = حماية أحسن. للنصائح الخاصة بصحتك، استشيري طبيب أو أخصائي تغذية. 💗',
      fr: 'Une alimentation saine aide à la prévention 🥗 :\n— plus de fruits et légumes colorés\n— des céréales complètes plutôt que raffinées\n— huile d’olive et fruits à coque\n— moins de viandes transformées, de sucre et de graisses\n— moins d’alcool\nLe but n’est pas un régime strict, mais l’équilibre et la régularité. Pour des conseils adaptés, consultez un médecin ou un nutritionniste. 💗',
      en: 'A healthy diet supports prevention 🥗:\n— more colourful fruit and vegetables\n— whole grains rather than refined ones\n— olive oil and nuts\n— less processed meat, sugar and fat\n— less alcohol\nThe goal is not a strict diet, but balance and consistency. For advice tailored to you, see a doctor or a nutritionist. 💗',
      es: 'Una alimentación sana apoya la prevención 🥗:\n— más fruta y verdura de colores\n— cereales integrales en lugar de refinados\n— aceite de oliva y frutos secos\n— menos carne procesada, azúcar y grasa\n— menos alcohol\nEl objetivo no es una dieta estricta, sino el equilibrio y la constancia. Para consejos adaptados a ti, consulta a un médico o a un nutricionista. 💗',
      de: 'Eine gesunde Ernährung unterstützt die Vorbeugung 🥗:\n— mehr buntes Obst und Gemüse\n— Vollkorn statt raffinierter Produkte\n— Olivenöl und Nüsse\n— weniger verarbeitetes Fleisch, Zucker und Fett\n— weniger Alkohol\nDas Ziel ist keine strenge Diät, sondern Ausgewogenheit und Beständigkeit. Für auf dich zugeschnittene Ratschläge geh zu einer Ärztin oder einer Ernährungsberaterin. 💗',
      ru: 'Здоровое питание поддерживает профилактику 🥗:\n— больше разноцветных фруктов и овощей\n— цельные злаки вместо очищенных\n— оливковое масло и орехи\n— меньше переработанного мяса, сахара и жира\n— меньше алкоголя\nЦель — не строгая диета, а баланс и постоянство. За индивидуальными советами обратитесь к врачу или диетологу. 💗',
      pt: 'Uma alimentação saudável apoia a prevenção 🥗:\n— mais frutas e verduras coloridas\n— grãos integrais em vez de refinados\n— azeite de oliva e oleaginosas\n— menos carne processada, açúcar e gordura\n— menos álcool\nO objetivo não é uma dieta rígida, mas equilíbrio e constância. Para conselhos adaptados a você, procure um médico ou um nutricionista. 💗',
    },
  },
  {
    key: 'exercise',
    category: 'exercise',
    pattern: /(رياضة|تمارين|exercice|sport|exercise|activité physique|نتحرّك|ejercicio|deporte|actividad física|actividad fisica|bewegung|sport treiben|körperliche aktivität|спорт|упражнен|физическая активность|exercício|exercicio|atividade física|atividade fisica)/i,
    related: ['prevention', 'diet'],
    disclaimer: true,
    responses: {
      ar: 'الرياضة من أقوى عوامل الوقاية 🏃‍♀️! 30 دقيقة فاليوم كتنقص الخطر بشكل ملحوظ. ماشي ضروري قاعة رياضية — المشي بسرعة، الرقص، أو السباحة كافيين. الرياضة كتساعد على وزن صحي، كتنظّم الهرمونات، وكتحسّن المزاج. ابدئي بشوية وزيدي شوية بشوية. جسمك غادي يشكرك! للنصائح المناسبة لحالتك الصحية، استشيري طبيب. 💗',
      fr: 'L’activité physique est l’un des plus puissants facteurs de prévention 🏃‍♀️ ! 30 minutes par jour réduisent nettement le risque. Pas besoin de salle — marche rapide, danse ou natation suffisent. Le sport aide à garder un poids santé, régule les hormones et améliore l’humeur. Commencez doucement et augmentez progressivement. Votre corps vous remerciera ! Pour des conseils adaptés, consultez un médecin. 💗',
      en: 'Exercise is one of the most powerful prevention factors 🏃‍♀️! 30 minutes a day clearly lowers the risk. No gym needed — brisk walking, dancing or swimming are enough. Activity helps keep a healthy weight, balances hormones and lifts your mood. Start gently and build up gradually. Your body will thank you! For advice suited to your health, see a doctor. 💗',
      es: '¡El ejercicio es uno de los factores de prevención más potentes 🏃‍♀️! 30 minutos al día reducen claramente el riesgo. No hace falta gimnasio — caminar a buen ritmo, bailar o nadar bastan. La actividad ayuda a mantener un peso saludable, equilibra las hormonas y mejora el ánimo. Empieza con suavidad y aumenta poco a poco. ¡Tu cuerpo te lo agradecerá! Para consejos adecuados a tu salud, consulta a un médico. 💗',
      de: 'Bewegung ist einer der stärksten Vorsorgefaktoren 🏃‍♀️! 30 Minuten am Tag senken das Risiko deutlich. Kein Fitnessstudio nötig — zügiges Gehen, Tanzen oder Schwimmen genügen. Aktivität hilft, ein gesundes Gewicht zu halten, gleicht die Hormone aus und hebt die Stimmung. Fang sanft an und steigere dich nach und nach. Dein Körper wird es dir danken! Für auf deine Gesundheit abgestimmte Ratschläge geh zu einer Ärztin. 💗',
      ru: 'Физическая активность — один из самых сильных факторов профилактики 🏃‍♀️! 30 минут в день заметно снижают риск. Спортзал не нужен — достаточно быстрой ходьбы, танцев или плавания. Активность помогает держать здоровый вес, балансирует гормоны и поднимает настроение. Начинайте мягко и постепенно увеличивайте. Ваше тело скажет вам спасибо! За советами под ваше здоровье обратитесь к врачу. 💗',
      pt: 'A atividade física é um dos fatores de prevenção mais poderosos 🏃‍♀️! 30 minutos por dia reduzem claramente o risco. Não precisa de academia — caminhada rápida, dança ou natação bastam. A atividade ajuda a manter um peso saudável, equilibra os hormônios e melhora o humor. Comece com calma e aumente aos poucos. Seu corpo vai agradecer! Para conselhos adequados à sua saúde, procure um médico. 💗',
    },
  },
  {
    key: 'genetics',
    category: 'genetics',
    pattern: /(وراثة|وراثي|génétiqu|genetic|hérédit|عائلة|عائلي|family|familial|BRCA|genética|genetica|hereditario|familia|genetik|genetisch|vererbung|familiär|familie|генетик|наследствен|семья|семейн|genética|genetica|hereditário|família|familia)/i,
    related: ['prevention', 'mammography', 'risk'],
    disclaimer: true,
    responses: {
      ar: 'التاريخ العائلي كيرفع الخطر، ولكن خاصك تعرفي 🧬: 85٪ من النساء المصابات ماعندهمش أي تاريخ عائلي! يعني الوقاية تخص الجميع. إلا كانت الأم أو الأخت عندها سرطان الثدي، خبّري الطبيب — يمكن ينصحك بفحوصات بكري أو باختبار جيني (BRCA). وجود الجين ماشي معناه المرض أكيد، بل خطر أعلى يمكن التعامل معاه. استشيري طبيب مختص. 💗',
      fr: 'Les antécédents familiaux augmentent le risque, mais sachez-le 🧬 : 85 % des femmes touchées n’ont aucun antécédent familial ! La prévention concerne donc toutes. Si votre mère ou sœur a eu un cancer du sein, informez-en le médecin — il peut conseiller un dépistage précoce ou un test génétique (BRCA). Porter le gène ne signifie pas une maladie certaine, mais un risque plus élevé que l’on peut gérer. Consultez un spécialiste. 💗',
      en: 'A family history raises the risk, but know this 🧬: 85% of affected women have no family history at all! So prevention is for everyone. If your mother or sister had breast cancer, tell your doctor — they may advise earlier screening or a genetic test (BRCA). Carrying the gene does not mean illness is certain, just a higher, manageable risk. See a specialist. 💗',
      es: 'Los antecedentes familiares aumentan el riesgo, pero ten esto en cuenta 🧬: ¡el 85% de las mujeres afectadas no tienen ningún antecedente familiar! Así que la prevención es para todas. Si tu madre o hermana tuvo cáncer de mama, díselo a tu médico — puede aconsejar un cribado más temprano o una prueba genética (BRCA). Llevar el gen no significa que la enfermedad sea segura, solo un riesgo más alto y manejable. Consulta a un especialista. 💗',
      de: 'Eine Familiengeschichte erhöht das Risiko, aber wisse dies 🧬: 85% der betroffenen Frauen haben überhaupt keine Familiengeschichte! Vorbeugung ist also für alle da. Wenn deine Mutter oder Schwester Brustkrebs hatte, sag es deiner Ärztin — sie kann eine frühere Vorsorge oder einen Gentest (BRCA) empfehlen. Das Gen zu tragen bedeutet keine sichere Erkrankung, nur ein höheres, beherrschbares Risiko. Geh zu einer Fachärztin. 💗',
      ru: 'Семейная история повышает риск, но знайте 🧬: у 85% заболевших женщин вообще нет семейной истории! Поэтому профилактика нужна всем. Если у вашей матери или сестры был рак груди, скажите врачу — он может посоветовать более ранний скрининг или генетический тест (BRCA). Носительство гена не означает, что болезнь обязательно будет, лишь более высокий, управляемый риск. Обратитесь к специалисту. 💗',
      pt: 'O histórico familiar aumenta o risco, mas saiba disto 🧬: 85% das mulheres afetadas não têm nenhum histórico familiar! Então a prevenção é para todas. Se sua mãe ou irmã teve câncer de mama, conte ao seu médico — ele pode aconselhar um rastreamento mais cedo ou um teste genético (BRCA). Carregar o gene não significa doença certa, apenas um risco maior e administrável. Procure um especialista. 💗',
    },
  },
  {
    key: 'age',
    category: 'general',
    pattern: /(سن|عمر|شحال عندي|âge|\bage\b|young|شابة|كبيرة فالسن|edad|años|joven|mayor|alter|\bjahre\b|jung|älter|возраст|\bлет\b|молод|idade|\banos\b|jovem)/i,
    related: ['mammography', 'self_check', 'genetics'],
    disclaimer: true,
    responses: {
      ar: 'الخطر كيزيد مع التقدّم فالسن، خصوصاً بعد 40 عام، ومتوسط سن التشخيص فالمغرب هو 48. ولكن انتبهي 🎀: سرطان الثدي كيقدر يصيب حتى الشابات، حيت ماكاينش سن «آمن» تماماً. لهاد السبب الفحص الذاتي الشهري مهم فأي سن، والماموغرافيا كتنصح من 40 فما فوق. استشيري الطبيب باش يحدّد ليك برنامج الفحص المناسب لعمرك. 💗',
      fr: 'Le risque augmente avec l’âge, surtout après 40 ans, et l’âge moyen au diagnostic au Maroc est de 48 ans. Mais attention 🎀 : le cancer du sein peut aussi toucher les jeunes femmes — il n’y a pas d’âge totalement « sûr ». C’est pourquoi l’auto-examen mensuel compte à tout âge, et la mammographie est conseillée dès 40 ans. Un médecin établira le suivi adapté à votre âge. 💗',
      en: 'Risk rises with age, especially after 40, and the average age at diagnosis in Morocco is 48. But take note 🎀: breast cancer can also affect young women — there is no fully "safe" age. That is why a monthly self-check matters at any age, and mammograms are advised from 40. A doctor can set the screening plan that fits your age. 💗',
      es: 'El riesgo aumenta con la edad, sobre todo después de los 40, y la edad media de diagnóstico en Marruecos es de 48. Pero ten en cuenta 🎀: el cáncer de mama también puede afectar a mujeres jóvenes — no hay una edad totalmente «segura». Por eso un autoexamen mensual importa a cualquier edad, y la mamografía se aconseja desde los 40. Un médico puede fijar el plan de cribado que se ajuste a tu edad. 💗',
      de: 'Das Risiko steigt mit dem Alter, besonders nach 40, und das durchschnittliche Diagnosealter in Marokko ist 48. Aber beachte 🎀: Brustkrebs kann auch junge Frauen treffen — es gibt kein völlig „sicheres“ Alter. Deshalb ist eine monatliche Selbstuntersuchung in jedem Alter wichtig, und Mammografien werden ab 40 empfohlen. Eine Ärztin kann den Vorsorgeplan festlegen, der zu deinem Alter passt. 💗',
      ru: 'Риск растёт с возрастом, особенно после 40, а средний возраст диагноза в Марокко — 48. Но учтите 🎀: рак груди может затронуть и молодых женщин — полностью «безопасного» возраста нет. Поэтому ежемесячное самообследование важно в любом возрасте, а маммографию советуют с 40. Врач может составить план скрининга, подходящий вашему возрасту. 💗',
      pt: 'O risco aumenta com a idade, especialmente após os 40, e a idade média de diagnóstico em Marrocos é 48. Mas atenção 🎀: o câncer de mama também pode afetar mulheres jovens — não existe uma idade totalmente «segura». Por isso um autoexame mensal importa em qualquer idade, e a mamografia é aconselhada a partir dos 40. Um médico pode definir o plano de rastreamento adequado à sua idade. 💗',
    },
  },
  {
    key: 'greeting',
    category: 'greeting',
    pattern: /(مرحبا|سلام|اهلا|أهلا|صباح|مساء|hello|hi|hey|bonjour|salut|coucou|labas|لاباس|hola|buenos|buenas|hallo|guten|servus|привет|здравствуй|добрый день|olá|\bola\b|\boi\b|bom dia|boa tarde)/i,
    related: ['symptoms', 'self_check', 'prevention'],
    disclaimer: false,
    responses: {
      ar: 'مرحبا بيك فصحّتك! 🎀 أنا هنا باش نعاونك تفهمي صحة الثدي بلا خوف ولا حكم. تقدري تسوليني على الأعراض، الفحص الذاتي، الوقاية، أو أي سؤال آخر. شنو حابة تعرفي اليوم؟ 💗',
      fr: 'Bienvenue sur Sahtek ! 🎀 Je suis là pour vous aider à comprendre la santé du sein, sans peur ni jugement. Vous pouvez m’interroger sur les symptômes, l’auto-examen, la prévention ou toute autre question. Que souhaitez-vous savoir aujourd’hui ? 💗',
      en: 'Welcome to Sahtek! 🎀 I am here to help you understand breast health, without fear or judgement. You can ask me about symptoms, self-checks, prevention or anything else. What would you like to know today? 💗',
      es: '¡Bienvenida a Sahtek! 🎀 Estoy aquí para ayudarte a entender la salud mamaria, sin miedo ni juicios. Puedes preguntarme sobre síntomas, autoexámenes, prevención o cualquier otra cosa. ¿Qué te gustaría saber hoy? 💗',
      de: 'Willkommen bei Sahtek! 🎀 Ich bin hier, um dir zu helfen, die Brustgesundheit zu verstehen — ohne Angst oder Urteil. Du kannst mich zu Symptomen, Selbstuntersuchungen, Vorbeugung oder allem anderen fragen. Was möchtest du heute wissen? 💗',
      ru: 'Добро пожаловать в Sahtek! 🎀 Я здесь, чтобы помочь вам понять здоровье груди — без страха и осуждения. Вы можете спросить меня о симптомах, самообследовании, профилактике или о чём угодно ещё. Что вы хотели бы узнать сегодня? 💗',
      pt: 'Bem-vinda ao Sahtek! 🎀 Estou aqui para ajudar você a entender a saúde da mama — sem medo nem julgamento. Você pode me perguntar sobre sintomas, autoexames, prevenção ou qualquer outra coisa. O que gostaria de saber hoje? 💗',
    },
  },
  {
    key: 'thanks',
    category: 'general',
    pattern: /(شكرا|شكرًا|تبارك الله|merci|thank|thanks|thx|gracias|danke|vielen dank|спасибо|благодар|obrigada|obrigado)/i,
    related: ['self_check', 'reminder'],
    disclaimer: false,
    responses: {
      ar: 'العفو، هادشي من واجبي! 💗 تذكّري: العناية بصحتك ماشي رفاهية، هي حق ديالك. رجعي ليا أي وقت عندك سؤال، وما تنسايش الفحص الذاتي ديال هاد الشهر. خّليك بخير! 🎀',
      fr: 'Avec plaisir, c’est mon rôle ! 💗 Rappelez-vous : prendre soin de votre santé n’est pas un luxe, c’est votre droit. Revenez quand vous voulez, et n’oubliez pas votre auto-examen du mois. Prenez soin de vous ! 🎀',
      en: 'You are very welcome — that is what I am here for! 💗 Remember: caring for your health is not a luxury, it is your right. Come back any time, and do not forget your self-check this month. Take care! 🎀',
      es: '¡De nada — para eso estoy aquí! 💗 Recuerda: cuidar tu salud no es un lujo, es tu derecho. Vuelve cuando quieras, y no olvides tu autoexamen de este mes. ¡Cuídate! 🎀',
      de: 'Sehr gerne — dafür bin ich da! 💗 Denk daran: Auf deine Gesundheit zu achten ist kein Luxus, es ist dein Recht. Komm jederzeit wieder, und vergiss deine Selbstuntersuchung diesen Monat nicht. Pass auf dich auf! 🎀',
      ru: 'Пожалуйста — для этого я и здесь! 💗 Помните: заботиться о своём здоровье — не роскошь, это ваше право. Возвращайтесь в любое время и не забудьте о самообследовании в этом месяце. Берегите себя! 🎀',
      pt: 'De nada — é para isso que estou aqui! 💗 Lembre-se: cuidar da sua saúde não é um luxo, é o seu direito. Volte quando quiser, e não esqueça o seu autoexame deste mês. Cuide-se! 🎀',
    },
  },
];

/** First message shown when the chat opens. */
export const greetingMessage: Record<Language, string> = {
  ar: 'مرحبا بيك! 🎀 أنا مساعدة صحّتك. سوليني على أي حاجة بخصوص سرطان الثدي، الفحص الذاتي، أو الوقاية — أنا هنا باش نعاونك بلا حكم. 💗',
  fr: 'Bonjour ! 🎀 Je suis l’assistante Sahtek. Posez-moi toutes vos questions sur le cancer du sein, l’auto-examen ou la prévention — je suis là pour vous, sans jugement. 💗',
  en: 'Hello! 🎀 I am the Sahtek assistant. Ask me anything about breast cancer, self-checks or prevention — I am here for you, without judgement. 💗',
  es: '¡Hola! 🎀 Soy la asistente de Sahtek. Pregúntame lo que quieras sobre el cáncer de mama, los autoexámenes o la prevención — estoy aquí para ti, sin juicios. 💗',
  de: 'Hallo! 🎀 Ich bin die Sahtek-Assistentin. Frag mich alles über Brustkrebs, Selbstuntersuchungen oder Vorbeugung — ich bin für dich da, ohne Urteil. 💗',
  ru: 'Здравствуйте! 🎀 Я помощница Sahtek. Спросите меня о чём угодно про рак груди, самообследование или профилактику — я здесь для вас, без осуждения. 💗',
  pt: 'Olá! 🎀 Sou a assistente do Sahtek. Pergunte-me qualquer coisa sobre câncer de mama, autoexames ou prevenção — estou aqui para você, sem julgamento. 💗',
};

/** Returned when no category matches. */
export const fallbackResponse: Record<Language, string> = {
  ar: 'سؤال مهم! 💗 أنا متخصّصة فالتوعية بسرطان الثدي، فنقدر نعاونك أكثر فهاد المواضيع: الأعراض، الفحص الذاتي، الوقاية، الماموغرافيا، أو الدعم النفسي. إلا كان سؤالك على صحتك بشكل خاص، أحسن حد يجاوبك هو طبيب مختص. جرّبي تسوليني بطريقة أخرى. 🎀',
  fr: 'Bonne question ! 💗 Je suis spécialisée dans la sensibilisation au cancer du sein. Je peux surtout vous aider sur : les symptômes, l’auto-examen, la prévention, la mammographie ou le soutien émotionnel. Pour une question sur votre santé personnelle, le mieux est un médecin spécialiste. Reformulez votre question si vous voulez. 🎀',
  en: 'Good question! 💗 I specialise in breast cancer awareness. I can best help with: symptoms, self-checks, prevention, mammograms or emotional support. For a question about your personal health, a specialist doctor is the best person to ask. Feel free to rephrase your question. 🎀',
  es: '¡Buena pregunta! 💗 Estoy especializada en la concienciación sobre el cáncer de mama. Donde mejor puedo ayudarte es en: síntomas, autoexámenes, prevención, mamografías o apoyo emocional. Para una pregunta sobre tu salud personal, lo mejor es un médico especialista. Si quieres, reformula tu pregunta. 🎀',
  de: 'Gute Frage! 💗 Ich bin auf die Aufklärung über Brustkrebs spezialisiert. Am besten helfe ich bei: Symptomen, Selbstuntersuchungen, Vorbeugung, Mammografien oder emotionaler Unterstützung. Für eine Frage zu deiner persönlichen Gesundheit ist eine Fachärztin die beste Ansprechpartnerin. Formuliere deine Frage gern um. 🎀',
  ru: 'Хороший вопрос! 💗 Я специализируюсь на информировании о раке груди. Лучше всего я помогу с: симптомами, самообследованием, профилактикой, маммографией или эмоциональной поддержкой. По вопросу о вашем личном здоровье лучше всего обратиться к врачу-специалисту. Попробуйте переформулировать вопрос. 🎀',
  pt: 'Boa pergunta! 💗 Sou especializada na conscientização sobre o câncer de mama. Posso ajudar melhor com: sintomas, autoexames, prevenção, mamografias ou apoio emocional. Para uma pergunta sobre sua saúde pessoal, o melhor é um médico especialista. Sinta-se à vontade para reformular sua pergunta. 🎀',
};
