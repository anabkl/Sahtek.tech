import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, Heart, ShieldCheck } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

const symptomCards = [
  {
    title: 'كورة ولا تنفاخ جديد فالثدي ولا تحت الإبط',
    points: ['إلا بقات الكورة أيام وما نقصاتش، خاص المتابعة.', 'حتى الكورة اللي ما كتوجعش خاصها تتشاف عند طبيب.'],
    severity: 'high' as const,
  },
  {
    title: 'تبدل فلون الجلد ولا التجعيد بحال قشرة البرتقال',
    points: ['الجلد يقدر يولي محمر، مزرق، ولا مشدود بزاف.', 'أي تبدل مفاجئ ومُستمر ما خاصوش يتهمّل.'],
    severity: 'high' as const,
  },
  {
    title: 'إفرازات من الحلمة خصوصاً إلا كانت دموية',
    points: ['الإفرازات بلا رضاعة طبيعية خاصها تقييم طبي سريع.', 'إلا جات غير من جهة وحدة راه خاص الفحص.'],
    severity: 'high' as const,
  },
  {
    title: 'ألم موضعي مستمر ولا تغير واضح فشكل الثدي',
    points: ['الألم بوحدو غالباً ماشي خطير، ولكن الاستمرار علامة مهمة.', 'الاختلاف المفاجئ فالحجم ولا الشكل خاصو تشخيص.'],
    severity: 'medium' as const,
  },
];

const preventionChecklist = [
  {
    title: 'الفحص الذاتي مرة فالشهر',
    detail: 'ديريه نفس اليوم كل شهر، وركزي على أي تغيّر جديد.',
  },
  {
    title: 'زيارة دورية للطبيب أو القابلة',
    detail: 'الفحص السريري كيساعد يكشف التغيرات اللي ممكن ما تبانش بسهولة.',
  },
  {
    title: '30 دقيقة نشاط بدني يومياً',
    detail: 'المشي السريع، الرقص، ولا أي حركة منتظمة كتعاون على الوقاية.',
  },
  {
    title: 'أكل متوازن غني بالخضر والفواكه',
    detail: 'قللي المأكولات المصنعة والسكريات الزائدة قدر الإمكان.',
  },
  {
    title: 'الابتعاد عن التدخين وتقليل الكحول',
    detail: 'هاد العادات كترفع المخاطر الصحية بشكل عام.',
  },
  {
    title: 'تنظيم النوم وتخفيف التوتر',
    detail: 'الراحة النفسية والنوم الكافي كيعززو المناعة والتوازن الهرموني.',
  },
];

const myths = [
  {
    myth: 'سرطان الثدي كيجي غير عند النساء الكبار فالسن.',
    truth: 'ممكن يبان فمراحل عمرية مختلفة، لهذا الوعي لازم من بدري.',
    details: 'الخطر كيرتفع مع السن، ولكن هاد الشي ما كيلغيش أهمية التوعية عند الشابات حتى هما.',
  },
  {
    myth: 'إلا ما كاينش تاريخ عائلي، ما كاين حتى خطر.',
    truth: 'أغلب الحالات كتوقع بلا تاريخ عائلي واضح.',
    details: 'وجود تاريخ عائلي مهم، لكن غيابو ماشي ضمانة. المتابعة الدورية ضرورية للجميع.',
  },
  {
    myth: 'أي كورة فالثدي معناها سرطان.',
    truth: 'كاين بزاف ديال الكويرات الحميدة، ولكن التشخيص خاص يكون طبي.',
    details: 'ما تخافيش بلا فائدة، وما تهمليش. الكشف المبكر كيبقى أحسن خطوة.',
  },
  {
    myth: 'الفحص الذاتي كيبدل الفحص الطبي والماموغرافيا.',
    truth: 'الفحص الذاتي مكمل فقط، ماشي بديل للمتابعة الطبية.',
    details: 'المراقبة الذاتية كتعاونك تعرفي جسمك، والطبيب كيأكد التشخيص بخطوات أدق.',
  },
];

