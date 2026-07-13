import type { ReactNode } from 'react';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  /** Small label above the title. */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /**
   * The heading level. Pick the one the document outline needs — do NOT pick by
   * size. Size comes from `size`; these are independent on purpose.
   */
  as?: 'h1' | 'h2' | 'h3';
  size?: 'display' | 'h1' | 'h2' | 'h3';
  align?: 'start' | 'center';
  /** A khatam divider under the heading. Understated by default. */
  accent?: boolean;
  /** Anchor id, so a nav or skip-link can target the section. */
  id?: string;
  className?: string;
}

const SIZES = {
  display: 'text-display',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
};

/**
 * Section header: eyebrow + title + subtitle, with the heading level decoupled
 * from the visual size so pages keep a legal h1→h2→h3 outline.
 *
 * @example
 * <SectionHeading as="h2" size="h2" eyebrow="Learn"
 *   title="Know what matters" subtitle="Five minutes, once a month." accent />
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  as: Tag = 'h2',
  size = 'h2',
  align = 'start',
  accent,
  id,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div className={cn(centered && 'flex flex-col items-center text-center', className)}>
      {eyebrow && (
        <span className="mb-2 block text-overline uppercase text-accent-text">{eyebrow}</span>
      )}

      <Tag id={id} className={cn(SIZES[size], 'text-balance text-ink')}>
        {title}
      </Tag>

      {subtitle && (
        <p className={cn('mt-3 max-w-prose text-body-lg text-muted', centered && 'mx-auto')}>{subtitle}</p>
      )}

      {accent && (
        <ZelligeAccent
          variant="divider"
          tone="gold"
          opacity={0.45}
          className={cn('mt-5 max-w-[16rem]', centered && 'mx-auto')}
        />
      )}
    </div>
  );
}
