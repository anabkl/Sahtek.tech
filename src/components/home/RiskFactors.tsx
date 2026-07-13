import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Baby, Cigarette, Clock, Pill, Scale, UserRound, Users, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLanguage } from '@/hooks/useLanguage';

/* In the order of `learn.overview.riskFactors`: age · family history · weight
   and inactivity · smoking and alcohol · early periods or late menopause ·
   never breastfed · hormone therapy. */
const FACTOR_ICONS: LucideIcon[] = [UserRound, Users, Scale, Cigarette, Clock, Baby, Pill];

/**
 * Risk factors — education, not fear.
 *
 * The copy is `learn.overview.riskFactors`, reused rather than rewritten: it is
 * already framed the way the brand requires, and one set of words is one set of
 * words to keep true. `riskIntro` is the load-bearing sentence — having a risk
 * factor is not a verdict — so it opens the section rather than hiding at the
 * bottom.
 *
 * Deliberately NOT colour-coded by severity. A red/amber/green wall of factors
 * turns a woman's own history into a scoreboard, which is the opposite of the
 * feeling this section exists to create.
 */
export function RiskFactors() {
  const { t, isRTL } = useLanguage();
  const section = t.home.riskFactorsSection;
  const factors = t.learn.overview.riskFactors;

  return (
    <section className="py-12">
      <SectionHeading
        as="h2"
        size="h2"
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={t.learn.overview.riskIntro}
        accent
      />

      <motion.ul
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="rest"
        whileInView="shown"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ shown: { transition: { staggerChildren: 0.05 } } }}
      >
        {factors.map((factor, i) => {
          const Icon = FACTOR_ICONS[i] ?? UserRound;
          return (
            <motion.li
              key={factor.title}
              variants={{
                rest: { opacity: 0, y: 16 },
                shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
              className="flex gap-4 rounded-3xl border border-line bg-card p-5 shadow-petal"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text">
                <Icon size={20} aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="text-h4 text-ink">{factor.title}</h3>
                <p className="mt-1.5 text-body-sm text-muted">{factor.desc}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* The soft infographic block. Reserved at 16:9 so the grid above does
          not reflow when the real artwork lands. The alt is already written and
          translated — swap the whole element for an <img alt={section.infographicAlt}>. */}
      <div className="mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-line shadow-petal sm:aspect-[21/9]">
        <ImagePlaceholder
          spec="1680 × 720 px · 21:9 · SVG"
          altNote={section.infographicAlt}
          hint="Soft infographic: factors you can change vs. factors you cannot. No bodies, no clinical imagery."
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-5">
        <SafetyNote variant="care" className="w-full">
          {t.risk.intro}
        </SafetyNote>

        {/* /risk-factors, not /risk: this section teaches, so its CTA should
            keep teaching. The questionnaire is one click further on, from the
            bottom of that page — learn first, then assess. */}
        <Link to="/risk-factors">
          <Button
            variant="secondary"
            size="lg"
            rightIcon={<ArrowRight size={18} className={isRTL ? 'rotate-180' : undefined} />}
          >
            {section.cta}
          </Button>
        </Link>
      </div>
    </section>
  );
}
