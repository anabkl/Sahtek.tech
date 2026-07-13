import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { CircularProgress } from '@/components/ui/Progress';
import { interpolate, useLanguage } from '@/hooks/useLanguage';

/* ── Flip Card ── */
function MythCard({ myth, truth, mythLabel, truthLabel, cardId, onFlip, isMobile, initialFlipped }: {
  myth: string; truth: string; mythLabel: string; truthLabel: string;
  cardId: string; onFlip: (id: string, flipped: boolean) => void;
  isMobile: boolean; initialFlipped: boolean;
}) {
  const [flipped, setFlipped] = useState(initialFlipped);
  // Report the card's *new* state (not a blind toggle): the marquee renders
  // every card twice with the same cardId, so the parent must add/remove based
  // on actual orientation rather than toggling, or the two copies desync.
  const handleClick = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip(cardId, next);
  };
  return (
    <div
      onClick={handleClick}
      style={{
        perspective: 1000,
        width: isMobile ? 220 : 280,
        minWidth: isMobile ? 220 : 280,
        height: isMobile ? 130 : 160,
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        position: 'relative',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Front — Myth */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: 16, background: '#FFF0F6', border: '1px solid #FFD0E8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? 14 : 20, textAlign: 'center',
        }}>
          <span style={{ position: 'absolute', top: 8, right: 12, fontSize: isMobile ? 9 : 11, color: '#DC2626', fontWeight: 700 }}>
            ❌ {mythLabel}
          </span>
          <p style={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: '#2D1F2D', lineHeight: 1.6, margin: 0 }}>{myth}</p>
        </div>
        {/* Back — Truth */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: 16, background: '#F0FFF4', border: '1px solid #BBF7D0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? 14 : 20, textAlign: 'center',
          transform: 'rotateY(180deg)',
        }}>
          <span style={{ position: 'absolute', top: 8, right: 12, fontSize: isMobile ? 9 : 11, color: '#16A34A', fontWeight: 700 }}>
            ✅ {truthLabel}
          </span>
          <p style={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: '#2D1F2D', lineHeight: 1.6, margin: 0 }}>{truth}</p>
        </div>
      </div>
    </div>
  );
}


/* ── Main Component ── */
export function MythsWall() {
  const { t } = useLanguage();
  const learn = t.learn;

  /* The 30 myths used to live in this file as a 7-language record — a second
     copy store outside src/i18n, which meant the Darija could not be edited by
     anyone who edits Darija. They are now `learn.mythsCards`; this only slices
     them into the three marquee rows. */
  const cards = learn.mythsCards;
  const rows = [cards.slice(0, 10), cards.slice(10, 20), cards.slice(20, 30)];
  const total = cards.length;

  // Speed: 75s = 3x slower than default 25s
  // durationOnHover: 9999 = effectively pauses on hover

  // Shrink cards on narrow viewports. Read width in an effect (not during
  // render) so the value stays stable on the initial paint.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track which unique myths have been revealed. Membership reflects the actual
  // flip state reported by MythCard, so flipping a card back removes it again.
  // Seeded from localStorage so progress survives tab switches (which unmount
  // this component) and reloads.
  const [flippedSet, setFlippedSet] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('sahtek_myths_flipped');
      if (saved) return new Set<string>(JSON.parse(saved));
    } catch { /* ignore unavailable/corrupt storage */ }
    return new Set();
  });
  useEffect(() => {
    try {
      localStorage.setItem('sahtek_myths_flipped', JSON.stringify([...flippedSet]));
    } catch { /* ignore unavailable storage */ }
  }, [flippedSet]);

  const handleFlip = (cardId: string, flipped: boolean) => {
    setFlippedSet((prev) => {
      const next = new Set(prev);
      if (flipped) next.add(cardId);
      else next.delete(cardId);
      return next;
    });
  };

  const flippedCount = flippedSet.size;
  const complete = flippedCount >= total;

  return (
    <div>
      <div className="mb-5 text-center">
        <h3 className="text-h4 text-accent-text">{learn.mythsWallTitle}</h3>
        <p className="mt-1 text-caption text-muted">{learn.mythsWallSubtitle}</p>

        {/* Progress — fades in after the first flip, hidden at 0. */}
        {flippedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-3 inline-flex items-center gap-3 rounded-pill border border-line bg-card px-5 py-2 shadow-petal"
          >
            <CircularProgress
              value={(flippedCount / total) * 100}
              size={36}
              strokeWidth={3}
              progressClassName={complete ? 'text-calm' : 'text-primary-500'}
            >
              <span className="text-[10px] font-bold text-accent-text">{flippedCount}</span>
            </CircularProgress>

            <span className="text-body-sm font-semibold text-ink">
              {complete
                ? learn.mythsComplete
                : interpolate(learn.mythsProgress, { n: flippedCount, total })}
            </span>
          </motion.div>
        )}
      </div>

      {/* Three marquee rows: 1 and 3 scroll one way, 2 the other. */}
      <div className="flex flex-col gap-3">
        {rows.map((row, rowIndex) => (
          <InfiniteSlider
            key={rowIndex}
            gap={16}
            duration={isMobile ? 120 : 75}
            durationOnHover={9999}
            reverse={rowIndex === 1}
          >
            {row.map((item, i) => {
              const id = `r${rowIndex + 1}-${i}`;
              return (
                <MythCard
                  key={id}
                  cardId={id}
                  initialFlipped={flippedSet.has(id)}
                  isMobile={isMobile}
                  myth={item.m}
                  truth={item.t}
                  mythLabel={learn.mythLabel}
                  truthLabel={learn.truthLabel}
                  onFlip={handleFlip}
                />
              );
            })}
          </InfiniteSlider>
        ))}
      </div>
    </div>
  );
}
