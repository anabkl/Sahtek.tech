import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Pointer, ShieldAlert, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

type Severity = 'high' | 'medium' | 'low';
type ZoneKey = 'breast' | 'underarm' | 'nipple' | 'skin' | 'collarbone';

interface Hotspot {
  id: string;
  zone: ZoneKey;
  top: string;
  left: string;
  severity: Severity;
}

/** Positions are % of the image box, so they scale with the 9:16 image. */
const HOTSPOTS: Hotspot[] = [
  { id: 'collarbone', zone: 'collarbone', top: '22%', left: '48%', severity: 'medium' },
  { id: 'underarm-right', zone: 'underarm', top: '28%', left: '28%', severity: 'high' },
  { id: 'underarm-left', zone: 'underarm', top: '28%', left: '68%', severity: 'high' },
  { id: 'breast-right', zone: 'breast', top: '32%', left: '38%', severity: 'high' },
  { id: 'breast-left', zone: 'breast', top: '32%', left: '58%', severity: 'high' },
  { id: 'nipple', zone: 'nipple', top: '33%', left: '48%', severity: 'high' },
  { id: 'skin', zone: 'skin', top: '38%', left: '48%', severity: 'medium' },
];

const dotColor = (s: Severity) => (s === 'high' ? '#DC2626' : '#F59E0B');

const SEVERITY_BADGE: Record<Severity, string> = {
  high: 'border-risk-high/30 bg-risk-high/10 text-risk-high',
  medium: 'border-risk-moderate/30 bg-risk-moderate/10 text-risk-moderate',
  low: 'border-amber-300/40 bg-amber-50 text-amber-700',
};

export function BodyMap() {
  const { t, isRTL } = useLanguage();
  const bm = t.learn.bodyMap;
  const [activeZone, setActiveZone] = useState<ZoneKey | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const select = (zone: ZoneKey) => {
    setActiveZone(zone);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    }
  };

  const zone = activeZone ? bm.zones[activeZone] : null;
  const severity = (zone?.severity ?? 'low') as Severity;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-ink">{bm.title}</h2>
        <p className="mt-1 max-w-2xl font-medium leading-7 text-muted">{bm.intro}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* LEFT — image body map (40%) */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-white/70 bg-gradient-to-b from-primary-100/50 to-primary-50 p-3 shadow-petal">
            <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px]">
              {/* The source PNG was 1536x2752 and 3.9 MB, painted at a maximum of
                  320 CSS px — a ~5x oversized image, and about forty seconds of
                  blank screen on the 3G a lot of this audience is actually on.
                  AVIF at the widths the layout can use is 23 KB: 172x smaller.

                  `sizes` tells the browser the real painted width BEFORE layout,
                  so it never downloads the 3x file for a 240px slot.
                  `loading="lazy"`: this sits inside a tab on /learn, below the
                  fold and often never opened.
                  width/height are the intrinsic ratio — they reserve the box and
                  keep this out of CLS. */}
              <picture>
                <source
                  type="image/avif"
                  srcSet="/assets/body-map-640.avif 640w, /assets/body-map-960.avif 960w"
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 240px"
                />
                <source
                  type="image/webp"
                  srcSet="/assets/body-map-640.webp 640w, /assets/body-map-960.webp 960w"
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 240px"
                />
                <img
                  src="/assets/body-map-640.png"
                  alt={bm.title}
                  width={640}
                  height={1146}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full select-none rounded-2xl"
                  draggable={false}
                />
              </picture>
              {/* Gradient fade hides the watermark at the bottom of the image */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] rounded-b-2xl bg-gradient-to-t from-primary-50 via-primary-50/90 to-transparent" />

              {HOTSPOTS.map((h) => {
                const color = dotColor(h.severity);
                const isActive = activeZone === h.zone;
                return (
                  <button
                    key={h.id}
                    type="button"
                    aria-label={bm.zones[h.zone].name}
                    aria-pressed={isActive}
                    onClick={() => select(h.zone)}
                    style={{ top: h.top, left: h.left }}
                    className="group absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center outline-none"
                  >
                    {/* Pulsing outer ring */}
                    <span
                      className="absolute h-7 w-7 motion-safe:animate-pulse-dot rounded-full md:h-5 md:w-5"
                      style={{ backgroundColor: color }}
                    />
                    {/* Solid inner dot */}
                    <span
                      className={cn(
                        'relative h-7 w-7 rounded-full border-2 border-white transition-transform duration-150 group-hover:scale-110 group-focus-visible:scale-110 md:h-5 md:w-5',
                        isActive && 'scale-110',
                      )}
                      style={{
                        backgroundColor: color,
                        boxShadow: isActive ? '0 0 0 4px rgba(255,255,255,0.95), 0 0 14px rgba(0,0,0,0.35)' : undefined,
                      }}
                    />
                    {/* Hover/focus tooltip */}
                    <span className="pointer-events-none absolute bottom-full mb-1 -translate-y-1 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white opacity-0 shadow-petal transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {bm.zones[h.zone].name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — detail panel (60%) */}
        <div ref={panelRef} className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!zone ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-primary-200 bg-primary-50/50 p-8 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                  <Pointer size={26} />
                </span>
                <p className="mt-4 max-w-xs text-lg font-bold leading-7 text-primary-800">{bm.defaultMessage}</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeZone}
                initial={{ opacity: 0, x: isRTL ? -32 : 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 32 : -32 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="rounded-3xl border border-white/70 bg-card/80 p-6 shadow-petal"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-black text-ink">{zone.name}</h3>
                  <span className={cn('rounded-full border px-3 py-1 text-xs font-black', SEVERITY_BADGE[severity])}>
                    {bm.severityLabels[severity]}
                  </span>
                </div>

                <ul className="mt-5 space-y-3">
                  {zone.symptoms.map((s) => (
                    <li key={s.title} className="rounded-2xl border border-line bg-white/60 p-4">
                      <h4 className="text-sm font-black leading-6 text-ink">{s.title}</h4>
                      <p className="mt-1 text-sm font-medium leading-6 text-muted">{s.desc}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <ShieldAlert className="mt-0.5 shrink-0 text-amber-600" size={20} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-amber-700">{bm.whenToWorryLabel}</p>
                    <p className="mt-1 text-sm font-bold leading-6 text-amber-900">{zone.whenToWorry}</p>
                  </div>
                </div>

                <Link
                  to={severity === 'high' ? '/reminder' : '/self-check'}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-500 px-5 text-sm font-black text-white shadow-petal transition hover:bg-primary-600"
                >
                  <Stethoscope size={18} />
                  {severity === 'high' ? bm.ctaDoctor : bm.ctaCheck}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom summary banner */}
      <p className="rounded-3xl border border-primary-100 bg-primary-50 p-5 text-center font-bold leading-7 text-primary-800">
        {bm.summaryBanner}
      </p>
    </section>
  );
}
