import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

interface DisclaimerProps {
  /** Show the longer paragraph instead of the one-liner. */
  full?: boolean;
  className?: string;
}

/** Medical disclaimer — required on every page that gives advice. */
export function Disclaimer({ full, className }: DisclaimerProps) {
  const { t } = useLanguage();
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border border-line bg-primary-50/60 px-4 py-3 dark:bg-primary-500/10',
        className,
      )}
      role="note"
    >
      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary-500" />
      <p className="text-xs leading-relaxed text-muted">{full ? t.disclaimer.full : t.disclaimer.short}</p>
    </div>
  );
}
