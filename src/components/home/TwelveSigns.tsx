import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { Modal } from '@/components/ui/Modal';
import { PetalMark } from '@/components/ui/PetalMark';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SIGN_ICONS } from '@/data/signs';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * The 12 signs — "Care Cards".
 *
 * Twelve collectible cards, each a soft ceramic form holding one change worth
 * knowing. The sign is taught by its LABEL and its WORDS; the form is ornament
 * (see PetalMark). We do not draw a sign onto a fruit or a body — CLAUDE.md
 * HARD RULE 6 rules that layout out, and our symptom teaching is our own.
 *
 * Structure is motion-ready: the grid is a `motion.ul` with a stagger variant
 * already wired, so tuning the entrance later is a one-line change.
 */
export function TwelveSigns() {
  const { t, isRTL } = useLanguage();
  const [openSign, setOpenSign] = useState<number | null>(null);

  const signs = t.home.signs;
  const active = openSign === null ? null : signs.items[openSign];

  return (
    <section className="py-12">
      <SectionHeading
        as="h2"
        size="h2"
        eyebrow={signs.eyebrow}
        title={signs.title}
        subtitle={signs.subtitle}
        accent
      />

      <motion.ul
        className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        initial="rest"
        whileInView="shown"
        /* `amount: 0.1` — reveal as soon as a sliver of the grid is on screen.
           A stricter threshold (or an inset margin) risks a grid that is in
           view but not "in view enough", which would leave the signature
           section sitting at opacity 0. Fail toward showing the content. */
        viewport={{ once: true, amount: 0.1 }}
        variants={{ shown: { transition: { staggerChildren: 0.04 } } }}
      >
        {signs.items.map((sign, i) => {
          const Icon = SIGN_ICONS[i];
          return (
            <motion.li
              key={sign.label}
              variants={{
                rest: { opacity: 0, y: 16 },
                shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
              className="flex"
            >
              <button
                type="button"
                onClick={() => setOpenSign(i)}
                aria-haspopup="dialog"
                className="focus-ring group relative flex w-full flex-col items-center overflow-hidden rounded-3xl border border-line bg-card p-4 text-center shadow-petal transition duration-base ease-soft hover:-translate-y-1 hover:shadow-petal-lg active:translate-y-0"
              >
                {/* The collectible's number. Fraunces — the one editorial lever
                    we have, and the reason the serif is loaded at all. */}
                <span className="absolute start-3 top-2 font-serif text-body-sm font-semibold text-gold-text">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="relative grid h-24 w-24 place-items-center">
                  <PetalMark
                    variant={i}
                    size={92}
                    className="absolute inset-0 m-auto transition-transform duration-slow ease-soft group-hover:scale-105"
                  />
                  <Icon size={26} className="relative text-accent-text" aria-hidden />
                </span>

                <span className="mt-3 text-body-sm font-bold leading-snug text-ink">{sign.label}</span>

                <span className="mt-2 inline-flex items-center gap-1 text-caption font-bold text-accent-text">
                  {signs.cardCta}
                  <ArrowRight size={13} className={isRTL ? 'rotate-180' : undefined} aria-hidden />
                </span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>

      <div className="mt-8 flex justify-center">
        <Link to="/signs">
          <Button
            variant="secondary"
            size="lg"
            rightIcon={<ArrowRight size={18} className={isRTL ? 'rotate-180' : undefined} />}
          >
            {signs.allCta}
          </Button>
        </Link>
      </div>

      <Modal open={active !== null} onClose={() => setOpenSign(null)} title={active?.label}>
        {active && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <PetalMark variant={openSign ?? 0} size={104} />
            </div>

            <div>
              <h4 className="text-overline uppercase text-accent-text">{signs.whatToNotice}</h4>
              <p className="mt-1.5 text-body text-muted">{active.detail}</p>
            </div>

            {/* Calm, never alarming — `seeDoctor` is deliberately not red. */}
            <SafetyNote variant="seeDoctor" title={signs.nextStepTitle}>
              {signs.nextStepText}
            </SafetyNote>

            <Disclaimer />
          </div>
        )}
      </Modal>
    </section>
  );
}
