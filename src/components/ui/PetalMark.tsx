import { useId } from 'react';
import { cn } from '@/utils/cn';

interface PetalMarkProps {
  /** 0-based. Each value yields a different, stable form. */
  variant: number;
  size?: number;
  className?: string;
}

/* A soft ceramic form — the vessel a sign is presented in.
 *
 * HOUSE RULE (CLAUDE.md §4.4, HARD RULES 3-6): this is a SYMBOLIC, ABSTRACT
 * shape. It is ornament and nothing more. It must never be used to depict a
 * sign on a body-like or fruit-like object — that is the awareness layout we
 * are explicitly not copying. The teaching lives in the label and the words;
 * this only holds them, the way a dish holds an offering. Always aria-hidden.
 *
 * The outline is a closed polar curve r(θ) = R·(1 + a·cos(kθ + φ)). Varying
 * k, a and φ per card gives twelve forms that are visibly siblings but never
 * identical — handmade, not stamped.
 */
function petalPath(variant: number): string {
  const cx = 50;
  const cy = 50;
  const radius = 38;

  // 3-6 gentle lobes, a shallow amplitude, and a rotation that never repeats
  // across the twelve. Deliberately small numbers: these are calm forms.
  const lobes = 3 + (variant % 4);
  const amplitude = 0.05 + (variant % 3) * 0.022;
  const phase = variant * 0.9;

  const steps = 120;
  const points = Array.from({ length: steps }, (_, i) => {
    const theta = (i / steps) * Math.PI * 2;
    const r = radius * (1 + amplitude * Math.cos(lobes * theta + phase));
    return `${(cx + r * Math.cos(theta)).toFixed(2)},${(cy + r * Math.sin(theta)).toFixed(2)}`;
  });

  return `M${points.join('L')}Z`;
}

export function PetalMark({ variant, size = 88, className }: PetalMarkProps) {
  const fillId = useId();
  const glazeId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn(className)}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="rgb(var(--brand-100))" />
          <stop offset="1" stopColor="rgb(var(--brand-200))" />
        </linearGradient>
        {/* The glaze: a soft highlight, so the form reads as ceramic and not
            as a flat blob. Kept faint — it is a suggestion of light. */}
        <radialGradient id={glazeId} cx="0.36" cy="0.3" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d={petalPath(variant)} fill={`url(#${fillId})`} />
      <path d={petalPath(variant)} fill={`url(#${glazeId})`} />
    </svg>
  );
}
