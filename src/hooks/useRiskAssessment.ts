import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RiskResponse } from '@/types/risk';
import { getRiskQuestions } from '@/data/riskQuestions';
import { assessRisk } from '@/services/riskService';
import { useLanguage } from './useLanguage';

export type RiskStage = 'intro' | 'quiz' | 'analyzing' | 'result';

const STORAGE_KEY = 'sahtek_risk';

interface RiskSnapshot {
  stage: RiskStage;
  index: number;
  answers: Record<string, string>;
  result: RiskResponse | null;
}

/** Read a saved questionnaire, mapping the transient 'analyzing' stage back to 'quiz'. */
function readSnapshot(): RiskSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { value?: RiskSnapshot };
    const v = parsed?.value;
    if (!v) return null;
    if (v.result) return { ...v, stage: 'result' };
    if (v.answers && Object.keys(v.answers).length > 0) return { ...v, stage: 'quiz' };
    return null;
  } catch {
    return null;
  }
}

/** State machine for the one-question-at-a-time risk questionnaire. */
export function useRiskAssessment() {
  const { lang } = useLanguage();
  const questions = useMemo(() => getRiskQuestions(lang), [lang]);

  // Rehydrate once from a saved session (result → show result, answers → resume quiz).
  const saved = useMemo(() => readSnapshot(), []);
  const [stage, setStage] = useState<RiskStage>(saved?.stage ?? 'intro');
  const [index, setIndex] = useState(saved?.index ?? 0);
  const [answers, setAnswers] = useState<Record<string, string>>(saved?.answers ?? {});
  const [result, setResult] = useState<RiskResponse | null>(saved?.result ?? null);
  /** Slide direction for the question transition (1 forward, -1 back). */
  const [direction, setDirection] = useState(1);

  // Persist on every meaningful change (skip the transient analyzing stage).
  useEffect(() => {
    if (stage === 'analyzing') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: { stage, index, answers, result }, _timestamp: Date.now() }));
    } catch {
      /* storage unavailable — keep in-memory state only */
    }
  }, [stage, index, answers, result]);

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const total = questions.length;
  const current = questions[index];
  const selected = current ? answers[current.id] : undefined;
  const isLast = index === total - 1;

  const start = useCallback(() => {
    setAnswers({});
    setResult(null);
    setIndex(0);
    setDirection(1);
    setStage('quiz');
  }, []);

  const choose = useCallback(
    (value: string) => {
      if (!current) return;
      setAnswers((prev) => ({ ...prev, [current.id]: value }));
    },
    [current],
  );

  const submit = useCallback(
    async (finalAnswers: Record<string, string>) => {
      setStage('analyzing');
      const res = await assessRisk({ answers: finalAnswers, language: lang });
      setResult(res);
      setStage('result');
    },
    [lang],
  );

  const next = useCallback(() => {
    if (!current || !answers[current.id]) return;
    if (isLast) {
      void submit(answers);
    } else {
      setDirection(1);
      setIndex((i) => i + 1);
    }
  }, [current, answers, isLast, submit]);

  const back = useCallback(() => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const restart = useCallback(() => {
    setAnswers({});
    setResult(null);
    setIndex(0);
    setStage('intro');
    clearStorage();
  }, []);

  return {
    stage,
    questions,
    current,
    index,
    total,
    direction,
    answers,
    selected,
    isLast,
    result,
    answeredCount: Object.keys(answers).length,
    start,
    choose,
    next,
    back,
    restart,
  };
}
