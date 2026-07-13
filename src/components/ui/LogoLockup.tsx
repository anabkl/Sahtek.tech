import { RibbonMark } from '@/components/ui/RibbonMark';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

interface LogoLockupProps {
  /** 'sm' for the navbar, 'lg' for the footer / splash. */
  size?: 'sm' | 'lg';
  /** Hide the wordmark and show only the ribbon tile (tight spaces). */
  markOnly?: boolean;
  /** Show the tagline under the name. Off by default; the navbar shows it ≥sm. */
  showTagline?: boolean;
  className?: string;
}

const TILE = {
  sm: 'h-11 w-11 rounded-2xl',
  lg: 'h-14 w-14 rounded-3xl',
};

const NAME = {
  sm: 'text-lg',
  lg: 'text-h3',
};

/**
 * The Sahtek logo lockup: the ribbon mark on a brand tile + the wordmark.
 *
 * The tile uses `bg-brand-cta` (not the decorative gradient) so the white
 * ribbon clears contrast. The mark is decorative — the accessible name comes
 * from the link that wraps this, so nothing here is announced twice.
 *
 * @example
 * <Link to="/" aria-label={t.app.name}><LogoLockup /></Link>
 */
export function LogoLockup({ size = 'sm', markOnly, showTagline, className }: LogoLockupProps) {
  const { t } = useLanguage();

  return (
    <span className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <span
        className={cn(
          'grid shrink-0 place-items-center bg-brand-cta text-white shadow-petal-lg',
          TILE[size],
        )}
      >
        <RibbonMark tone="current" size={size === 'lg' ? 30 : 24} />
      </span>

      {!markOnly && (
        <span className="min-w-0">
          <span className={cn('block font-black leading-tight text-ink', NAME[size])}>{t.app.name}</span>
          {showTagline && (
            <span className="block truncate text-caption font-semibold text-muted">{t.app.tagline}</span>
          )}
        </span>
      )}
    </span>
  );
}
