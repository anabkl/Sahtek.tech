import type { RiskRequest, RiskResponse } from '@/types/risk';
import { USE_MOCK } from '@/config/api';
import { api } from './api';
import { mockRiskAssessment } from './mockService';

/**
 * Submit the questionnaire and receive a personalised risk profile.
 * Falls back to the local weighted calculator in demo mode.
 */
export async function assessRisk(req: RiskRequest): Promise<RiskResponse> {
  if (USE_MOCK) return mockRiskAssessment(req);
  try {
    const { data } = await api.post<RiskResponse>('/risk-assessment', req);
    return data;
  } catch {
    return mockRiskAssessment(req);
  }
}
