import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, CalendarHeart, HeartPulse, LockKeyhole, Sparkles, Stethoscope } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';

const icons = [Sparkles, HeartPulse, Stethoscope, Bot];

export function HomePage() {
  const { t, isRTL } = useLanguage();

  return (
    <PageTransition>
      <section className="grid gap-8 py-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/70 px-4 py-2 text-sm font-black text-primary-700 shadow-petal"
          >
            <span className="h-2 w-2 rounded-full bg-accent-teal shadow-[0_0_0_6px_rgba(20,184,166,0.12)]" />
            {t.home.badge}
          </motion.div>
          <h1 className="max-w-3xl text-5xl font-black leading-tight text-ink sm:text-6xl lg:text-7xl">
            {t.home.heroTitle}{' '}
            <span className="text-gradient block sm:inline">{t.home.heroHighlight}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-muted">{t.home.heroSubtitle}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/self-check">
              <Button size="lg" fullWidth rightIcon={<ArrowRight className={isRTL ? 'rotate-180' : ''} size={20} />}>
                {t.home.ctaPrimary}
              </Button>
            </Link>
            <Link to="/learn">
              <Button size="lg" variant="secondary" fullWidth>
                {t.home.ctaSecondary}
              </Button>
            </Link>
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-muted">
            <LockKeyhole size={16} className="text-primary-500" />
            {t.home.trustNote}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-5 shadow-petal-xl backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,92,149,0.28),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.18),transparent_30%)]" />
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-14 h-52 w-32 -translate-x-1/2 rounded-full border-[22px] border-primary-500/90 shadow-petal-xl"
            animate={{ rotate: [-8, 7, -8], y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/80 bg-card/85 p-5 shadow-petal-xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-black text-primary-700">{t.common.demoMode}</span>
              <span className="rounded-full bg-accent-teal/10 px-3 py-1 text-xs font-black text-accent-teal">AI</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {t.home.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-primary-50/80 p-3 text-center">
                  <AnimatedNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="block text-2xl font-black text-primary-700"
                  />
                  <span className="text-xs font-bold text-muted">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-black text-ink">{t.home.featuresTitle}</h2>
        <p className="mt-2 max-w-2xl font-medium text-muted">{t.home.featuresSubtitle}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.features.map((feature, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <Link
                key={feature.title}
                to={['/learn', '/self-check', '/risk', '/chat'][index]}
                className="group rounded-3xl border border-white/70 bg-card/80 p-5 shadow-petal transition hover:-translate-y-1 hover:shadow-petal-lg"
              >
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-cta text-white shadow-petal">
                  <Icon size={22} />
                </span>
                <h3 className="text-lg font-black text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-muted">{feature.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="my-8 overflow-hidden rounded-[2rem] bg-brand-cta p-6 text-white shadow-petal-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CalendarHeart size={34} />
            <h2 className="mt-3 text-3xl font-black">{t.home.bannerTitle}</h2>
            {/* Solid white: white/85 measured 3.6:1 on the gradient. Hierarchy
                comes from weight and size here, not from transparency. */}
            <p className="mt-2 max-w-2xl text-white">{t.home.bannerText}</p>
          </div>
          <Link to="/self-check">
            <Button variant="secondary" size="lg">{t.home.bannerCta}</Button>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
