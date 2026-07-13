
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { RibbonMark } from '@/components/ui/RibbonMark';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * The assistant, presented as a companion — never as a clinician.
 *
 * The order of this section is the argument: what it is NOT (subtitle), what it
 * helps with, what it cannot do (safety note), and where the words go (privacy
 * note). The CTA comes last, once she knows what she is opening.
 *
 * The phone holds live JSX rather than a screenshot placeholder: this is a
 * conversation, and a real one costs nothing to render and never goes stale.
 * The copy is `t.home.companion.mock` — it is a written sample, not a recording
 * of anyone's chat.
 */
export function Companion() {
  const { t, isRTL } = useLanguage();
  const companion = t.home.companion;

  return (
    <section className="py-12">
      <SectionHeading
        as="h2"
        size="h2"
        eyebrow={companion.eyebrow}
        title={companion.title}
        subtitle={companion.subtitle}
        accent
      />

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h3 className="text-overline uppercase text-accent-text">{companion.helpsWithTitle}</h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {companion.helpsWith.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-body text-muted">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-calm-soft text-calm-text">
                  <Check size={12} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-overline uppercase text-accent-text">{companion.sampleTitle}</h3>
          {/* The sample questions are the chat's own quick replies — the same
              words she will see when she gets there. */}
          <ul className="mt-3 flex flex-wrap gap-2">
            {t.chat.quickReplies.map((question) => (
              <li
                key={question}
                className="rounded-pill border border-line bg-card px-3.5 py-2 text-caption font-bold text-ink shadow-petal"
              >
                {question}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <SafetyNote variant="medical">{companion.safetyNote}</SafetyNote>
            <SafetyNote variant="privacy">{companion.privacyNote}</SafetyNote>
          </div>

          <div className="mt-7">
            <Button to="/chat"
                size="lg"
                rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
              >
                {companion.cta}
              </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          <PhoneMockup glow>
            <div className="flex h-full flex-col bg-canvas">
              <div className="flex items-center gap-2 border-b border-line px-4 pb-3 pt-9">
                <RibbonMark size={22} />
                <span className="text-caption font-bold text-ink">{t.common.assistant}</span>
                <span className="ms-auto inline-flex items-center gap-1 text-[10px] font-bold text-calm-text">
                  <Sparkles size={10} aria-hidden />
                  {t.chat.online}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 px-4 py-4">
                <p className="ms-auto max-w-[85%] rounded-2xl rounded-ee-sm bg-brand-cta px-3 py-2 text-caption leading-relaxed text-white">
                  {companion.mock.question}
                </p>
                <p className="me-auto max-w-[90%] rounded-2xl rounded-es-sm border border-line bg-card px-3 py-2 text-caption leading-relaxed text-ink">
                  {companion.mock.answer}
                </p>

                <p className="mt-auto rounded-xl bg-accent-soft px-3 py-2 text-[10px] leading-relaxed text-muted">
                  {t.chat.disclaimer}
                </p>
              </div>
            </div>
          </PhoneMockup>
        </motion.div>
      </div>
    </section>
  );
}
