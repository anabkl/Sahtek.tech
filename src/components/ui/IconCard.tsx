import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

type Tone = 'brand' | 'calm' | 'gold' | 'info';

interface IconCardProps {
  /** A lucide icon component, e.g. `HeartPulse`. Passed, not rendered. */
  icon: ComponentType<{ size?: number | string; className?: string }>;
  title: string;
  description?: ReactNode;
  /** In-app route. Renders the whole card as a link, tappable edge to edge. */
  to?: string;
  onClick?: () => void;
  tone?: Tone;
  className?: string;
}

/* The icon tile is a filled shape carrying a white glyph, so it must use a
   background that clears 3:1 with white — never the decorative gradient. */
const TILES: Record<Tone, string> = {
  brand: 'bg-brand-cta text-white',
  calm: 'bg-calm text-white',
  gold: 'bg-gold text-sand-900',
  info: 'bg-info text-white',
};

/**
 * A feature card: icon tile, title, short description. The whole card is the
 * tap target (min-h-[7.5rem], well over the 44px floor).
 *
 * Renders an <a> when `to` is set, a <button> when `onClick` is, and a plain
 * <div> otherwise — so it is never a fake button that a keyboard can't reach.
 *
 * @example
 * <IconCard icon={HeartPulse} to="/self-check" title="Self-check"
 *           description="Five guided minutes, once a month." />
 */
export function IconCard({ icon: Icon, title, description, to, onClick, tone = 'brand', className }: IconCardProps) {
  const body = (
    <>
      <span className={cn('mb-4 grid h-12 w-12 place-items-center rounded-xl shadow-petal', TILES[tone])}>
        <Icon size={22} aria-hidden />
      </span>
      <h3 className="text-h4 text-ink">{title}</h3>
      {description && <p className="mt-2 text-body-sm text-muted">{description}</p>}
    </>
  );

  const shell = cn(
    'group flex min-h-[7.5rem] flex-col rounded-2xl border border-line bg-card p-5 text-start shadow-petal',
    'transition duration-base ease-soft',
    (to || onClick) && 'focus-ring cursor-pointer hover:-translate-y-1 hover:shadow-petal-lg active:translate-y-0',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={shell}>
        {body}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={shell}>
        {body}
      </button>
    );
  }

  return <div className={shell}>{body}</div>;
}
