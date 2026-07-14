import { cn } from '@/utils/cn';

interface BrandImageProps {
  /** File stem in /public/assets, e.g. "sign-03" or "how-check". */
  name: string;
  /** REQUIRED, and translated. There is no such thing as an optional alt. */
  alt: string;
  /** Intrinsic size — reserves the box so the image never causes layout shift. */
  width: number;
  height: number;
  /**
   * The LCP image, if this page has one. Sets fetchpriority=high and eager
   * loading. At most ONE per page: marking everything high-priority is the same
   * as marking nothing.
   */
  priority?: boolean;
  className?: string;
}

/**
 * A generated brand illustration.
 *
 * These are SVG: they are geometry (see scripts/generate-assets.mjs), so they
 * are 4-30 KB, scale to any density for free, and never need a srcset. A raster
 * pipeline here would be all cost and no benefit.
 *
 * Everything below the hero is lazy and async-decoded; the hero opts in with
 * `priority`. width/height are always set, so the box is reserved before the
 * bytes arrive and the image contributes nothing to CLS.
 */
export function BrandImage({ name, alt, width, height, priority, className }: BrandImageProps) {
  return (
    <img
      src={`/assets/${name}.svg`}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={cn('block h-auto w-full select-none', className)}
      draggable={false}
    />
  );
}

interface AppScreenshotProps {
  /** File stem in /public/assets/screens. */
  name: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

/**
 * A real screenshot of the real app, inside a PhoneMockup.
 *
 * These are captured from the running product (scripts/capture-screens.mjs), not
 * mocked up in a design tool — so they cannot drift from what she actually sees,
 * and they are already in the right language and direction.
 *
 * AVIF first, WebP next, PNG last: a UI screenshot is flat colour and large
 * areas, which is exactly where AVIF wins hardest.
 */
export function AppScreenshot({ name, alt, priority, className }: AppScreenshotProps) {
  const base = `/assets/screens/${name}`;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}.avif`} />
      <source type="image/webp" srcSet={`${base}.webp`} />
      <img
        src={`${base}.png`}
        alt={alt}
        width={1170}
        height={2532}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={cn('block h-full w-full object-cover', className)}
        draggable={false}
      />
    </picture>
  );
}
