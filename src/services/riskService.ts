import type { RiskRequest, RiskResponse } from '@/types/risk';
import { mockRiskAssessment } from './mockService';

/**
 * Score the questionnaire locally with the weighted algorithm.
 * The backend is retired, so the deterministic local scoring is the source
 * of truth for the score/level. The result summary + recommendations can be
 * optionally personalized on top via analyzeRiskWithGroq (see RiskAssessmentPage).
 */
export async function assessRisk(req: RiskRequest): Promise<RiskResponse> {
  return mockRiskAssessment(req);
}
