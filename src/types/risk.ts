import type { Language } from './api';

export type RiskLevel = 'low' | 'moderate' | 'high';

export type RiskQuestionId =
  | 'age'
  | 'family_history'
  | 'exercise'
  | 'smoking_alcohol'
  | 'self_exam'
  | 'overweight'
  | 'breastfeeding'
  | 'first_period_age'
  | 'hormone_therapy'
  | 'first_pregnancy_age';

/** A localized option inside a risk question. */
export interface RiskOption {
  value: string;
  label: string;
  /** Weight applied to the risk score when chosen. */
  weight: number;
}

/** A localized risk-assessment question. */
export interface RiskQuestion {
  id: RiskQuestionId;
  icon: string;
  question: string;
  hint?: string;
  options: RiskOption[];
}

// ── POST /api/v1/risk-assessment ────────────────────────────────────
export interface RiskRequest {
  answers: Record<string, string>;
  language: Language;
}

export interface RiskRecommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  icon: string;
}

export interface RiskResponse {
  risk_level: RiskLevel;
  risk_score: number;
  max_score: number;
  risk_percentage: number;
  summary: string;
  recommendations: RiskRecommendation[];
  risk_factors_identified: string[];
  protective_factors_identified: string[];
  next_steps: string;
  disclaimer: string;
}
