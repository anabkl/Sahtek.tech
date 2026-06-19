import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths } from '@/utils/formatters';
import { cn } from '@/utils/cn';

// --- Minimal date helpers (date-fns is not a project dependency) -----------
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isToday = (d: Date) => isSameDay(d, new Date());

interface GlassCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  isRTL: boolean;
  months: readonly string[];
  weekdays: readonly string[];
  /** Disable interaction — used for the confirmation preview. */
  readOnly?: boolean;
}

/** Frosted monthly calendar with a horizontal, scroll-snapping day strip. */
export function GlassCalendar({ selectedDate, onDateSelect, isRTL, months, weekdays, readOnly }: GlassCalendarProps) {
  const [viewDate, setViewDate] = useState(() => startOfMonth(selectedDate ?? new Date()));
  const selectedRef = useRef<HTMLButtonElement>(null);

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();
  const days = Array.from({ length: getDaysInMonth(viewDate) }, (_, i) => new Date(year, monthIndex, i + 1));

  // Centre the selected day in the strip when month or selection changes.
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [monthIndex, year, selectedDate]);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="rounded-[2rem] border border-primary-200 bg-white/80 p-5 shadow-petal-xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, -1))}
          aria-label="Previous month"
          className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary-600 transition hover:bg-primary-100"
        >
          <ChevronLeft size={20} className="rtl:-scale-x-100" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${monthIndex}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <p className="text-lg font-black text-ink">{months[monthIndex]}</p>
            <p className="text-xs font-bold text-muted tabular-nums">{year}</p>
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          aria-label="Next month"
          className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary-600 transition hover:bg-primary-100"
        >
          <ChevronRight size={20} className="rtl:-scale-x-100" />
        </button>
      </div>

      <div className="hide-scrollbar mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
        {days.map((date) => {
          const selected = selectedDate != null && isSameDay(date, selectedDate);
          const today = isToday(date);
          return (
            <button
              key={date.getDate()}
              ref={selected ? selectedRef : undefined}
              type="button"
              disabled={readOnly}
              onClick={() => onDateSelect(date)}
              aria-pressed={selected}
              className={cn(
                'relative flex w-14 shrink-0 snap-center flex-col items-center gap-1 rounded-2xl py-3 transition',
                selected
                  ? 'bg-gradient-to-br from-primary-500 to-pink-400 text-white shadow-petal-lg'
                  : 'bg-primary-50 text-ink hover:bg-primary-100',
                readOnly && 'cursor-default',
              )}
            >
              <span className={cn('text-[11px] font-bold', selected ? 'text-white/80' : 'text-muted')}>
                {weekdays[date.getDay()]}
              </span>
              <motion.span animate={{ scale: selected ? 1.12 : 1 }} className="text-lg font-black tabular-nums">
                {date.getDate()}
              </motion.span>
              {today && !selected && (
                <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-pink-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
