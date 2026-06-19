import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Baby, Calendar, Cigarette, Clock, Heart, Pill, Scale, Users } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { NavArrows } from '@/components/layout/NavArrows';
import { PreventionTracker } from '@/components/learn/PreventionTracker';
import { MythsWall } from '@/components/learn/MythsWall';
import { BodyMap } from '@/components/learn/BodyMap';
import { useLanguage } from '@/hooks/useLanguage';
import { usePersistedState } from '@/hooks/usePersistedState';
import { cn } from '@/utils/cn';

export function LearnPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const tabs = useMemo(() => Object.entries(t.learn.tabs), [t.learn.tabs]);
  const [tab, setTab] = usePersistedState<string>('sahtek_learn', tabs[0][0]);

  // Guard against a stale/invalid persisted tab key.
  useEffect(() => {
    if (!tabs.some(([key]) => key === tab)) setTab(tabs[0][0]);
  }, [tabs, tab, setTab]);

  const currentIndex = tabs.findIndex(([key]) => key === tab);
  const prevTab = currentIndex > 0 ? tabs[currentIndex - 1] : null;
  const nextTab = currentIndex < tabs.length - 1 ? tabs[currentIndex + 1] : null;

  const switchTab = (key: string) => {
    setTab(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPage = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hybrid arrows: step through tabs, then spill over to the adjacent pages.
  // First tab's "previous" goes Home; last tab's "next" goes to Self-Check.
  const prevTarget = prevTab
    ? { label: prevTab[1], aria: t.common.previous, onActivate: () => switchTab(prevTab[0]) }
    : { label: t.nav.home, aria: t.common.previous, onActivate: () => goPage('/') };
  const nextTarget = nextTab
    ? { label: nextTab[1], aria: t.common.next, onActivate: () => switchTab(nextTab[0]) }
    : { label: t.nav.selfCheck, aria: t.common.next, onActivate: () => goPage('/self-check') };

  return (
    <PageTransition>
      <div className="pb-20">
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <section className="grid gap-4 md:grid-cols-3">
            {t.learn.overviewStats.map(({ stat, text, statLabel }) => (
              <div key={stat} className="rounded-3xl border border-white/70 bg-card/80 p-6 shadow-petal">
                <Heart className="mb-5 text-primary-500" size={28} />
                <div className="text-3xl font-black text-gradient">
                  <span className="sr-only">{statLabel}: </span>
                  {stat}
                </div>
                <p className="mt-2 font-medium leading-7 text-muted">{text}</p>
              </div>
            ))}
          </section>

          {/* What is breast cancer? */}
          <section className="rounded-3xl border border-white/70 bg-card/80 p-6 shadow-petal">
            <h2 className="text-2xl font-black text-ink">{t.learn.overview.whatTitle}</h2>
            <p className="mt-3 max-w-3xl font-medium leading-8 text-muted">{t.learn.overview.whatBody}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {t.learn.overview.whatStats.map(({ value, label }) => (
                <div key={label} className="rounded-2xl border border-primary-100 bg-primary-50 p-4 text-center">
                  <div className="text-2xl font-black text-gradient">{value}</div>
                  <p className="mt-1 text-xs font-bold leading-5 text-primary-800">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why early detection? */}
          <section className="rounded-3xl border border-white/70 bg-card/80 p-6 shadow-petal">
            <h2 className="text-2xl font-black text-ink">{t.learn.overview.earlyTitle}</h2>
            <p className="mt-2 text-sm font-bold text-muted">{t.learn.overview.earlyNote}</p>
            <div className="mt-5 space-y-4">
              {t.learn.overview.earlyStages.map(({ label, percent }, i) => {
                const colors = ['bg-emerald-500', 'bg-amber-400', 'bg-orange-500', 'bg-red-500'];
                return (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-sm font-black text-ink">
                      <span>{label}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-line">
                      <motion.div
                        className={cn('h-full rounded-full', colors[i] ?? 'bg-primary-500')}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 rounded-2xl border border-primary-100 bg-primary-50 p-4 font-bold leading-7 text-primary-800">
              {t.learn.overview.earlyMessage}
            </p>
          </section>

          {/* Who is at risk? */}
          <section className="rounded-3xl border border-white/70 bg-card/80 p-6 shadow-petal">
            <h2 className="text-2xl font-black text-ink">{t.learn.overview.riskTitle}</h2>
            <p className="mt-2 max-w-3xl font-medium leading-7 text-muted">{t.learn.overview.riskIntro}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {t.learn.overview.riskFactors.map(({ title, desc }, i) => {
                const icons = [Calendar, Users, Scale, Cigarette, Clock, Baby, Pill];
                const Icon = icons[i] ?? Calendar;
                return (
                  <div key={title} className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-petal">
                    <Icon className="mb-2 text-primary-500" size={22} />
                    <h3 className="text-sm font-black leading-6 text-ink">{title}</h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-muted">{desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Your 3 lines of defense */}
          <section className="rounded-3xl border border-white/70 bg-card/80 p-6 shadow-petal">
            <h2 className="text-2xl font-black text-ink">{t.learn.overview.defenseTitle}</h2>
            <p className="mt-2 max-w-3xl font-medium leading-7 text-muted">{t.learn.overview.defenseIntro}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {t.learn.overview.defenseSteps.map(({ title, age, desc }, i) => (
                <div key={title} className="relative rounded-2xl border border-primary-100 bg-primary-50 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-base font-black text-white shadow-petal">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-black leading-7 text-ink">{title}</h3>
                  <p className="mt-1 text-xs font-black uppercase tracking-wide text-primary-700">{age}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      )}

      {tab === 'symptoms' && <BodyMap />}

      {tab === 'prevention' && <PreventionTracker />}

      {tab === 'myths' && <MythsWall />}
      </div>

      <NavArrows transitionKey={`learn-${tab}`} prev={prevTarget} next={nextTarget} />
    </PageTransition>
  );
}
