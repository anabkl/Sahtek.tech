import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, Heart, ShieldCheck } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

const symptomKeys = ['Lump or swelling', 'Skin dimpling', 'Nipple discharge', 'New breast pain'];
const habits = ['Monthly self-check', 'Yearly doctor visit', 'Move 30 minutes', 'Eat fruit and vegetables', 'Avoid smoking', 'Sleep and reduce stress'];
const myths = [
  ['Only older women get breast cancer.', 'It can happen at different ages. Awareness matters for everyone.'],
  ['No family history means no risk.', 'Most cases are not linked to a known family history.'],
  ['Every lump is cancer.', 'Many lumps are benign, but a doctor should check new changes.'],
  ['Self-check replaces doctors.', 'Self-check supports awareness, but medical screening remains important.'],
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
            ['99%', t.home.stats[1].caption],
            ['5', t.home.stats[2].caption],
            ['48', 'Average diagnosis age reported in Morocco awareness campaigns.'],
          ].map(([stat, text]) => (
            <div key={stat} className="rounded-3xl border border-white/70 bg-card/80 p-6 shadow-petal">
              <Heart className="mb-5 text-primary-500" size={28} />
              <div className="text-4xl font-black text-gradient">{stat}</div>
              <p className="mt-2 font-medium leading-7 text-muted">{text}</p>
            </div>
          ))}
        </motion.section>
      )}

      {tab === 'symptoms' && (
        <section className="space-y-4">
          <p className="rounded-3xl border border-primary-100 bg-primary-50 p-5 font-bold leading-7 text-primary-800">{t.learn.symptomsIntro}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {symptomKeys.map((symptom, index) => (
              <div key={symptom} className="rounded-3xl border border-white/70 bg-card/80 p-5 shadow-petal">
                <AlertCircle className={index < 3 ? 'text-risk-high' : 'text-risk-moderate'} />
                <h3 className="mt-3 text-xl font-black text-ink">{symptom}</h3>
                <p className="mt-2 text-sm font-bold text-muted">{index < 3 ? t.learn.severityHigh : t.learn.severityMedium}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'prevention' && (
        <section className="rounded-[2rem] border border-white/70 bg-card/80 p-5 shadow-petal">
          <p className="mb-5 font-medium leading-7 text-muted">{t.learn.preventionIntro}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {habits.map((habit) => {
              const active = checked.includes(habit);
              return (
                <button
                  key={habit}
                  onClick={() => setChecked((items) => (active ? items.filter((item) => item !== habit) : [...items, habit]))}
                  className={cn('flex min-h-14 items-center gap-3 rounded-2xl border p-4 text-start font-bold transition', active ? 'border-accent-teal bg-accent-teal/10 text-ink' : 'border-line bg-white/50 text-muted')}
                >
                  <span className={cn('grid h-7 w-7 place-items-center rounded-full border', active && 'border-accent-teal bg-accent-teal text-white')}>
                    {active && <Check size={16} />}
                  </span>
                  {habit}
                </button>
              );
            })}
          </div>
          <p className="mt-5 text-sm font-black text-primary-700">{checked.length}/{habits.length} {t.learn.checklistProgress}</p>
        </section>
      )}

      {tab === 'myths' && (
        <section className="grid gap-4 sm:grid-cols-2">
          {myths.map(([myth, truth]) => {
            const active = flipped.includes(myth);
            return (
              <button
                key={myth}
                onClick={() => setFlipped((items) => (active ? items.filter((item) => item !== myth) : [...items, myth]))}
                className="min-h-44 rounded-3xl border border-white/70 bg-card/80 p-5 text-start shadow-petal transition hover:-translate-y-1"
              >
                <ShieldCheck className="text-primary-500" />
                <p className="mt-3 text-xs font-black uppercase text-muted">{active ? t.learn.truthLabel : t.learn.mythLabel}</p>
                <h3 className="mt-2 text-xl font-black leading-7 text-ink">{active ? truth : myth}</h3>
              </button>
            );
          })}
        </section>
      )}
    </PageTransition>
  );
}
