import { motion } from 'framer-motion';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RibbonMark } from '@/components/ui/RibbonMark';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * The closing invitation.
 *
 * `bg-brand-cta`, not `bg-rose-gradient`: white text on the decorative
 * gradient's light end measures 2.4:1. Every stop of the CTA gradient clears
 * AA. For the same reason the body copy is solid white — not white/85, which
 * measured 3.6:1 here. Hierarchy comes from size and weight instead.
 */
export function FinalCta() {
  const { t, isRTL } = useLanguage();
  const cta = t.home.finalCta;

  return (
    <section className="py-12">
      <motion.div
        className="relative isolate overflow-hidden rounded-[2rem] bg-brand-cta bg-[length:200%_200%] p-8 text-center shadow-petal-xl motion-safe:animate-gradient-pan sm:p-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <ZelligeAccent variant="field" tone="current" opacity={0.07} className="text-white" />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <RibbonMark size={52} tone="current" className="text-white" animated />

          <h2 className="mt-5 text-h1 text-white">{cta.title}</h2>
          <p className="mt-4 text-body-lg text-white">{cta.text}</p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button to="/self-check"
                variant="secondary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
              >
                {cta.primary}
              </Button>
            {/* Outline-on-gradient: a white hairline button. The ghost/outline
                variants are tuned for the light canvas and disappear here. */}
            <Button
              to="/learn"
              size="lg"
              fullWidth
              className="border-2 border-white/70 bg-transparent text-white shadow-none hover:bg-white/10"
            >
              {cta.secondary}
            </Button>
          </div>

          <p className="mt-7 flex items-center gap-2 text-caption font-bold text-white">
            <LockKeyhole size={14} aria-hidden />
            {t.home.trustNote}
          </p>

          <p className="mt-3 text-caption text-white">{cta.note}</p>
        </div>
      </motion.div>
    </section>
  );
}
