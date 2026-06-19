import { useState } from 'react';
import { useLanguage, interpolate } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

type Myth = { id: string; myth: string; truth: string };

const STORAGE_KEY = 'sahtek.myths.flipped';
/** Per-row marquee timing — varied for an organic, layered feel. */
const ROW_DURATIONS = [32, 26, 36];
const EDGE_MASK =
  'linear-gradient(to right, transparent, black 5%, black 95%, transparent)';

function loadFlipped(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function MythCard({
  data,
  flipped,
  onToggle,
  mythLabel,
  truthLabel,
  dir,
  duplicate,
}: {
  data: Myth;
  flipped: boolean;
  onToggle: (id: string) => void;
  mythLabel: string;
  truthLabel: string;
  dir: 'rtl' | 'ltr';
  duplicate?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(data.id)}
      dir={dir}
      // The duplicated set is purely visual — hide it from the a11y tree.
      aria-hidden={duplicate}
      tabIndex={duplicate ? -1 : 0}
      aria-pressed={flipped}
      aria-label={flipped ? `${truthLabel}: ${data.truth}` : `${mythLabel}: ${data.myth}`}
      className="myth-card focus-ring mr-4 h-[180px] w-[240px] shrink-0 rounded-2xl sm:w-[280px]"
    >
      <div className={cn('myth-card-inner', flipped && 'flipped')}>
        <div className="myth-card-front flex flex-col justify-center border border-[#FFD0E8] bg-primary-50 p-4 shadow-petal">
          <span className="absolute right-3 top-3 flex items-center gap-1 text-xs font-black uppercase tracking-wide text-primary-600">
            <span aria-hidden>❌</span> {mythLabel}
          </span>
          <p className="mt-3 text-center text-sm font-bold leading-6 text-ink">{data.myth}</p>
        </div>
        <div className="myth-card-back flex flex-col justify-center border border-[#BBF7D0] bg-[#F0FFF4] p-4 shadow-petal">
          <span className="absolute right-3 top-3 flex items-center gap-1 text-xs font-black uppercase tracking-wide text-risk-low">
            <span aria-hidden>✅</span> {truthLabel}
          </span>
          <p className="mt-3 text-center text-sm font-bold leading-6 text-ink">{data.truth}</p>
        </div>
      </div>
    </button>
  );
}

/** Infinite horizontal flip-card wall for the breast-cancer myths. */
export function MythsWall() {
  const { t, dir } = useLanguage();
  const l = t.learn;
  const myths = l.myths;
  const [flipped, setFlipped] = useState<Set<string>>(() => new Set(loadFlipped()));

  const toggle = (id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* storage unavailable — keep in-memory state */
      }
      return next;
    });
  };

  const total = myths.length;
  const count = flipped.size;
  const done = count === total;

  // 8 / 7 / 7 split across the three rows.
  const rows = [myths.slice(0, 8), myths.slice(8, 15), myths.slice(15, 22)];

  return (
    <section className="myths-wall space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-ink sm:text-3xl">{l.mythsWallTitle}</h2>
        <p className="mt-2 font-medium text-muted">{l.mythsWallSubtitle}</p>
        <div className="mt-4 max-w-md">
          <p className={cn('text-sm font-black', done ? 'text-risk-low' : 'text-primary-700')}>
            {done ? l.mythsComplete : interpolate(l.mythsProgress, { n: count, total })}
          </p>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-primary-100/70">
            <div
              className="h-full rounded-full bg-rose-gradient transition-[width] duration-500 ease-out"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scrolling rows with faded edges */}
      <div className="space-y-4" style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="overflow-hidden">
            <div
              className="myths-row flex w-max"
              dir="ltr"
              style={{
                // Inline longhands (not the `animation` shorthand) so the CSS
                // `.myths-wall:hover` rule can still pause via animation-play-state.
                animationName: rowIndex % 2 === 0 ? 'mythsScrollRight' : 'mythsScrollLeft',
                animationDuration: `${ROW_DURATIONS[rowIndex]}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
              }}
            >
              {/* Cards duplicated 2x for a seamless -50% loop. */}
              {[...row, ...row].map((data, i) => (
                <MythCard
                  key={`${data.id}-${i}`}
                  data={data}
                  duplicate={i >= row.length}
                  flipped={flipped.has(data.id)}
                  onToggle={toggle}
                  mythLabel={l.mythLabel}
                  truthLabel={l.truthLabel}
                  dir={dir}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
