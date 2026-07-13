import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface AccordionItem {
  /** Stable key. Also used to build the aria ids. */
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once. Default: one at a time. */
  allowMultiple?: boolean;
  /** Ids open on first render. */
  defaultOpen?: string[];
  /** Heading level wrapping each trigger — keeps the page outline legal. */
  headingLevel?: 'h2' | 'h3' | 'h4';
  className?: string;
}

/**
 * Disclosure list — for FAQs and myth-busting.
 *
 * Accessibility: each trigger is a real <button> inside a heading, carries
 * `aria-expanded` and `aria-controls`, and the panel is a `region` labelled by
 * its trigger. Collapsed panels are unmounted, so their content is out of the
 * tab order and invisible to screen readers.
 *
 * @example
 * <Accordion headingLevel="h3" items={[
 *   { id: 'pain', question: 'Does a lump always hurt?', answer: 'No — most do not.' },
 * ]} />
 */
export function Accordion({
  items,
  allowMultiple,
  defaultOpen = [],
  headingLevel: Heading = 'h3',
  className,
}: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    setOpen((current) => {
      const isOpen = current.includes(id);
      if (allowMultiple) return isOpen ? current.filter((x) => x !== id) : [...current, id];
      return isOpen ? [] : [id];
    });
  };

  return (
    <div className={cn('divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <Heading className="m-0">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="focus-ring flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-start text-body font-bold text-ink transition hover:bg-sunken"
              >
                <span className="min-w-0">{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0 text-accent-text"
                  aria-hidden
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
            </Heading>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-body-sm leading-relaxed text-muted">{item.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
