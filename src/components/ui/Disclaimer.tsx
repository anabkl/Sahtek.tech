import { SafetyNote } from '@/components/ui/SafetyNote';
import { useLanguage } from '@/hooks/useLanguage';

interface DisclaimerProps {
  /** Show the longer paragraph instead of the one-liner. */
  full?: boolean;
  /** Show the "Medical disclaimer" heading above the text. */
  withTitle?: boolean;
  className?: string;
}

/**
 * The standing medical disclaimer, wired to i18n.
 *
 * REQUIRED on every page that educates, scores, guides or answers a question
 * (CLAUDE.md HARD RULE 2). Use `full` where advice is most consequential — the
 * risk result, the self-check outcome, the chat.
 *
 * @example
 * <Disclaimer />              // one-liner, e.g. under a Learn section
 * <Disclaimer full withTitle /> // the full note, e.g. on the risk result
 */
export function Disclaimer({ full, withTitle, className }: DisclaimerProps) {
  const { t } = useLanguage();

  return (
    <SafetyNote variant="medical" title={withTitle ? t.disclaimer.title : undefined} className={className}>
      {full ? t.disclaimer.full : t.disclaimer.short}
    </SafetyNote>
  );
}
