import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
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
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'focus-ring relative inline-flex select-none items-center justify-center rounded-full font-semibold',
        'transition-all duration-200 active:scale-[0.97]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
