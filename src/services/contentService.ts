import type {
  ContentResponse,
  Language,
  ReminderConfirmation,
  ReminderRequest,
  SelfCheckGuide,
  Statistics,
} from '@/types/api';
import { api } from './api';

/** GET /content/symptoms — structured symptom information. */
export async function getSymptoms(language: Language): Promise<ContentResponse> {
  const { data } = await api.get<ContentResponse>('/content/symptoms', {
    params: { language },
  });
  return data;
}

/** GET /self-check-guide — the 5 timed steps. */
export async function getSelfCheckGuide(language: Language): Promise<SelfCheckGuide> {
  const { data } = await api.get<SelfCheckGuide>('/self-check-guide', {
    params: { language },
  });
  return data;
}

/** GET /statistics — Morocco + global figures. */
export async function getStatistics(language: Language): Promise<Statistics> {
  const { data } = await api.get<Statistics>('/statistics', { params: { language } });
  return data;
}

/** POST /reminders — register a monthly self-check reminder. */
export async function createReminder(
  req: ReminderRequest,
): Promise<ReminderConfirmation> {
  const { data } = await api.post<ReminderConfirmation>('/reminders', req);
  return data;
}
