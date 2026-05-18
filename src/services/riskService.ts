import type { RiskRequest, RiskResponse } from '@/types/risk';
import { api } from './api';

/** Submit the questionnaire to the live backend risk assessment endpoint. */
export async function assessRisk(req: RiskRequest): Promise<RiskResponse> {
  const { data } = await api.post<RiskResponse>('/risk-assessment', req);
  return data;
}
