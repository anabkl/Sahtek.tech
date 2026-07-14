import { ArrowRight, Stethoscope } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * /faq — the same five questions the homepage answers, on their own URL.
 *
 * The copy is `home.faq`, reused rather than rewritten. That matters more here
 * than anywhere: the FAQPage JSON-LD is generated from the SAME array, so the
 * question Google shows in a rich result is guaranteed to be the question the
 * page actually answers. Two copies would eventually disagree, and the one that
 * disagrees in public is the snippet.
 *
 * Semantics: each question is a real <h3> inside a disclosure button with
 * aria-expanded, and each answer a labelled region — which is what makes the
 * markup both accessible and legible to a crawler.
 */
export function FaqPage() {
  const { t, isRTL } = useLanguage();
  const faq = t.home.faq;

  return (
    <PageTransition>
      <section className="relative isolate py-8 lg:py-12">
        <div aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10">
          <div className="absolute -start-10 -top-10 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <ZelligeAccent variant="field" tone="brand" opacity={0.05} />
          </div>
        </div>

        <div className="max-w-prose">
          <span className="mb-4 inline-flex items-center gap-2 rounded-pill border border-line bg-card/70 px-4 py-2 text-caption font-bold text-accent-text shadow-petal backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-calm" />
            {faq.eyebrow}
          </span>

          <h1 className="text-balance text-display text-ink">{faq.title}</h1>

          <Disclaimer className="mt-6" />
        </div>
      </section>

      <section className="py-6">
        <Accordion
          className="mx-auto max-w-prose"
          headingLevel="h2"
          defaultOpen={['q0']}
          items={faq.items.map((item, i) => ({
            id: `q${i}`,
            question: item.q,
            answer: item.a,
          }))}
        />
      </section>

      <section className="py-10">
        <SectionHeading as="h2" size="h3" title={t.whenToSeekPage.title} accent />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            to="/when-to-seek-help"
            size="lg"
            fullWidth
            leftIcon={<Stethoscope size={18} />}
          >
            {t.whenToSeekPage.eyebrow}
          </Button>
          <Button
            to="/self-check"
            size="lg"
            variant="secondary"
            fullWidth
            rightIcon={<ArrowRight size={20} className={isRTL ? 'rotate-180' : undefined} />}
          >
            {t.selfCheck.startBtn}
          </Button>
        </div>
      </section>
    </PageTransition>
  );
}
