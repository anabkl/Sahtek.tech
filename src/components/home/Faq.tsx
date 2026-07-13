import { Accordion } from '@/components/ui/Accordion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * FAQ. The five questions a woman actually asks before she trusts a health app:
 * is it a diagnosis, is it private, is it in my language, when do I see someone,
 * and do I have to sign up.
 *
 * The first panel is open by default — "Is this a diagnosis tool?" is the
 * question the whole product hinges on, and the answer is No. It should not
 * require a click.
 */
export function Faq() {
  const { t } = useLanguage();
  const section = t.home.faq;

  return (
    <section className="py-12">
      <SectionHeading as="h2" size="h2" eyebrow={section.eyebrow} title={section.title} accent />

      <Accordion
        className="mx-auto mt-10 max-w-prose"
        headingLevel="h3"
        defaultOpen={['q0']}
        items={section.items.map((item, i) => ({
          id: `q${i}`,
          question: item.q,
          answer: item.a,
        }))}
      />
    </section>
  );
}
