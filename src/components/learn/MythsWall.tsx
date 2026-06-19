import { useEffect, useState } from 'react';
import { useLanguage, interpolate } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

type Myth = { id: string; myth: string; truth: string };

const STORAGE_KEY = 'sahtek.myths.flipped';
/** Per-row marquee timing — slight variation reads more organic than identical. */
const ROW_DURATIONS = [32, 28, 36];
const EDGE_MASK = 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)';

function loadFlipped(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** Pause/resume only the marquee track inside the hovered/focused row. */
function setRowPlay(container: HTMLElement, state: 'paused' | 'running') {
  const track = container.querySelector<HTMLElement>('.mw-track');
  if (track) track.style.animationPlayState = state;
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
  duplicate: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(data.id)}
      dir={dir}
      aria-hidden={duplicate}
      tabIndex={duplicate ? -1 : 0}
      aria-pressed={flipped}
      aria-label={flipped ? `${truthLabel}: ${data.truth}` : `${mythLabel}: ${data.myth}`}
      className="mw-card focus-ring mr-4 h-[140px] w-[240px] shrink-0 rounded-2xl sm:h-[160px] sm:w-[280px]"
    >
      <div className={cn('mw-inner', flipped && 'flipped')}>
        {/* FRONT — the myth */}
        <div className="mw-face flex flex-col items-center justify-center border border-[#FFD0E8] bg-[#FFF0F6] p-4 text-center shadow-petal">
          <span className="absolute right-3 top-3 flex items-center gap-1 text-[11px] font-black uppercase tracking-wide text-primary-600">
            <span aria-hidden>❌</span> {mythLabel}
          </span>
          <p className="mt-3 text-sm font-bold leading-6 text-ink">{data.myth}</p>
        </div>
        {/* BACK — the truth */}
        <div className="mw-face mw-back flex flex-col items-center justify-center border border-[#BBF7D0] bg-[#F0FFF4] p-4 text-center shadow-petal">
          <span className="absolute right-3 top-3 flex items-center gap-1 text-[11px] font-black uppercase tracking-wide text-risk-low">
            <span aria-hidden>✅</span> {truthLabel}
          </span>
          <p className="mt-3 text-sm font-bold leading-6 text-ink">{data.truth}</p>
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

  // 3 rows on desktop, merge to 2 on mobile.
  const [twoRows, setTwoRows] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () => setTwoRows(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

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

  const rows: Myth[][] = twoRows
    ? [myths.slice(0, 11), myths.slice(11, 22)]
    : [myths.slice(0, 8), myths.slice(8, 15), myths.slice(15, 22)];

  return (
    <section className="space-y-5">
      <style>{`
        .mw-card { perspective: 1000px; }
        .mw-inner {
          position: relative; width: 100%; height: 100%;
          transition: transform 0.6s ease; transform-style: preserve-3d;
        }
        .mw-inner.flipped { transform: rotateY(180deg); }
        .mw-face {
          position: absolute; inset: 0; overflow: hidden; border-radius: 16px;
          backface-visibility: hidden; -webkit-backface-visibility: hidden;
        }
        .mw-back { transform: rotateY(180deg); }
        .mw-row { overflow: hidden; }
        .mw-track { display: flex; width: max-content; will-change: transform; }
        @keyframes mwScrollRight {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes mwScrollLeft {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mw-track { animation: none !important; transform: none !important; }
          .mw-row { overflow-x: auto; }
        }
      `}</style>

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

      {/* Scrolling rows — each pauses independently on hover/focus */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={`${twoRows ? 'm' : 'd'}-${rowIndex}`}
            className="mw-row"
            style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
            onMouseEnter={(e) => setRowPlay(e.currentTarget, 'paused')}
            onMouseLeave={(e) => setRowPlay(e.currentTarget, 'running')}
            onFocusCapture={(e) => setRowPlay(e.currentTarget, 'paused')}
            onBlurCapture={(e) => setRowPlay(e.currentTarget, 'running')}
          >
            <div
              className="mw-track"
              dir="ltr"
              style={{
                animation: `${rowIndex % 2 === 0 ? 'mwScrollRight' : 'mwScrollLeft'} ${
                  ROW_DURATIONS[rowIndex] ?? 30
                }s linear infinite`,
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
