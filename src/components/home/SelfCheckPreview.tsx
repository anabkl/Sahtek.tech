import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * The guided self-check, previewed.
 *
 * Text and device alternate sides down the page. `order` is a flow property,
 * not a physical one, so the alternation survives the RTL flip untouched —
 * no `lg:left-*` anywhere.
 */
export function SelfCheckPreview() {
  const { t, isRTL } = useLanguage();
  const section = t.home.selfCheckPreview;

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

      <ol className="mt-12 flex flex-col gap-14 lg:gap-20">
        {section.steps.map((step, i) => {
          const deviceFirst = i % 2 === 1;

          return (
            <motion.li
              key={step.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className={deviceFirst ? 'lg:order-2' : undefined}>
                <span className="font-serif text-h3 text-gold-text">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-h3 text-ink">{step.title}</h3>
                <p className="mt-3 max-w-prose text-body text-muted">{step.desc}</p>
              </div>

              <div className={deviceFirst ? 'lg:order-1' : undefined}>
                <PhoneMockup glow>
                  <ImagePlaceholder
                    spec="1170 × 2532 px · 9:19.5 · PNG"
                    altNote={step.imageAlt}
                    hint={`Self-check screen, step ${i + 1} of the flow.`}
                  />
                </PhoneMockup>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-14 flex justify-center">
        <Link to="/self-check">
          <Button
            size="lg"
            rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
          >
            {section.cta}
          </Button>
        </Link>
      </div>
    </section>
  );
}
