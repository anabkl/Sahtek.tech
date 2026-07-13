import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { cn } from '@/utils/cn';

interface ImagePlaceholderProps {
  /** Intended export size of the real asset, e.g. "1170 × 2532". */
  spec: string;
  /**
   * The alt text the real asset must ship with. Pass the *translated* string
   * (e.g. `t.home.previewAlt`) — it is shown here so whoever drops the image in
   * can see the alt is already written and wired to i18n.
   */
  altNote: string;
  /** Extra guidance for the person producing the asset. */
  hint?: string;
  className?: string;
}

/**
 * TEMPORARY SCAFFOLDING — a reserved slot for an image that does not exist yet.
 *
 * It holds the real asset's aspect ratio so the layout never reflows when the
 * screenshot lands, and it states, on the surface itself, the two things that
 * get lost in a handoff: the export size and the alt text.
 *
 * Replace the whole element with an `<img>` when the asset arrives:
 *
 *   <img src="/screens/self-check.png" alt={t.home.previewAlt} />
 *
 * The label is intentionally dev-facing and not translated: it is build
 * scaffolding, not product copy, and it ships with no real asset behind it.
 * Delete this component once every slot is filled.
 */
export function ImagePlaceholder({ spec, altNote, hint, className }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'relative grid h-full w-full place-items-center overflow-hidden',
        'border-2 border-dashed border-primary-200 bg-rose-soft',
        className,
      )}
      role="img"
      aria-label={altNote}
    >
      <ZelligeAccent variant="field" tone="brand" opacity={0.06} />

      {/* dir="ltr": the spec and hint are Latin dev-facing text. Left in the
          page direction they get reordered by the bidi algorithm under `ar`,
          and "1170 × 2532 px" comes out as "px · 2532 × 1170". A translated
          alt in Arabic still renders RTL correctly as an embedded run. */}
      <div dir="ltr" className="relative flex max-w-[15rem] flex-col items-center px-5 text-center">
        <ZelligeAccent variant="seal" tone="brand" opacity={0.4} size={44} />

        <span className="mt-3 text-overline uppercase text-accent-text">Image slot</span>
        <span className="mt-1 font-mono text-caption font-bold text-ink">{spec}</span>

        {hint && <span className="mt-2 text-caption leading-relaxed text-muted">{hint}</span>}

        <span className="mt-3 border-t border-line pt-2 text-caption italic leading-relaxed text-muted">
          alt: “{altNote}”
        </span>
      </div>
    </div>
  );
}
