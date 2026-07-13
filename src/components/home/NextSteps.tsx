import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BellRing, CalendarClock, CircleCheck, Eye, MapPin, Stethoscope, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLanguage } from '@/hooks/useLanguage';
import { VIEWPORT, staggerContainer, staggerItem } from '@/motion/motion';

/* One lane per state, in i18n order: nothing unusual · a minor change · a
   change that lasted two weeks · a sign that needs prompt care.
 *
 * The escalation is carried by the ICON and the WORDS, not by colour. There is
 * no red lane: HARD RULE 3 rules out alarm framing, and a woman who has just
 * found something is the last person who should meet a red card. The most
 * urgent lane is `gold` — warm, attention-getting, calm. */
const LANES: { icon: LucideIcon; tile: string; edge: string }[] = [
  { icon: CircleCheck, tile: 'bg-calm-soft text-calm-text', edge: 'border-t-calm' },
  { icon: Eye, tile: 'bg-accent-soft text-accent-text', edge: 'border-t-accent' },
  { icon: CalendarClock, tile: 'bg-info-soft text-info-text', edge: 'border-t-info' },
  { icon: Stethoscope, tile: 'bg-gold-soft text-gold-text', edge: 'border-t-gold' },
];

/**
 * "What to do next" — the decision logic, as four lanes.
 *
 * This is the section that turns awareness into action, so it has to be usable
 * by someone who is frightened: each lane says what the state IS, what it
 * MEANS, and what to DO — in that order, in three separate blocks, so the
 * action is findable without reading the prose.
 *
 * It never diagnoses. "A change that lasted two weeks" is a description of
 * elapsed time, not a claim about her body.
 */
export function NextSteps() {
  const { t } = useLanguage();
  const section = t.home.nextSteps;

  return (
    <section className="py-12">
      <SectionHeading
        as="h2"
        size="h2"
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={section.subtitle}
        accent
      />

      <motion.ol
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
      >
        {section.cards.map((card, i) => {
          const { icon: Icon, tile, edge } = LANES[i];
          return (
            <motion.li
              key={card.state}
              variants={staggerItem}
              className={`flex flex-col rounded-3xl border border-t-4 border-line bg-card p-5 shadow-petal ${edge}`}
            >
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tile}`}>
                <Icon size={20} aria-hidden />
              </span>

              <h3 className="mt-4 text-h4 text-ink">{card.state}</h3>
              <p className="mt-1.5 text-body-sm text-muted">{card.meaning}</p>

              <p className="mt-4 border-t border-line pt-3 text-body-sm font-semibold text-ink">
                {card.action}
              </p>
            </motion.li>
          );
        })}
      </motion.ol>

      <SafetyNote variant="seeDoctor" className="mt-8">
        {section.note}
      </SafetyNote>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/doctors">
          <Button size="lg" fullWidth leftIcon={<MapPin size={18} />}>
            {section.ctaDoctors}
          </Button>
        </Link>
        <Link to="/reminder">
          <Button size="lg" variant="secondary" fullWidth leftIcon={<BellRing size={18} />}>
            {section.ctaReminder}
          </Button>
        </Link>
      </div>
    </section>
  );
}
