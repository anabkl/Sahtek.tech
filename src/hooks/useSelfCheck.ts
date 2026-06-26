import { useCallback, useEffect, useRef, useState } from 'react';
import type { SelfCheckStep } from '@/types/api';

export type SelfCheckStage = 'intro' | 'active' | 'done';

const STORAGE_KEY = 'sahtek_selfcheck';
const MAX_AGE = 24 * 60 * 60 * 1000; // 24h

export interface SelfCheckSnapshot {
  currentStep: number;
  timerSeconds: number;
  timerState: 'idle' | 'running' | 'paused';
  completedSteps: number[];
  lastUpdated: number;
}

/** Read a recent (<24h) saved session, clearing it if stale or invalid. */
function readSnapshot(): SelfCheckSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SelfCheckSnapshot;
    if (!s || typeof s.lastUpdated !== 'number') return null;
    if (Date.now() - s.lastUpdated > MAX_AGE) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

function clearSnapshot() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Keep a restored step index inside the valid range for the current guide. */
function clampIndex(i: number, total: number): number {
  return Math.min(Math.max(i, 0), Math.max(total - 1, 0));
}

/** Wizard + per-step countdown timer for the guided self-check. */
export function useSelfCheck(steps: SelfCheckStep[]) {
  // Read any recent (<24h) saved session ONCE, up front, and seed all state from
  // it so navigating away and back drops the user straight back into their step
  // with the same countdown — no prompt. readSnapshot() is null when nothing fresh
  // is stored, in which case we start clean at the intro.
  const [restored] = useState(() => readSnapshot());

  const [stage, setStage] = useState<SelfCheckStage>(restored ? 'active' : 'intro');
  const [index, setIndex] = useState(() =>
    restored ? clampIndex((restored.currentStep ?? 1) - 1, steps.length) : 0,
  );
  const [remaining, setRemaining] = useState(() => restored?.timerSeconds ?? 0);
  const [paused, setPaused] = useState(() => restored?.timerState === 'paused');
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => restored?.completedSteps ?? []);
  /** Slide direction for transitions (1 forward, -1 back). */
  const [direction, setDirection] = useState(1);

  // Skip the first step-change reset so a restored countdown isn't overwritten.
  const restoringRef = useRef(!!restored);

  const total = steps.length;
  const current = steps[index];
  const isLast = index === total - 1;
  const isFirst = index === 0;

  // Reset the countdown whenever the active step changes (but not when we are
  // restoring a saved session — that keeps its own remaining seconds).
  useEffect(() => {
    if (stage === 'active' && steps[index]) {
      if (restoringRef.current) {
        restoringRef.current = false;
        return;
      }
      setRemaining(steps[index].duration_seconds);
      setPaused(false);
    }
  }, [index, stage, steps]);

  // Persist the live session on every change while active; clear it when done.
  useEffect(() => {
    if (stage !== 'active') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStep: index + 1,
          timerSeconds: remaining,
          timerState: paused ? 'paused' : 'running',
          completedSteps,
          lastUpdated: Date.now(),
        } satisfies SelfCheckSnapshot),
      );
    } catch {
      /* storage unavailable — keep in-memory state only */
    }
  }, [stage, index, remaining, paused, completedSteps]);

  useEffect(() => {
    if (stage === 'done') clearSnapshot();
  }, [stage]);

  // Tick the countdown once per second while running. The interval is created
  // once per run/pause cycle (not re-created each second) — the functional
  // updater keeps it decrementing without needing `remaining` in the deps.
  useEffect(() => {
    if (stage !== 'active' || paused) return;
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [stage, paused]);

  const start = useCallback(() => {
    setIndex(0);
    setCompletedSteps([]);
    setDirection(1);
    setStage('active');
  }, []);

  const next = useCallback(() => {
    if (current) {
      setCompletedSteps((prev) =>
        prev.includes(current.step_number) ? prev : [...prev, current.step_number],
      );
    }
    if (isLast) {
      setStage('done');
      return;
    }
    setDirection(1);
    setIndex((i) => i + 1);
  }, [isLast, current]);

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
    setCompletedSteps([]);
    clearSnapshot();
  }, []);

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= total) return;
      setDirection(target > index ? 1 : -1);
      setIndex(target);
    },
    [index, total],
  );

  // Auto-advance when the countdown hits zero. Tracking the previous value
  // ensures we only fire on a true >0 → 0 transition (the timer running out or
  // an explicit skip) and never on the reset that re-arms each step from 0.
  const prevRemaining = useRef(remaining);
  useEffect(() => {
    const wasRunning = prevRemaining.current > 0;
    prevRemaining.current = remaining;
    if (stage === 'active' && wasRunning && remaining === 0) {
      next();
    }
  }, [remaining, stage, next]);

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
    completedSteps,
    start,
    next,
    prev,
    togglePause,
    skipTimer,
    restart,
    goTo,
  };
}
