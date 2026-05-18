import { useCallback, useEffect, useState } from 'react';
import type { SelfCheckStep } from '@/types/api';

export type SelfCheckStage = 'intro' | 'active' | 'done';

/** Wizard + per-step countdown timer for the guided self-check. */
export function useSelfCheck(steps: SelfCheckStep[]) {
  const [stage, setStage] = useState<SelfCheckStage>('intro');
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [paused, setPaused] = useState(false);
  /** Slide direction for transitions (1 forward, -1 back). */
  const [direction, setDirection] = useState(1);

  const total = steps.length;
  const current = steps[index];
  const isLast = index === total - 1;
  const isFirst = index === 0;

  // Reset the countdown whenever the active step changes.
  useEffect(() => {
    if (stage === 'active' && steps[index]) {
      setRemaining(steps[index].duration_seconds);
      setPaused(false);
    }
  }, [index, stage, steps]);

  // Tick the countdown once per second while running.
  useEffect(() => {
    if (stage !== 'active' || paused || remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [stage, paused, remaining]);

  const start = useCallback(() => {
    setIndex(0);
    setDirection(1);
    setStage('active');
  }, []);

  const next = useCallback(() => {
    if (isLast) {
      setStage('done');
      return;
    }
    setDirection(1);
    setIndex((i) => i + 1);
  }, [isLast]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);
  const skipTimer = useCallback(() => setRemaining(0), []);

  const restart = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setPaused(false);
  }, []);

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= total) return;
      setDirection(target > index ? 1 : -1);
      setIndex(target);
    },
    [index, total],
  );

  const stepDuration = current?.duration_seconds ?? 1;
  const stepProgress = current ? (stepDuration - remaining) / stepDuration : 0;

  return {
    stage,
    steps,
    current,
    index,
    total,
    remaining,
    paused,
    direction,
    isFirst,
    isLast,
    stepProgress,
    start,
    next,
    prev,
    togglePause,
    skipTimer,
    restart,
    goTo,
  };
}
