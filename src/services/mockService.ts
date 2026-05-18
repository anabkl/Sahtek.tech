import type {
  ContentResponse,
  ReminderConfirmation,
  ReminderRequest,
  SelfCheckGuide,
  Statistics,
} from '@/types/api';
import type { ChatRequest, ChatResponse, ChatCategory } from '@/types/chat';
import type { RiskLevel, RiskRequest, RiskResponse } from '@/types/risk';
import { MOCK_DELAY } from '@/config/constants';
import { getRiskQuestions, MAX_RISK_SCORE } from '@/data/riskQuestions';
import { knowledgeBase, fallbackResponse } from '@/data/chatKnowledge';
import { symptomsContent, selfCheckGuide, statistics } from '@/data/content';
import {
  FACTOR_COPY,
  PROTECTIVE_ANSWER,
  RECOMMENDATIONS,
  RISK_DISCLAIMER,
  RISK_NEXT_STEPS,
  RISK_SUMMARY,
  type RecommendationKey,
} from '@/data/riskCopy';
import { nextReminderDate } from '@/utils/formatters';

// ════════════════════════════════════════════════════════════════════
//  DEMO MODE — a fully offline mock of the Sahtek backend.
//  Same shapes as the real API, so swapping in the live backend is a
//  one-line change in .env. This is what the jury sees if the API is
//  unavailable, so it must feel polished and intelligent.
// ════════════════════════════════════════════════════════════════════

/** Resolve after a human-feeling delay (the "thinking" effect). */
function delay<T>(value: T, ms = MOCK_DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// ── Chat: keyword-matched, empathetic answers ───────────────────────
export function mockChat(req: ChatRequest): Promise<ChatResponse> {
  const entry = knowledgeBase.find((e) => e.pattern.test(req.message));

  const response: ChatResponse = entry
    ? {
        response: entry.responses[req.language],
        category: entry.category,
        confidence: 0.82 + Math.random() * 0.15,
        related_topics: entry.related,
        disclaimer: entry.disclaimer,
      }
    : {
        response: fallbackResponse[req.language],
        category: 'general',
        confidence: 0.42,
        related_topics: ['symptoms', 'self_check', 'prevention'],
        disclaimer: false,
      };

  // Slightly longer delay so the typing indicator reads as real.
  return delay(response, MOCK_DELAY + Math.random() * 500);
}

// ── Risk assessment: weighted scoring ───────────────────────────────
function levelFromPercentage(pct: number): RiskLevel {
  if (pct < 33) return 'low';
  if (pct < 66) return 'moderate';
  return 'high';
}

export function mockRiskAssessment(req: RiskRequest): Promise<RiskResponse> {
  const { answers, language } = req;
  const questions = getRiskQuestions(language);

  let score = 0;
  const riskFactors: string[] = [];
  const protectiveFactors: string[] = [];

  for (const q of questions) {
    const chosen = answers[q.id];
    const option = q.options.find((o) => o.value === chosen);
    if (!option) continue;

    score += option.weight;
    const copy = FACTOR_COPY[language][q.id];
    if (option.weight > 0 && copy?.risk) riskFactors.push(copy.risk);
    if (PROTECTIVE_ANSWER[q.id] === chosen && copy?.protective) {
      protectiveFactors.push(copy.protective);
    }
  }

  const percentage = Math.round((score / MAX_RISK_SCORE) * 100);
  const level = levelFromPercentage(percentage);

  // Build a targeted recommendation set.
  const recKeys: RecommendationKey[] = [];
  const push = (k: RecommendationKey) => {
    if (!recKeys.includes(k)) recKeys.push(k);
  };

  push('self_check');
  push(level === 'high' ? 'doctor_soon' : 'doctor_yearly');
  if (answers.exercise && answers.exercise !== 'daily') push('exercise');
  if (answers.overweight && answers.overweight !== 'no') {
    push('weight');
    push('diet');
  }
  if (answers.smoking_alcohol && answers.smoking_alcohol !== 'never') push('quit');
  if (answers.age === '40-49' || answers.age === '50_plus') push('mammogram');

  const recommendations = recKeys
    .slice(0, 6)
    .map((k) => RECOMMENDATIONS[language][k])
    .sort((a, b) => (a.priority === 'high' ? -1 : 1) - (b.priority === 'high' ? -1 : 1));

  return delay({
    risk_level: level,
    risk_score: score,
    max_score: MAX_RISK_SCORE,
    risk_percentage: percentage,
    summary: RISK_SUMMARY[language][level],
    recommendations,
    risk_factors_identified: riskFactors,
    protective_factors_identified: protectiveFactors,
    next_steps: RISK_NEXT_STEPS[language][level],
    disclaimer: RISK_DISCLAIMER[language],
  });
}

// ── Educational content ─────────────────────────────────────────────
export function mockGetSymptoms(language: ChatRequest['language']): Promise<ContentResponse> {
  return delay(symptomsContent[language]);
}

export function mockGetSelfCheckGuide(
  language: ChatRequest['language'],
): Promise<SelfCheckGuide> {
  return delay(selfCheckGuide[language]);
}

export function mockGetStatistics(language: ChatRequest['language']): Promise<Statistics> {
  return delay(statistics[language]);
}

// ── Reminders ───────────────────────────────────────────────────────
const REMINDER_MESSAGE: Record<ChatRequest['language'], string> = {
  ar: 'التذكير مفعّل! غادي نذكّروك بالفحص الذاتي كل شهر. 💗',
  fr: 'Rappel activé ! Nous vous rappellerons votre auto-examen chaque mois. 💗',
  en: 'Reminder activated! We will remind you of your self-check every month. 💗',
};

export function mockCreateReminder(req: ReminderRequest): Promise<ReminderConfirmation> {
  return delay({
    id: `rem_${Math.random().toString(36).slice(2, 10)}`,
    status: 'active',
    next_reminder: nextReminderDate(req.preferred_day).toISOString(),
    message: REMINDER_MESSAGE[req.language],
  });
}

// Re-export so consumers can reference the union without a deep import.
export type { ChatCategory };
