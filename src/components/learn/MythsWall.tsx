import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { useLanguage } from '@/hooks/useLanguage';

/* ── Flip Card ── */
function MythCard({ myth, truth, mythLabel, truthLabel, cardId, onFlip, isMobile, initialFlipped }: {
  myth: string; truth: string; mythLabel: string; truthLabel: string;
  cardId: string; onFlip: (id: string, flipped: boolean) => void;
  isMobile: boolean; initialFlipped: boolean;
}) {
  const [flipped, setFlipped] = useState(initialFlipped);
  // Report the card's *new* state (not a blind toggle): the marquee renders
  // every card twice with the same cardId, so the parent must add/remove based
  // on actual orientation rather than toggling, or the two copies desync.
  const handleClick = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip(cardId, next);
  };
  return (
    <div
      onClick={handleClick}
      style={{
        perspective: 1000,
        width: isMobile ? 220 : 280,
        minWidth: isMobile ? 220 : 280,
        height: isMobile ? 130 : 160,
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        position: 'relative',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Front — Myth */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: 16, background: '#FFF0F6', border: '1px solid #FFD0E8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? 14 : 20, textAlign: 'center',
        }}>
          <span style={{ position: 'absolute', top: 8, right: 12, fontSize: isMobile ? 9 : 11, color: '#DC2626', fontWeight: 700 }}>
            ❌ {mythLabel}
          </span>
          <p style={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: '#2D1F2D', lineHeight: 1.6, margin: 0 }}>{myth}</p>
        </div>
        {/* Back — Truth */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: 16, background: '#F0FFF4', border: '1px solid #BBF7D0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? 14 : 20, textAlign: 'center',
          transform: 'rotateY(180deg)',
        }}>
          <span style={{ position: 'absolute', top: 8, right: 12, fontSize: isMobile ? 9 : 11, color: '#16A34A', fontWeight: 700 }}>
            ✅ {truthLabel}
          </span>
          <p style={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: '#2D1F2D', lineHeight: 1.6, margin: 0 }}>{truth}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Myths Data ── */
// ALL myths in 7 languages. 30 total: 10 per row.
// Row 1 (scrolls left ←), Row 2 (scrolls right →), Row 3 (scrolls left ←)

