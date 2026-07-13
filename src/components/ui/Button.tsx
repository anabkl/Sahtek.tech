import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /**
   * In-app route. Renders the whole control as a single <a> — NOT a <button>
   * inside an <a>.
   *
   * `<Link><Button/></Link>` puts interactive content inside interactive
   * content: invalid HTML, and both elements are focusable, so a keyboard user
   * lands on the same CTA twice — once on the link, once on the button. Pass
   * `to` instead and there is one element and one tab stop.
   */
  to?: string;
}

const VARIANTS: Record<Variant, string> = {
  // brand-cta, not rose-gradient: white text on the decorative gradient's light
  // end is only 2.4:1. Every stop of the CTA gradient clears AA.
  primary:
    'bg-brand-cta text-white shadow-petal-lg hover:shadow-petal-xl hover:brightness-105',
  secondary:
    'bg-card text-ink border border-line shadow-petal hover:border-primary-200',
  outline:
    'bg-transparent text-primary-600 border-2 border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-500/10',
  ghost: 'bg-transparent text-ink hover:bg-primary-50 dark:hover:bg-primary-500/10',
  danger: 'bg-risk-high text-white shadow-petal-lg hover:brightness-105',
};

/* Heights are tap targets first: 44px is the floor, so `sm` is h-11, not h-10. */
const SIZES: Record<Size, string> = {
  sm: 'h-11 px-4 text-sm gap-1.5',
  md: 'h-12 px-6 text-[15px] gap-2',
  lg: 'h-14 px-8 text-base gap-2.5',
};

/** Primary design-system button — five variants, three sizes. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth,
    loading,
    leftIcon,
    rightIcon,
    disabled,
    className,
    children,
    to,
    ...props
  },
  ref,
) {
  const classes = cn(
    'focus-ring relative inline-flex select-none items-center justify-center rounded-full font-semibold',
    /* Microinteraction: a 1px lift on hover, a 3% press on tap. Both are
       CSS transforms — composited, and neutralised by the reduced-motion
       block in index.css, so they need no JS guard. The press is the one
       that matters: it is the only feedback a touch device gets, since a
       phone has no hover. */
    'transition-all duration-base ease-soft hover:-translate-y-px active:translate-y-0 active:scale-[0.97]',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  const body = (
    <>
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  // One element, one tab stop, valid HTML.
  if (to) {
    return (
      <Link to={to} className={classes}>
        {body}
      </Link>
    );
  }

  return (
    <button ref={ref} disabled={disabled || loading} className={classes} {...props}>
      {body}
    </button>
  );
});
