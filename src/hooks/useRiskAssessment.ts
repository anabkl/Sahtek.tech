import { useCallback, useMemo, useState } from 'react';
import type { RiskResponse } from '@/types/risk';
import { getRiskQuestions } from '@/data/riskQuestions';
import { assessRisk } from '@/services/riskService';
import { useLanguage } from './useLanguage';

export type RiskStage = 'intro' | 'quiz' | 'analyzing' | 'result';

/** State machine for the one-question-at-a-time risk questionnaire. */
export function useRiskAssessment() {
  const { lang } = useLanguage();
  const questions = useMemo(() => getRiskQuestions(lang), [lang]);

  const [stage, setStage] = useState<RiskStage>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RiskResponse | null>(null);
  /** Slide direction for the question transition (1 forward, -1 back). */
  const [direction, setDirection] = useState(1);

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
