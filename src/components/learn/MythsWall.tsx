import { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const MYTHS_DATA = {
  ar: {
    row1: [
      { id:1, m:"سرطان الثدي كيجي غير عند الكبار فالسن", t:"يمكن يصيب أي وحدة فأي عمر حتى قبل 30" },
      { id:2, m:"إلا ما كاينش تاريخ عائلي ما كاين خطر", t:"85% من الحالات بلا تاريخ عائلي" },
      { id:3, m:"أي كورة فالثدي = سرطان", t:"أغلب الكتل حميدة ولكن خاصك تراجعي" },
      { id:4, m:"الفحص الذاتي كيبدل الماموغرافيا", t:"مكمّل ماشي بديل خاصك الاثنين" },
      { id:5, m:"الماموغرافيا كتسبب السرطان", t:"الأشعة ضعيفة بزاف وما فيهاش خطر" },
      { id:6, m:"الراجل ما يجيهش سرطان الثدي", t:"يمكن يصاب ولكن بنسبة أقل من 1%" },
      { id:7, m:"السوتيان الضيق كيسبب السرطان", t:"ما كاين حتى دليل علمي" },
      { id:8, m:"الديودورون كيسبب السرطان", t:"ما كاين حتى علاقة مثبتة" },
    ],
    row2: [
      { id:9, m:"الصدمة فالثدي كتسبب السرطان", t:"ممكن تكشف كتلة موجودة ماشي تسببها" },
      { id:10, m:"سرطان الثدي ديما كيقتل", t:"99% نسبة شفاء مع الكشف المبكر" },
      { id:11, m:"بلا أعراض = بلا مشكل", t:"فالبداية بلا أعراض الفحص ضروري" },
      { id:12, m:"السكر كيغذي السرطان", t:"ما كاين دليل ولكن الأكل الصحي مهم" },
      { id:13, m:"الهاتف قريب من الصدر خطير", t:"حتى دراسة ما أثبتات هاد الشي" },
      { id:14, m:"الخزعة كتنشر السرطان", t:"آمنة وضرورية وما كتنشرش المرض" },
      { id:15, m:"الأعشاب كافية للعلاج", t:"العلاج الطبي هو المثبت الأعشاب مكملة" },
    ],
    row3: [
      { id:16, m:"الثدي الصغير = خطر أقل", t:"الحجم ما عندو حتى علاقة بالخطر" },
      { id:17, m:"الحمل كيحمي نهائياً", t:"كيقلل الخطر ولكن ماشي 100%" },
      { id:18, m:"مرض ديال الدول الغنية", t:"كيصيب النساء فالعالم كلو بما فيهم المغرب" },
      { id:19, m:"الستريس كيسبب السرطان", t:"كيأثر على الصحة ولكن ماشي سبب مباشر" },
      { id:20, m:"ديما خاصك تقطعي الثدي", t:"كاينين خيارات جراحة جزئية كيميائي إشعاعي" },
      { id:21, m:"التجميل كيمنع الماموغرافيا", t:"يمكن تديريها بتقنيات خاصة" },
      { id:22, m:"سببو غير الوراثة", t:"غير 5-10% وراثي الباقي عوامل أخرى" },
    ],
  },
  fr: {
    row1: [
      { id:1, m:"Le cancer du sein touche seulement les femmes agees.", t:"Il peut toucher toute femme a tout age, meme avant 30 ans." },
      { id:2, m:"Sans antecedents familiaux, aucun risque.", t:"85% des cas sont sans aucun antecedent familial." },
      { id:3, m:"Toute boule dans le sein est un cancer.", t:"La plupart des masses sont benignes, mais consultez toujours un medecin." },
      { id:4, m:"Un auto-examen remplace la mammographie.", t:"Un auto-examen complete, il ne remplace pas — il faut les deux." },
      { id:5, m:"La mammographie cause le cancer par les rayons.", t:"La dose de rayons est tres faible et sans danger." },
      { id:6, m:"Un homme ne peut pas avoir un cancer du sein.", t:"Les hommes peuvent en avoir, mais dans moins de 1% des cas." },
      { id:7, m:"Un soutien-gorge serre cause le cancer.", t:"Aucune preuve scientifique ne le confirme." },
      { id:8, m:"Le deodorant cause le cancer du sein.", t:"Aucun lien scientifique prouve a ce jour." },
    ],
    row2: [
      { id:9, m:"Un coup au sein cause le cancer.", t:"Les coups ne causent pas le cancer mais peuvent reveler une masse existante." },
      { id:10, m:"Le cancer du sein est toujours mortel.", t:"Avec un depistage precoce, le taux de survie atteint 99%." },
      { id:11, m:"Pas de symptomes, donc aucun souci.", t:"Un cancer debutant est sans symptomes — un suivi regulier est essentiel." },
      { id:12, m:"Le lait et le sucre nourrissent le cancer.", t:"Aucune preuve, mais une alimentation saine aide a la prevention." },
      { id:13, m:"Un telephone pres de la poitrine cause le cancer.", t:"Aucune etude ne le prouve." },
      { id:14, m:"Une biopsie propage le cancer.", t:"La biopsie est sure et necessaire au diagnostic; elle ne propage pas la maladie." },
      { id:15, m:"Les plantes seules peuvent guerir le cancer.", t:"Le traitement medical est prouve. Les plantes completent, elles ne remplacent pas." },
    ],
    row3: [
      { id:16, m:"Des petits seins, moins de risque.", t:"La taille des seins est sans lien avec le risque." },
      { id:17, m:"La grossesse protege totalement du cancer.", t:"La grossesse reduit le risque mais ne protege pas a 100%." },
      { id:18, m:"Le cancer du sein touche les pays riches.", t:"Il touche les femmes partout, y compris au Maroc." },
      { id:19, m:"Le stress cause directement le cancer.", t:"Il agit sur la sante generale sans etre une cause directe." },
      { id:20, m:"Un diagnostic veut toujours dire ablation du sein.", t:"Il existe des options: chirurgie partielle, chimio, radiotherapie..." },
      { id:21, m:"La chirurgie esthetique empeche la mammographie.", t:"Elle reste possible avec des techniques speciales — informez votre medecin." },
      { id:22, m:"Le cancer du sein vient seulement de la genetique.", t:"Seuls 5-10% sont hereditaires, le reste vient de facteurs varies." },
    ],
  },
  en: {
    row1: [
      { id:1, m:"Breast cancer only affects older women.", t:"It can affect anyone at any age, even before 30." },
      { id:2, m:"No family history means no risk.", t:"85% of cases have no family history at all." },
      { id:3, m:"Any lump in the breast means cancer.", t:"Most lumps are benign, but always have a doctor check." },
      { id:4, m:"A self-exam replaces a mammogram.", t:"A self-exam complements, it does not replace — you need both." },
      { id:5, m:"Mammograms cause cancer from radiation.", t:"The radiation dose is very low and not harmful." },
      { id:6, m:"Men cannot get breast cancer.", t:"Men can get it too, but in under 1% of cases." },
      { id:7, m:"Tight bras cause breast cancer.", t:"There is no scientific evidence for this claim." },
      { id:8, m:"Deodorant causes breast cancer.", t:"No proven scientific link exists." },
    ],
    row2: [
      { id:9, m:"A blow to the breast causes cancer.", t:"Injuries do not cause cancer but may reveal an existing lump." },
      { id:10, m:"Breast cancer is always fatal.", t:"With early detection, the survival rate reaches 99%." },
      { id:11, m:"No symptoms means nothing is wrong.", t:"Early cancer has no symptoms — regular checks are essential." },
      { id:12, m:"Milk and sugar feed cancer.", t:"There is no proof, but healthy eating still helps prevention." },
      { id:13, m:"A phone near the chest causes cancer.", t:"No study has ever proven this." },
      { id:14, m:"A biopsy spreads cancer.", t:"A biopsy is safe and needed for diagnosis; it does not spread disease." },
      { id:15, m:"Herbs alone can cure cancer.", t:"Medical treatment is what is proven. Herbs complement, they do not replace." },
    ],
    row3: [
      { id:16, m:"Smaller breasts mean lower risk.", t:"Breast size has no link to the risk at all." },
      { id:17, m:"Pregnancy fully protects against cancer.", t:"Pregnancy lowers the risk but does not protect 100%." },
      { id:18, m:"Breast cancer is a disease of rich countries.", t:"It affects women in every country, including Morocco." },
      { id:19, m:"Stress directly causes cancer.", t:"It affects overall health but is not a direct cause." },
      { id:20, m:"A diagnosis always means removing the breast.", t:"There are options: partial surgery, chemo, radiotherapy..." },
      { id:21, m:"Cosmetic surgery prevents mammograms.", t:"It can still be done with special techniques — just tell your doctor." },
      { id:22, m:"Breast cancer is caused only by genetics.", t:"Only 5-10% is hereditary. The rest comes from other factors." },
    ],
  },
  es: {
    row1: [
      { id:1, m:"El cáncer de mama solo afecta a las mujeres mayores.", t:"Puede afectar a cualquiera a cualquier edad, incluso antes de los 30." },
      { id:2, m:"Sin antecedentes familiares no hay riesgo.", t:"El 85% de los casos no tienen ningún antecedente familiar." },
      { id:3, m:"Cualquier bulto en la mama significa cáncer.", t:"La mayoría de los bultos son benignos, pero siempre debe revisarlo un médico." },
      { id:4, m:"Un autoexamen sustituye a la mamografía.", t:"El autoexamen complementa, no sustituye — necesitas ambos." },
      { id:5, m:"Las mamografías causan cáncer por la radiación.", t:"La dosis de radiación es muy baja y no es perjudicial." },
      { id:6, m:"Los hombres no pueden tener cáncer de mama.", t:"Los hombres también pueden tenerlo, pero en menos del 1% de los casos." },
      { id:7, m:"Los sujetadores ajustados causan cáncer de mama.", t:"No hay ninguna prueba científica de esta afirmación." },
      { id:8, m:"El desodorante causa cáncer de mama.", t:"No existe ningún vínculo científico probado." },
    ],
    row2: [
      { id:9, m:"Un golpe en la mama causa cáncer.", t:"Las lesiones no causan cáncer, pero pueden revelar un bulto existente." },
      { id:10, m:"El cáncer de mama siempre es mortal.", t:"Con la detección temprana, la tasa de supervivencia llega al 99%." },
      { id:11, m:"Sin síntomas significa que no pasa nada.", t:"El cáncer temprano no tiene síntomas — los controles regulares son esenciales." },
      { id:12, m:"La leche y el azúcar alimentan el cáncer.", t:"No hay pruebas, pero comer sano ayuda a la prevención." },
      { id:13, m:"Un teléfono cerca del pecho causa cáncer.", t:"Ningún estudio lo ha demostrado nunca." },
      { id:14, m:"Una biopsia propaga el cáncer.", t:"La biopsia es segura y necesaria para el diagnóstico; no propaga la enfermedad." },
      { id:15, m:"Las hierbas por sí solas pueden curar el cáncer.", t:"El tratamiento médico es lo probado. Las hierbas complementan, no sustituyen." },
    ],
    row3: [
      { id:16, m:"Los pechos pequeños suponen menos riesgo.", t:"El tamaño de la mama no tiene ninguna relación con el riesgo." },
      { id:17, m:"El embarazo protege por completo del cáncer.", t:"El embarazo reduce el riesgo, pero no protege al 100%." },
      { id:18, m:"El cáncer de mama es una enfermedad de países ricos.", t:"Afecta a las mujeres de todos los países, incluida Marruecos." },
      { id:19, m:"El estrés causa directamente el cáncer.", t:"Afecta a la salud general, pero no es una causa directa." },
      { id:20, m:"Un diagnóstico siempre implica extirpar la mama.", t:"Hay opciones: cirugía parcial, quimioterapia, radioterapia..." },
      { id:21, m:"La cirugía estética impide las mamografías.", t:"Aún se pueden hacer con técnicas especiales — solo díselo a tu médico." },
      { id:22, m:"El cáncer de mama solo lo causa la genética.", t:"Solo el 5-10% es hereditario. El resto proviene de otros factores." },
    ],
  },
  de: {
    row1: [
      { id:1, m:"Brustkrebs betrifft nur ältere Frauen.", t:"Er kann jede in jedem Alter treffen, sogar vor 30." },
      { id:2, m:"Keine Familiengeschichte bedeutet kein Risiko.", t:"85% der Fälle haben überhaupt keine Familiengeschichte." },
      { id:3, m:"Jeder Knoten in der Brust bedeutet Krebs.", t:"Die meisten Knoten sind gutartig, aber lass sie immer ärztlich prüfen." },
      { id:4, m:"Eine Selbstuntersuchung ersetzt eine Mammografie.", t:"Eine Selbstuntersuchung ergänzt, sie ersetzt nicht — du brauchst beides." },
      { id:5, m:"Mammografien verursachen Krebs durch Strahlung.", t:"Die Strahlendosis ist sehr gering und nicht schädlich." },
      { id:6, m:"Männer können keinen Brustkrebs bekommen.", t:"Männer können ihn auch bekommen, aber in unter 1% der Fälle." },
      { id:7, m:"Enge BHs verursachen Brustkrebs.", t:"Für diese Behauptung gibt es keinen wissenschaftlichen Beweis." },
      { id:8, m:"Deodorant verursacht Brustkrebs.", t:"Es gibt keinen nachgewiesenen wissenschaftlichen Zusammenhang." },
    ],
    row2: [
      { id:9, m:"Ein Schlag auf die Brust verursacht Krebs.", t:"Verletzungen verursachen keinen Krebs, können aber einen bestehenden Knoten sichtbar machen." },
      { id:10, m:"Brustkrebs ist immer tödlich.", t:"Mit Früherkennung erreicht die Überlebensrate 99%." },
      { id:11, m:"Keine Symptome bedeutet, dass nichts falsch ist.", t:"Früher Krebs hat keine Symptome — regelmäßige Kontrollen sind unerlässlich." },
      { id:12, m:"Milch und Zucker nähren den Krebs.", t:"Es gibt keinen Beweis, aber gesunde Ernährung hilft trotzdem bei der Vorbeugung." },
      { id:13, m:"Ein Telefon nahe der Brust verursacht Krebs.", t:"Keine Studie hat das je bewiesen." },
      { id:14, m:"Eine Biopsie verbreitet den Krebs.", t:"Eine Biopsie ist sicher und für die Diagnose nötig; sie verbreitet die Krankheit nicht." },
      { id:15, m:"Kräuter allein können Krebs heilen.", t:"Die medizinische Behandlung ist das, was bewiesen ist. Kräuter ergänzen, sie ersetzen nicht." },
    ],
    row3: [
      { id:16, m:"Kleinere Brüste bedeuten geringeres Risiko.", t:"Die Brustgröße hat überhaupt keinen Zusammenhang mit dem Risiko." },
      { id:17, m:"Eine Schwangerschaft schützt vollständig vor Krebs.", t:"Eine Schwangerschaft senkt das Risiko, schützt aber nicht zu 100%." },
      { id:18, m:"Brustkrebs ist eine Krankheit reicher Länder.", t:"Er betrifft Frauen in jedem Land, auch in Marokko." },
      { id:19, m:"Stress verursacht direkt Krebs.", t:"Er beeinflusst die allgemeine Gesundheit, ist aber keine direkte Ursache." },
      { id:20, m:"Eine Diagnose bedeutet immer, die Brust zu entfernen.", t:"Es gibt Optionen: Teiloperation, Chemo, Strahlentherapie..." },
      { id:21, m:"Schönheitsoperationen verhindern Mammografien.", t:"Sie sind mit speziellen Techniken weiterhin möglich — sag es einfach deiner Ärztin." },
      { id:22, m:"Brustkrebs wird nur durch Genetik verursacht.", t:"Nur 5-10% sind erblich. Der Rest kommt von anderen Faktoren." },
    ],
  },
  ru: {
    row1: [
      { id:1, m:"Рак груди бывает только у пожилых женщин.", t:"Он может затронуть любую в любом возрасте, даже до 30." },
      { id:2, m:"Нет семейной истории — нет риска.", t:"85% случаев вообще не имеют семейной истории." },
      { id:3, m:"Любое уплотнение в груди означает рак.", t:"Большинство уплотнений доброкачественные, но всегда показывайте их врачу." },
      { id:4, m:"Самообследование заменяет маммографию.", t:"Самообследование дополняет, но не заменяет — нужны оба." },
      { id:5, m:"Маммография вызывает рак из-за облучения.", t:"Доза облучения очень мала и не вредна." },
      { id:6, m:"У мужчин не может быть рака груди.", t:"У мужчин он тоже бывает, но менее чем в 1% случаев." },
      { id:7, m:"Тесные бюстгальтеры вызывают рак груди.", t:"Нет научных доказательств этого утверждения." },
      { id:8, m:"Дезодорант вызывает рак груди.", t:"Доказанной научной связи не существует." },
    ],
    row2: [
      { id:9, m:"Удар по груди вызывает рак.", t:"Травмы не вызывают рак, но могут выявить уже существующее уплотнение." },
      { id:10, m:"Рак груди всегда смертелен.", t:"При раннем выявлении выживаемость достигает 99%." },
      { id:11, m:"Нет симптомов — значит, всё в порядке.", t:"У раннего рака нет симптомов — регулярные проверки необходимы." },
      { id:12, m:"Молоко и сахар питают рак.", t:"Доказательств нет, но здоровое питание всё же помогает профилактике." },
      { id:13, m:"Телефон у груди вызывает рак.", t:"Ни одно исследование этого не доказало." },
      { id:14, m:"Биопсия распространяет рак.", t:"Биопсия безопасна и нужна для диагностики; она не распространяет болезнь." },
      { id:15, m:"Одни травы могут вылечить рак.", t:"Доказано именно медицинское лечение. Травы дополняют, но не заменяют." },
    ],
    row3: [
      { id:16, m:"Меньшая грудь означает меньший риск.", t:"Размер груди вообще не связан с риском." },
      { id:17, m:"Беременность полностью защищает от рака.", t:"Беременность снижает риск, но не защищает на 100%." },
      { id:18, m:"Рак груди — болезнь богатых стран.", t:"Он затрагивает женщин в каждой стране, включая Марокко." },
      { id:19, m:"Стресс напрямую вызывает рак.", t:"Он влияет на общее здоровье, но не является прямой причиной." },
      { id:20, m:"Диагноз всегда означает удаление груди.", t:"Есть варианты: частичная операция, химиотерапия, лучевая терапия..." },
      { id:21, m:"Пластическая операция мешает маммографии.", t:"Её всё равно можно сделать специальными методами — просто скажите врачу." },
      { id:22, m:"Рак груди вызывает только генетика.", t:"Лишь 5-10% наследственные. Остальное — другие факторы." },
    ],
  },
  pt: {
    row1: [
      { id:1, m:"O câncer de mama só afeta mulheres mais velhas.", t:"Pode afetar qualquer pessoa em qualquer idade, até antes dos 30." },
      { id:2, m:"Sem histórico familiar não há risco.", t:"85% dos casos não têm nenhum histórico familiar." },
      { id:3, m:"Qualquer nódulo na mama significa câncer.", t:"A maioria dos nódulos é benigna, mas sempre peça a avaliação de um médico." },
      { id:4, m:"Um autoexame substitui a mamografia.", t:"O autoexame complementa, não substitui — você precisa dos dois." },
      { id:5, m:"As mamografias causam câncer por causa da radiação.", t:"A dose de radiação é muito baixa e não é prejudicial." },
      { id:6, m:"Homens não podem ter câncer de mama.", t:"Homens também podem ter, mas em menos de 1% dos casos." },
      { id:7, m:"Sutiãs apertados causam câncer de mama.", t:"Não há nenhuma evidência científica dessa afirmação." },
      { id:8, m:"O desodorante causa câncer de mama.", t:"Não existe nenhuma ligação científica comprovada." },
    ],
    row2: [
      { id:9, m:"Uma pancada na mama causa câncer.", t:"Lesões não causam câncer, mas podem revelar um nódulo já existente." },
      { id:10, m:"O câncer de mama é sempre fatal.", t:"Com a detecção precoce, a taxa de sobrevivência chega a 99%." },
      { id:11, m:"Sem sintomas significa que está tudo bem.", t:"O câncer inicial não tem sintomas — exames regulares são essenciais." },
      { id:12, m:"Leite e açúcar alimentam o câncer.", t:"Não há provas, mas comer de forma saudável ajuda na prevenção." },
      { id:13, m:"Um telefone perto do peito causa câncer.", t:"Nenhum estudo jamais provou isso." },
      { id:14, m:"Uma biópsia espalha o câncer.", t:"A biópsia é segura e necessária para o diagnóstico; não espalha a doença." },
      { id:15, m:"Só ervas podem curar o câncer.", t:"O tratamento médico é o que está comprovado. As ervas complementam, não substituem." },
    ],
    row3: [
      { id:16, m:"Mamas menores significam menor risco.", t:"O tamanho da mama não tem nenhuma ligação com o risco." },
      { id:17, m:"A gravidez protege totalmente contra o câncer.", t:"A gravidez reduz o risco, mas não protege 100%." },
      { id:18, m:"O câncer de mama é uma doença de países ricos.", t:"Ele afeta mulheres em todos os países, inclusive Marrocos." },
      { id:19, m:"O estresse causa diretamente o câncer.", t:"Ele afeta a saúde geral, mas não é uma causa direta." },
      { id:20, m:"Um diagnóstico sempre significa remover a mama.", t:"Há opções: cirurgia parcial, quimioterapia, radioterapia..." },
      { id:21, m:"A cirurgia estética impede as mamografias.", t:"Ainda dá para fazer com técnicas especiais — basta avisar seu médico." },
      { id:22, m:"O câncer de mama é causado apenas pela genética.", t:"Apenas 5-10% são hereditários. O resto vem de outros fatores." },
    ],
  },
};

function FlipCard({ myth, truth }: { myth: string; truth: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={(e) => { e.stopPropagation(); setFlipped(!flipped); }}
      style={{ perspective:'1000px', minWidth:'280px', height:'160px', flexShrink:0, cursor:'pointer' }}
    >
      <div style={{
        width:'100%', height:'100%', transition:'transform 0.6s ease',
        transformStyle:'preserve-3d', position:'relative',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
      }}>
        <div style={{
          position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
          borderRadius:'16px', background:'#FFF0F6', border:'1px solid #FFD0E8',
          display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
          padding:'20px', textAlign:'center',
        }}>
          <span style={{ position:'absolute', top:10, right:14, fontSize:12, color:'#DC2626', fontWeight:600 }}>❌ خرافة</span>
          <p style={{ fontSize:14, fontWeight:600, color:'#2D1F2D', lineHeight:1.7 }}>{myth}</p>
        </div>
        <div style={{
          position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
          borderRadius:'16px', background:'#F0FFF4', border:'1px solid #BBF7D0',
          display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
          padding:'20px', textAlign:'center', transform:'rotateY(180deg)',
        }}>
          <span style={{ position:'absolute', top:10, right:14, fontSize:12, color:'#16A34A', fontWeight:600 }}>✅ الحقيقة</span>
          <p style={{ fontSize:14, fontWeight:600, color:'#2D1F2D', lineHeight:1.7 }}>{truth}</p>
        </div>
      </div>
    </div>
  );
}

function ScrollRow({ items, direction }: { items: { id:number; m:string; t:string }[]; direction: 'right'|'left' }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const savedX = useRef(0);

  const getX = (): number => {
    if (!innerRef.current) return 0;
    const t = window.getComputedStyle(innerRef.current).transform;
    if (t === 'none') return 0;
    return new DOMMatrixReadOnly(t).m41;
  };

  const pause = () => {
    if (!innerRef.current) return;
    const x = getX();
    innerRef.current.style.animation = 'none';
    innerRef.current.style.transform = 'translateX(' + x + 'px)';
    savedX.current = x;
  };

  const resume = () => {
    if (!innerRef.current) return;
    innerRef.current.style.transform = '';
    const anim = direction === 'right' ? 'mythRight' : 'mythLeft';
    innerRef.current.style.animation = anim + ' 90s linear infinite';
  };

  const cards = [...items, ...items, ...items, ...items];

  return (
    <div
      style={{
        overflow:'hidden', width:'100%', userSelect:'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        maskImage:'linear-gradient(to right,transparent 0%,black 2%,black 98%,transparent 100%)',
        WebkitMaskImage:'linear-gradient(to right,transparent 0%,black 2%,black 98%,transparent 100%)',
      }}
      onMouseEnter={pause}
      onMouseLeave={() => { setIsDragging(false); resume(); }}
      onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); dragStartX.current = e.clientX; savedX.current = getX(); }}
      onMouseMove={(e) => {
        if (!isDragging || !innerRef.current) return;
        const diff = e.clientX - dragStartX.current;
        innerRef.current.style.transform = 'translateX(' + (savedX.current + diff) + 'px)';
      }}
      onMouseUp={() => { setIsDragging(false); savedX.current = getX(); }}
      onTouchStart={(e) => { pause(); setIsDragging(true); dragStartX.current = e.touches[0].clientX; savedX.current = getX(); }}
      onTouchMove={(e) => {
        if (!isDragging || !innerRef.current) return;
        const diff = e.touches[0].clientX - dragStartX.current;
        innerRef.current.style.transform = 'translateX(' + (savedX.current + diff) + 'px)';
      }}
      onTouchEnd={() => { setIsDragging(false); setTimeout(resume, 2000); }}
    >
      <div
        ref={innerRef}
        style={{
          display:'flex', gap:'16px', width:'max-content',
          animation: (direction === 'right' ? 'mythRight' : 'mythLeft') + ' 90s linear infinite',
        }}
      >
        {cards.map((item, i) => (
          <FlipCard key={item.id + '-' + i} myth={item.m} truth={item.t} />
        ))}
      </div>
    </div>
  );
}

export function MythsWall() {
  const { lang } = useLanguage();
  const data = MYTHS_DATA[lang] || MYTHS_DATA.ar;

  return (
    <div>
      <style>{`
        @keyframes mythRight { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes mythLeft { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
      `}</style>
      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        <ScrollRow items={data.row1} direction="right" />
        <ScrollRow items={data.row2} direction="left" />
        <ScrollRow items={data.row3} direction="right" />
      </div>
    </div>
  );
}
