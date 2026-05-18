import type {
  ContentResponse,
  Language,
  ReminderConfirmation,
  ReminderRequest,
  SelfCheckGuide,
  Statistics,
} from '@/types/api';
import { USE_MOCK } from '@/config/api';
import { api } from './api';
import {
  mockCreateReminder,
  mockGetSelfCheckGuide,
  mockGetStatistics,
  mockGetSymptoms,
} from './mockService';

/** GET /content/symptoms — structured symptom information. */
export async function getSymptoms(language: Language): Promise<ContentResponse> {
  if (USE_MOCK) return mockGetSymptoms(language);
  try {
    const { data } = await api.get<ContentResponse>(`/content/symptoms`, {
      params: { language },
    });
    return data;
  } catch {
    return mockGetSymptoms(language);
  }
}

/** GET /self-check-guide — the 5 timed steps. */
export async function getSelfCheckGuide(language: Language): Promise<SelfCheckGuide> {
  if (USE_MOCK) return mockGetSelfCheckGuide(language);
  try {
    const { data } = await api.get<SelfCheckGuide>(`/self-check-guide`, {
      params: { language },
    });
    return data;
  } catch {
    return mockGetSelfCheckGuide(language);
  }
}

/** GET /statistics — Morocco + global figures. */
export async function getStatistics(language: Language): Promise<Statistics> {
  if (USE_MOCK) return mockGetStatistics(language);
  try {
    const { data } = await api.get<Statistics>(`/statistics`, { params: { language } });
    return data;
  } catch {
    return mockGetStatistics(language);
  }
}

/** POST /reminders — register a monthly self-check reminder. */
export async function createReminder(
  req: ReminderRequest,
): Promise<ReminderConfirmation> {
  if (USE_MOCK) return mockCreateReminder(req);
  try {
    const { data } = await api.post<ReminderConfirmation>('/reminders', req);
    return data;
  } catch {
    return mockCreateReminder(req);
  }
}