export function LearnPage() {
  const { t } = useLanguage();
  const tabs = useMemo(() => Object.entries(t.learn.tabs), [t.learn.tabs]);
  const [tab, setTab] = useState(tabs[0][0]);
  const [checked, setChecked] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-4xl font-black text-ink">{t.learn.title}</h1>
        <p className="mt-2 max-w-2xl text-lg font-medium text-muted">{t.learn.subtitle}</p>
      </div>
      <div className="hide-scrollbar mb-6 flex gap-2 overflow-x-auto rounded-full border border-line bg-card/80 p-1 shadow-petal">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn('min-h-11 shrink-0 rounded-full px-5 text-sm font-black text-muted transition', tab === key && 'bg-primary-500 text-white shadow-petal')}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-3">
          {[
            ['1 من كل 8', 'خطر تراكمي تقريبي عبر الحياة، وهاد الشي كيأكد أهمية الوقاية والكشف المبكر.', 'خطر تقريبي: امرأة واحدة من كل ثمانية عبر الحياة'],
            ['+90%', 'فرص علاج أحسن إلا تكتاشف المرض فالمراحل الأولى.', 'أكثر من تسعين بالمئة فرص أفضل عند الكشف المبكر'],
            ['30 يوم', 'الفحص الذاتي المنتظم مرة فالشهر كيعاونك تلاحظي أي تغير بكري.', 'فحص ذاتي كل ثلاثين يوم تقريباً'],
          ].map(([stat, text, statLabel]) => (
            <div key={stat} className="rounded-3xl border border-white/70 bg-card/80 p-6 shadow-petal">
              <Heart className="mb-5 text-primary-500" size={28} />
              <div className="text-3xl font-black text-gradient">
                <span className="sr-only">{statLabel}: </span>
                {stat}
              </div>
              <p className="mt-2 font-medium leading-7 text-muted">{text}</p>
            </div>
          ))}
        </motion.section>
      )}

      {tab === 'symptoms' && (
        <section className="space-y-4">
          <p className="rounded-3xl border border-primary-100 bg-primary-50 p-5 font-bold leading-7 text-primary-800">{t.learn.symptomsIntro}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {symptomCards.map((symptom) => (
              <div key={symptom.title} className="rounded-3xl border border-white/70 bg-card/80 p-5 shadow-petal">
                <AlertCircle className={symptom.severity === 'high' ? 'text-risk-high' : 'text-risk-moderate'} />
                <h3 className="mt-3 text-lg font-black leading-8 text-ink">{symptom.title}</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm font-bold leading-7 text-muted">
                  {symptom.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-black text-primary-700">
                  {symptom.severity === 'high' ? t.learn.severityHigh : t.learn.severityMedium}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'prevention' && (
        <section className="rounded-[2rem] border border-white/70 bg-card/80 p-5 shadow-petal">
          <p className="mb-5 font-medium leading-7 text-muted">{t.learn.preventionIntro}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {preventionChecklist.map((habit) => {
              const active = checked.includes(habit.title);
              return (
                <button
                  key={habit.title}
                  onClick={() =>
                    setChecked((items) => (active ? items.filter((item) => item !== habit.title) : [...items, habit.title]))
                  }
                  className={cn('flex min-h-14 items-center gap-3 rounded-2xl border p-4 text-start font-bold transition', active ? 'border-accent-teal bg-accent-teal/10 text-ink' : 'border-line bg-white/50 text-muted')}
                >
                  <span className={cn('grid h-7 w-7 place-items-center rounded-full border', active && 'border-accent-teal bg-accent-teal text-white')}>
                    {active && <Check size={16} />}
                  </span>
                  <span>
                    <span className="block text-sm font-black leading-6">{habit.title}</span>
                    <span className="block text-xs font-semibold leading-6 text-muted">{habit.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-5 text-sm font-black text-primary-700">
            {checked.length}/{preventionChecklist.length} {t.learn.checklistProgress}
          </p>
        </section>
      )}

      {tab === 'myths' && (
        <section className="grid gap-4 sm:grid-cols-2">
          {myths.map((item) => {
            const active = flipped.includes(item.myth);
            return (
              <button
                key={item.myth}
                onClick={() => setFlipped((items) => (active ? items.filter((myth) => myth !== item.myth) : [...items, item.myth]))}
                className="min-h-44 rounded-3xl border border-white/70 bg-card/80 p-5 text-start shadow-petal transition hover:-translate-y-1"
              >
                <ShieldCheck className="text-primary-500" />
                <p className="mt-3 text-xs font-black uppercase text-muted">{active ? t.learn.truthLabel : t.learn.mythLabel}</p>
                <h3 className="mt-2 text-lg font-black leading-8 text-ink">{active ? item.truth : item.myth}</h3>
                {active && <p className="mt-3 text-sm font-bold leading-7 text-muted">{item.details}</p>}
              </button>
            );
          })}
        </section>
      )}
    </PageTransition>
  );
}