const MYTHS: Record<string, {
  mythLabel: string; truthLabel: string;
  row1: {m:string;t:string}[];
  row2: {m:string;t:string}[];
  row3: {m:string;t:string}[];
}> = {
  ar: {
    mythLabel: 'خرافة', truthLabel: 'الحقيقة',
    row1: [
      { m:"سرطان الثدي كيجي غير عند الكبار فالسن", t:"يمكن يصيب أي وحدة فأي عمر حتى قبل 30" },
      { m:"إلا ما كاينش تاريخ عائلي ما كاين خطر", t:"85% من الحالات بلا تاريخ عائلي" },
      { m:"أي كورة فالثدي = سرطان", t:"أغلب الكتل حميدة ولكن خاصك تراجعي" },
      { m:"الفحص الذاتي كيبدل الماموغرافيا", t:"مكمّل ماشي بديل خاصك الاثنين" },
      { m:"الماموغرافيا كتسبب السرطان", t:"الأشعة ضعيفة بزاف وما فيهاش خطر" },
      { m:"الراجل ما يجيهش سرطان الثدي", t:"يمكن يصاب ولكن بنسبة أقل من 1%" },
      { m:"السوتيان الضيق كيسبب السرطان", t:"ما كاين حتى دليل علمي" },
      { m:"الديودورون كيسبب السرطان", t:"ما كاين حتى علاقة مثبتة" },
      { m:"الحليب الصناعي كيزيد الخطر", t:"ما كاين حتى ربط علمي بين الحليب الصناعي والسرطان" },
      { m:"غير النساء البيض كيتصابو بسرطان الثدي", t:"كيصيب جميع النساء بغض النظر عن العرق" },
    ],
    row2: [
      { m:"الصدمة فالثدي كتسبب السرطان", t:"ممكن تكشف كتلة موجودة ماشي تسببها" },
      { m:"سرطان الثدي ديما كيقتل", t:"99% نسبة شفاء مع الكشف المبكر" },
      { m:"بلا أعراض = بلا مشكل", t:"فالبداية بلا أعراض الفحص ضروري" },
      { m:"السكر كيغذي السرطان", t:"ما كاين دليل ولكن الأكل الصحي مهم" },
      { m:"الهاتف قريب من الصدر خطير", t:"حتى دراسة ما أثبتات هاد الشي" },
      { m:"الخزعة كتنشر السرطان", t:"آمنة وضرورية وما كتنشرش المرض" },
      { m:"الأعشاب كافية للعلاج", t:"العلاج الطبي هو المثبت الأعشاب مكملة" },
      { m:"الرياضة ما كتأثرش على الخطر", t:"الرياضة المنتظمة كتقلل الخطر بنسبة 25%" },
      { m:"إلا ما حسيتي بالوجع راه مافيكش والو", t:"أغلب حالات السرطان المبكر ما كيوجعوش" },
      { m:"الماموغرافيا كتكشف ديما السرطان", t:"كتكشف أغلب الحالات ولكن ماشي 100%" },
    ],
    row3: [
      { m:"الثدي الصغير = خطر أقل", t:"الحجم ما عندو حتى علاقة بالخطر" },
      { m:"الحمل كيحمي نهائياً", t:"كيقلل الخطر ولكن ماشي 100%" },
      { m:"مرض ديال الدول الغنية", t:"كيصيب النساء فالعالم كلو بما فيهم المغرب" },
      { m:"الستريس كيسبب السرطان", t:"كيأثر على الصحة ولكن ماشي سبب مباشر" },
      { m:"ديما خاصك تقطعي الثدي", t:"كاينين خيارات جراحة جزئية كيميائي إشعاعي" },
      { m:"التجميل كيمنع الماموغرافيا", t:"يمكن تديريها بتقنيات خاصة" },
      { m:"سببو غير الوراثة", t:"غير 5-10% وراثي الباقي عوامل أخرى" },
      { m:"المكملات الغذائية كتمنع السرطان", t:"ما كاين حتى دليل قاطع على هاد الشي" },
      { m:"إلا دارو ليك علاج كيميائي غادي تخسري شعرك للأبد", t:"الشعر كيرجع ينبت بعد ما يسالي العلاج" },
      { m:"سرطان الثدي كيجي غير من جيهة الأم", t:"يقدر يتوارث من الأب ولا الأم" },
    ],
  },
  fr: {
    mythLabel: 'Mythe', truthLabel: 'Vérité',
    row1: [
      { m:"Le cancer du sein touche seulement les femmes âgées", t:"Il peut toucher toute femme à tout âge, même avant 30 ans" },
      { m:"Sans antécédents familiaux, aucun risque", t:"85% des cas n'ont aucun antécédent familial" },
      { m:"Toute boule dans le sein est un cancer", t:"La plupart des masses sont bénignes, mais consultez toujours" },
      { m:"L'auto-examen remplace la mammographie", t:"Il complète, ne remplace pas — il faut les deux" },
      { m:"La mammographie cause le cancer", t:"La dose de rayons est très faible et sans danger" },
      { m:"Les hommes ne peuvent pas avoir ce cancer", t:"Les hommes peuvent en avoir, dans moins de 1% des cas" },
      { m:"Un soutien-gorge serré cause le cancer", t:"Aucune preuve scientifique ne le confirme" },
      { m:"Le déodorant cause le cancer du sein", t:"Aucun lien scientifique prouvé" },
      { m:"Le lait artificiel augmente le risque", t:"Aucun lien scientifique entre lait artificiel et cancer" },
      { m:"Seules les femmes blanches sont touchées", t:"Il touche toutes les femmes indépendamment de l'ethnie" },
    ],
    row2: [
      { m:"Un coup au sein cause le cancer", t:"Les coups ne causent pas le cancer mais peuvent révéler une masse" },
      { m:"Le cancer du sein est toujours mortel", t:"Avec dépistage précoce, le taux de survie atteint 99%" },
      { m:"Pas de symptômes = aucun souci", t:"Un cancer débutant est sans symptômes — suivi essentiel" },
      { m:"Le sucre nourrit le cancer", t:"Aucune preuve, mais une alimentation saine aide" },
      { m:"Téléphone près du sein = cancer", t:"Aucune étude ne le prouve" },
      { m:"La biopsie propage le cancer", t:"La biopsie est sûre et nécessaire au diagnostic" },
      { m:"Les plantes seules guérissent le cancer", t:"Le traitement médical est prouvé. Les plantes complètent" },
      { m:"Le sport n'affecte pas le risque", t:"L'exercice régulier réduit le risque de 25%" },
      { m:"Pas de douleur = pas de cancer", t:"La plupart des cancers précoces sont indolores" },
      { m:"La mammographie détecte tout", t:"Elle détecte la plupart des cas mais pas 100%" },
    ],
    row3: [
      { m:"Petits seins = moins de risque", t:"La taille n'a aucun lien avec le risque" },
      { m:"La grossesse protège totalement", t:"Elle réduit le risque mais pas à 100%" },
      { m:"Maladie des pays riches", t:"Elle touche les femmes partout, y compris au Maroc" },
      { m:"Le stress cause directement le cancer", t:"Il affecte la santé mais n'est pas une cause directe" },
      { m:"Diagnostic = ablation du sein", t:"Options: chirurgie partielle, chimio, radiothérapie" },
      { m:"Chirurgie esthétique empêche la mammographie", t:"Possible avec des techniques spéciales" },
      { m:"C'est seulement génétique", t:"Seuls 5-10% sont héréditaires" },
      { m:"Les compléments alimentaires préviennent le cancer", t:"Aucune preuve concluante de cela" },
      { m:"La chimio fait perdre les cheveux pour toujours", t:"Les cheveux repoussent après la fin du traitement" },
      { m:"Le cancer vient seulement du côté maternel", t:"Il peut être hérité du père ou de la mère" },
    ],
  },
  en: {
    mythLabel: 'Myth', truthLabel: 'Truth',
    row1: [
      { m:"Breast cancer only affects older women", t:"It can affect anyone at any age, even before 30" },
      { m:"No family history means no risk", t:"85% of cases have no family history" },
      { m:"Any lump means cancer", t:"Most lumps are benign, but always get checked" },
      { m:"Self-exam replaces mammogram", t:"Self-exam complements, doesn't replace — need both" },
      { m:"Mammograms cause cancer", t:"Radiation dose is very low and not harmful" },
      { m:"Men can't get breast cancer", t:"Men can get it too, in under 1% of cases" },
      { m:"Tight bras cause cancer", t:"No scientific evidence for this" },
      { m:"Deodorant causes breast cancer", t:"No proven scientific link exists" },
      { m:"Formula milk increases risk", t:"No scientific link between formula and cancer" },
      { m:"Only white women get breast cancer", t:"It affects all women regardless of ethnicity" },
    ],
    row2: [
      { m:"A blow to the breast causes cancer", t:"Injuries don't cause cancer but may reveal a lump" },
      { m:"Breast cancer is always fatal", t:"With early detection, survival rate reaches 99%" },
      { m:"No symptoms = no problem", t:"Early cancer has no symptoms — regular checks essential" },
      { m:"Sugar feeds cancer", t:"No proof, but healthy eating helps" },
      { m:"Phone near chest causes cancer", t:"No study has ever proven this" },
      { m:"Biopsy spreads cancer", t:"Biopsy is safe and needed for diagnosis" },
      { m:"Herbs alone cure cancer", t:"Medical treatment is proven. Herbs complement only" },
      { m:"Exercise doesn't affect risk", t:"Regular exercise reduces risk by 25%" },
      { m:"No pain means no cancer", t:"Most early cancers are painless" },
      { m:"Mammograms detect everything", t:"They detect most cases but not 100%" },
    ],
    row3: [
      { m:"Smaller breasts = lower risk", t:"Breast size has no link to risk" },
      { m:"Pregnancy fully protects", t:"It lowers risk but not 100%" },
      { m:"Disease of rich countries", t:"Affects women everywhere including Morocco" },
      { m:"Stress directly causes cancer", t:"Affects health but not a direct cause" },
      { m:"Diagnosis always means removal", t:"Options: partial surgery, chemo, radiotherapy" },
      { m:"Cosmetic surgery prevents mammograms", t:"Can still be done with special techniques" },
      { m:"Only caused by genetics", t:"Only 5-10% hereditary, rest is other factors" },
      { m:"Supplements prevent cancer", t:"No conclusive evidence for this" },
      { m:"Chemo hair loss is permanent", t:"Hair regrows after treatment ends" },
      { m:"Cancer only comes from mother's side", t:"Can be inherited from either parent" },
    ],
  },
  es: {
    mythLabel: 'Mito', truthLabel: 'Verdad',
    row1: [
      { m:"Solo afecta a mujeres mayores", t:"Puede afectar a cualquier edad, incluso antes de los 30" },
      { m:"Sin antecedentes familiares no hay riesgo", t:"85% de los casos no tienen antecedentes" },
      { m:"Cualquier bulto significa cáncer", t:"La mayoría son benignos, pero siempre consulte" },
      { m:"El autoexamen sustituye la mamografía", t:"Complementa, no sustituye — necesitas ambos" },
      { m:"La mamografía causa cáncer", t:"La radiación es muy baja y no es perjudicial" },
      { m:"Los hombres no pueden tenerlo", t:"Pueden tenerlo, en menos del 1% de los casos" },
      { m:"Los sujetadores ajustados causan cáncer", t:"No hay evidencia científica" },
      { m:"El desodorante causa cáncer", t:"No existe vínculo científico probado" },
      { m:"La leche artificial aumenta el riesgo", t:"No hay vínculo científico" },
      { m:"Solo las mujeres blancas se ven afectadas", t:"Afecta a todas las mujeres sin importar la etnia" },
    ],
    row2: [
      { m:"Un golpe en el seno causa cáncer", t:"No lo causa pero puede revelar un bulto existente" },
      { m:"Siempre es mortal", t:"Con detección temprana, la supervivencia llega al 99%" },
      { m:"Sin síntomas = sin problema", t:"El cáncer temprano no tiene síntomas" },
      { m:"El azúcar alimenta el cáncer", t:"No hay pruebas, pero comer sano ayuda" },
      { m:"El teléfono cerca del pecho causa cáncer", t:"Ningún estudio lo ha demostrado" },
      { m:"La biopsia propaga el cáncer", t:"Es segura y necesaria para el diagnóstico" },
      { m:"Las hierbas solas curan el cáncer", t:"El tratamiento médico es lo probado" },
      { m:"El ejercicio no afecta el riesgo", t:"El ejercicio regular reduce el riesgo un 25%" },
      { m:"Sin dolor = sin cáncer", t:"La mayoría de cánceres tempranos son indoloros" },
      { m:"La mamografía detecta todo", t:"Detecta la mayoría pero no el 100%" },
    ],
    row3: [
      { m:"Senos pequeños = menos riesgo", t:"El tamaño no tiene relación con el riesgo" },
      { m:"El embarazo protege totalmente", t:"Reduce el riesgo pero no al 100%" },
      { m:"Enfermedad de países ricos", t:"Afecta a mujeres en todo el mundo" },
      { m:"El estrés causa directamente cáncer", t:"Afecta la salud pero no es causa directa" },
      { m:"Diagnóstico = extirpar el seno", t:"Hay opciones: cirugía parcial, quimio, radioterapia" },
      { m:"Cirugía estética impide mamografías", t:"Se pueden hacer con técnicas especiales" },
      { m:"Solo es genético", t:"Solo 5-10% es hereditario" },
      { m:"Los suplementos previenen el cáncer", t:"No hay evidencia concluyente" },
      { m:"La quimio causa pérdida de cabello permanente", t:"El cabello vuelve a crecer tras el tratamiento" },
      { m:"Solo viene del lado materno", t:"Puede heredarse de cualquier progenitor" },
    ],
  },
  de: {
    mythLabel: 'Mythos', truthLabel: 'Wahrheit',
    row1: [
      { m:"Betrifft nur ältere Frauen", t:"Kann jede in jedem Alter treffen, sogar vor 30" },
      { m:"Keine Familiengeschichte = kein Risiko", t:"85% der Fälle haben keine Familiengeschichte" },
      { m:"Jeder Knoten bedeutet Krebs", t:"Die meisten sind gutartig, aber immer prüfen lassen" },
      { m:"Selbstuntersuchung ersetzt Mammografie", t:"Ergänzt, ersetzt nicht — man braucht beides" },
      { m:"Mammografie verursacht Krebs", t:"Die Strahlendosis ist sehr gering" },
      { m:"Männer können keinen Brustkrebs bekommen", t:"Können sie, in unter 1% der Fälle" },
      { m:"Enge BHs verursachen Krebs", t:"Kein wissenschaftlicher Beweis" },
      { m:"Deodorant verursacht Brustkrebs", t:"Kein nachgewiesener Zusammenhang" },
      { m:"Künstliche Milch erhöht das Risiko", t:"Kein wissenschaftlicher Zusammenhang" },
      { m:"Nur weiße Frauen sind betroffen", t:"Betrifft alle Frauen unabhängig von der Ethnie" },
    ],
    row2: [
      { m:"Ein Schlag verursacht Krebs", t:"Verletzungen verursachen keinen Krebs" },
      { m:"Brustkrebs ist immer tödlich", t:"Mit Früherkennung erreicht die Überlebensrate 99%" },
      { m:"Keine Symptome = kein Problem", t:"Früher Krebs hat keine Symptome" },
      { m:"Zucker nährt den Krebs", t:"Kein Beweis, aber gesunde Ernährung hilft" },
      { m:"Telefon nahe der Brust verursacht Krebs", t:"Keine Studie hat das bewiesen" },
      { m:"Biopsie verbreitet Krebs", t:"Sicher und nötig für die Diagnose" },
      { m:"Kräuter allein heilen Krebs", t:"Medizinische Behandlung ist bewiesen" },
      { m:"Sport beeinflusst das Risiko nicht", t:"Regelmäßige Bewegung senkt das Risiko um 25%" },
      { m:"Kein Schmerz = kein Krebs", t:"Die meisten frühen Krebse sind schmerzlos" },
      { m:"Mammografie erkennt alles", t:"Erkennt die meisten Fälle aber nicht 100%" },
    ],
    row3: [
      { m:"Kleinere Brüste = weniger Risiko", t:"Größe hat keinen Zusammenhang mit Risiko" },
      { m:"Schwangerschaft schützt vollständig", t:"Senkt das Risiko, schützt aber nicht 100%" },
      { m:"Krankheit reicher Länder", t:"Betrifft Frauen überall, auch in Marokko" },
      { m:"Stress verursacht direkt Krebs", t:"Beeinflusst Gesundheit, keine direkte Ursache" },
      { m:"Diagnose = Brustentfernung", t:"Optionen: Teiloperation, Chemo, Strahlentherapie" },
      { m:"Schönheits-OP verhindert Mammografie", t:"Möglich mit speziellen Techniken" },
      { m:"Nur durch Genetik verursacht", t:"Nur 5-10% erblich" },
      { m:"Nahrungsergänzung verhindert Krebs", t:"Keine schlüssigen Beweise" },
      { m:"Chemo-Haarverlust ist dauerhaft", t:"Haare wachsen nach der Behandlung nach" },
      { m:"Kommt nur von der mütterlichen Seite", t:"Kann von beiden Elternteilen vererbt werden" },
    ],
  },
  ru: {
    mythLabel: 'Миф', truthLabel: 'Правда',
    row1: [
      { m:"Рак груди бывает только у пожилых", t:"Может возникнуть в любом возрасте, даже до 30" },
      { m:"Нет семейной истории — нет риска", t:"85% случаев без семейной истории" },
      { m:"Любое уплотнение — это рак", t:"Большинство доброкачественные, но проверьтесь" },
      { m:"Самообследование заменяет маммографию", t:"Дополняет, не заменяет — нужны оба" },
      { m:"Маммография вызывает рак", t:"Доза облучения очень мала и безвредна" },
      { m:"Мужчины не болеют раком груди", t:"Могут, но менее чем в 1% случаев" },
      { m:"Тесные бюстгальтеры вызывают рак", t:"Нет научных доказательств" },
      { m:"Дезодорант вызывает рак груди", t:"Доказанной связи не существует" },
      { m:"Искусственное молоко повышает риск", t:"Нет научной связи" },
      { m:"Только белые женщины болеют", t:"Затрагивает всех женщин независимо от этнической принадлежности" },
    ],
    row2: [
      { m:"Удар по груди вызывает рак", t:"Травмы не вызывают рак, но могут выявить уплотнение" },
      { m:"Рак груди всегда смертелен", t:"При раннем выявлении выживаемость достигает 99%" },
      { m:"Нет симптомов = нет проблем", t:"Ранний рак без симптомов — проверки необходимы" },
      { m:"Сахар питает рак", t:"Нет доказательств, но здоровое питание помогает" },
      { m:"Телефон у груди вызывает рак", t:"Ни одно исследование этого не доказало" },
      { m:"Биопсия распространяет рак", t:"Безопасна и необходима для диагностики" },
      { m:"Травы могут вылечить рак", t:"Медицинское лечение доказано. Травы дополняют" },
      { m:"Спорт не влияет на риск", t:"Регулярные упражнения снижают риск на 25%" },
      { m:"Нет боли = нет рака", t:"Большинство ранних случаев безболезненны" },
      { m:"Маммография обнаруживает всё", t:"Обнаруживает большинство, но не 100%" },
    ],
    row3: [
      { m:"Маленькая грудь = меньше риск", t:"Размер никак не связан с риском" },
      { m:"Беременность полностью защищает", t:"Снижает риск, но не на 100%" },
      { m:"Болезнь богатых стран", t:"Затрагивает женщин по всему миру" },
      { m:"Стресс напрямую вызывает рак", t:"Влияет на здоровье, но не прямая причина" },
      { m:"Диагноз = удаление груди", t:"Есть варианты: частичная операция, химио, лучевая терапия" },
      { m:"Пластика мешает маммографии", t:"Можно делать специальными методами" },
      { m:"Только генетика", t:"Только 5-10% наследственные" },
      { m:"Добавки предотвращают рак", t:"Нет убедительных доказательств" },
      { m:"Потеря волос от химии — навсегда", t:"Волосы отрастают после лечения" },
      { m:"Рак только от материнской линии", t:"Может наследоваться от любого родителя" },
    ],
  },
  pt: {
    mythLabel: 'Mito', truthLabel: 'Verdade',
    row1: [
      { m:"Só afeta mulheres mais velhas", t:"Pode afetar qualquer idade, até antes dos 30" },
      { m:"Sem histórico familiar não há risco", t:"85% dos casos não têm histórico familiar" },
      { m:"Qualquer nódulo significa câncer", t:"A maioria é benigna, mas sempre consulte" },
      { m:"Autoexame substitui mamografia", t:"Complementa, não substitui — precisa dos dois" },
      { m:"Mamografia causa câncer", t:"A radiação é muito baixa e não prejudicial" },
      { m:"Homens não podem ter câncer de mama", t:"Podem, em menos de 1% dos casos" },
      { m:"Sutiã apertado causa câncer", t:"Nenhuma evidência científica" },
      { m:"Desodorante causa câncer de mama", t:"Nenhuma ligação científica comprovada" },
      { m:"Leite artificial aumenta o risco", t:"Nenhuma ligação científica" },
      { m:"Só mulheres brancas são afetadas", t:"Afeta todas as mulheres independentemente da etnia" },
    ],
    row2: [
      { m:"Pancada na mama causa câncer", t:"Lesões não causam, mas podem revelar nódulo" },
      { m:"Câncer de mama é sempre fatal", t:"Com detecção precoce, sobrevivência chega a 99%" },
      { m:"Sem sintomas = sem problema", t:"Câncer inicial não tem sintomas" },
      { m:"Açúcar alimenta o câncer", t:"Sem provas, mas alimentação saudável ajuda" },
      { m:"Celular perto do peito causa câncer", t:"Nenhum estudo provou isso" },
      { m:"Biópsia espalha o câncer", t:"É segura e necessária para diagnóstico" },
      { m:"Só ervas curam câncer", t:"Tratamento médico é comprovado" },
      { m:"Exercício não afeta o risco", t:"Exercício regular reduz o risco em 25%" },
      { m:"Sem dor = sem câncer", t:"A maioria dos cânceres iniciais são indolores" },
      { m:"Mamografia detecta tudo", t:"Detecta a maioria mas não 100%" },
    ],
    row3: [
      { m:"Mamas menores = menor risco", t:"Tamanho não tem relação com risco" },
      { m:"Gravidez protege totalmente", t:"Reduz o risco mas não 100%" },
      { m:"Doença de países ricos", t:"Afeta mulheres em todo o mundo" },
      { m:"Estresse causa diretamente câncer", t:"Afeta a saúde mas não é causa direta" },
      { m:"Diagnóstico = remover a mama", t:"Opções: cirurgia parcial, quimio, radioterapia" },
      { m:"Cirurgia estética impede mamografia", t:"Possível com técnicas especiais" },
      { m:"Só é genético", t:"Apenas 5-10% hereditário" },
      { m:"Suplementos previnem câncer", t:"Sem evidência conclusiva" },
      { m:"Perda de cabelo da quimio é permanente", t:"Cabelo volta a crescer após tratamento" },
      { m:"Câncer só vem do lado materno", t:"Pode ser herdado de qualquer progenitor" },
    ],
  },
};

