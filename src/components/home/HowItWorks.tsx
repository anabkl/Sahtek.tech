import { motion } from 'framer-motion';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLanguage } from '@/hooks/useLanguage';
import { VIEWPORT, staggerContainer, staggerItem } from '@/motion/motion';

/**
 * How it works — discover → check → understand → act.
 *
 * A timeline, not four loose cards: a gold hairline runs behind the numbered
 * discs on desktop, so the eye reads it as one journey. The discs sit on
 * `bg-card` to punch through the line. On mobile the line is dropped and the
 * steps simply stack — a vertical rail next to a stacked column reads as a
 * checklist, which is the wrong feeling for a first-time visitor.
 */
export function HowItWorks() {
  const { t } = useLanguage();
  const section = t.home.howItWorks;

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
        className="relative mt-10 grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
      >
        {/* The rail. Decorative, so it is hidden from assistive tech — the
            <ol> already says "these are ordered steps". */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-6 hidden h-px bg-gold/30 lg:block"
        />

        {section.steps.map((step, i) => (
          <motion.li
            key={step.title}
            variants={staggerItem}
            className="relative flex flex-col"
          >
            <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-line bg-card font-serif text-h4 text-gold-text shadow-petal">
              {i + 1}
            </span>

            <div className="mt-4 flex flex-1 flex-col rounded-3xl border border-line bg-card p-4 shadow-petal">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <ImagePlaceholder spec="960 × 720 px · 4:3" altNote={step.imageAlt} />
              </div>

              <h3 className="mt-4 text-h4 text-ink">{step.title}</h3>
              <p className="mt-1.5 text-body-sm text-muted">{step.desc}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