/* ── Main Component ── */
export function MythsWall() {
  const { lang } = useLanguage();
  const d = MYTHS[lang] || MYTHS.ar;

  // Speed: 75s = 3x slower than default 25s
  // durationOnHover: 9999 = effectively pauses on hover

  // Shrink cards on narrow viewports. Read width in an effect (not during
  // render) so the value stays stable on the initial paint.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track which unique myths have been revealed. Membership reflects the actual
  // flip state reported by MythCard, so flipping a card back removes it again.
  // Seeded from localStorage so progress survives tab switches (which unmount
  // this component) and reloads.
  const [flippedSet, setFlippedSet] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('sahtek_myths_flipped');
      if (saved) return new Set<string>(JSON.parse(saved));
    } catch { /* ignore unavailable/corrupt storage */ }
    return new Set();
  });
  useEffect(() => {
    try {
      localStorage.setItem('sahtek_myths_flipped', JSON.stringify([...flippedSet]));
    } catch { /* ignore unavailable storage */ }
  }, [flippedSet]);

  const handleFlip = (cardId: string, flipped: boolean) => {
    setFlippedSet((prev) => {
      const next = new Set(prev);
      if (flipped) next.add(cardId);
      else next.delete(cardId);
      return next;
    });
  };

  const flippedCount = flippedSet.size;
  const progressLabel =
    lang === 'ar' ? `كشفتي ${flippedCount}/30 حقيقة` :
    lang === 'fr' ? `${flippedCount}/30 vérités découvertes` :
    lang === 'es' ? `${flippedCount}/30 verdades descubiertas` :
    lang === 'de' ? `${flippedCount}/30 Wahrheiten entdeckt` :
    lang === 'ru' ? `${flippedCount}/30 истин раскрыто` :
    lang === 'pt' ? `${flippedCount}/30 verdades descobertas` :
    `${flippedCount}/30 truths discovered`;

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#D63384', marginBottom: 8 }}>
          30 {d.mythLabel} 🔍
        </h3>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
          {lang === 'ar' ? 'قلّبي الكارطات باش تعرفي الحقيقة' :
           lang === 'fr' ? 'Retournez les cartes pour découvrir la vérité' :
           'Flip the cards to discover the truth'}
        </p>

        {/* Progress counter — fades in after the first flip, hidden at 0. */}
        {flippedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              background: 'white',
              borderRadius: 999,
              padding: '8px 20px',
              boxShadow: '0 2px 12px rgba(214,51,132,0.15)',
              border: '1px solid #FFE0EC',
            }}
          >
            {/* Mini circular progress */}
            <svg width={36} height={36} viewBox="0 0 36 36">
              <circle cx={18} cy={18} r={15} fill="none" stroke="#FFE0EC" strokeWidth={3} />
              <circle
                cx={18} cy={18} r={15} fill="none"
                stroke={flippedCount >= 30 ? '#16A34A' : '#D63384'}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={`${(flippedCount / 30) * 94.25} 94.25`}
                transform="rotate(-90 18 18)"
                style={{ transition: 'stroke-dasharray 0.5s ease, stroke 0.3s ease' }}
              />
              <text x={18} y={18} textAnchor="middle" dominantBaseline="central"
                style={{ fontSize: 10, fontWeight: 700, fill: '#D63384' }}>
                {flippedCount}
              </text>
            </svg>

            {/* Text */}
            <span style={{ fontSize: 14, fontWeight: 600, color: '#2D1F2D' }}>
              {progressLabel}
            </span>

            {/* Celebration at 30/30 */}
            {flippedCount >= 30 && (
              <span style={{ fontSize: 18 }}>🏆</span>
            )}
          </motion.div>
        )}
      </div>

      {/* 3 Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Row 1: scrolls left ← (default) */}
        <InfiniteSlider gap={16} duration={isMobile ? 120 : 75} durationOnHover={9999}>
          {d.row1.map((item, i) => {
            const id = `r1-${i}`;
            return (
              <MythCard key={`r1-${i}`} cardId={id} initialFlipped={flippedSet.has(id)} isMobile={isMobile} myth={item.m} truth={item.t} mythLabel={d.mythLabel} truthLabel={d.truthLabel} onFlip={handleFlip} />
            );
          })}
        </InfiniteSlider>

        {/* Row 2: scrolls right → (reverse) */}
        <InfiniteSlider gap={16} duration={isMobile ? 120 : 75} durationOnHover={9999} reverse>
          {d.row2.map((item, i) => {
            const id = `r2-${i}`;
            return (
              <MythCard key={`r2-${i}`} cardId={id} initialFlipped={flippedSet.has(id)} isMobile={isMobile} myth={item.m} truth={item.t} mythLabel={d.mythLabel} truthLabel={d.truthLabel} onFlip={handleFlip} />
            );
          })}
        </InfiniteSlider>

        {/* Row 3: scrolls left ← (default) */}
        <InfiniteSlider gap={16} duration={isMobile ? 120 : 75} durationOnHover={9999}>
          {d.row3.map((item, i) => {
            const id = `r3-${i}`;
            return (
              <MythCard key={`r3-${i}`} cardId={id} initialFlipped={flippedSet.has(id)} isMobile={isMobile} myth={item.m} truth={item.t} mythLabel={d.mythLabel} truthLabel={d.truthLabel} onFlip={handleFlip} />
            );
          })}
        </InfiniteSlider>
      </div>
    </div>
  );
}
