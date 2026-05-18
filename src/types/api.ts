// ── Shared API types — mirror of CONTRAT_API_SAHTEK.md ──────────────

export type Language = 'ar' | 'fr' | 'en';

export type Severity = 'high' | 'medium' | 'low';

/** Standardised backend error envelope. */
export interface ApiError {
  error: string;
  message: string;
  code: number;
}

// ── Endpoint 1: health ──────────────────────────────────────────────
export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

// ── Endpoint 4: educational content ─────────────────────────────────
export type ContentTopic =
  | 'overview'
  | 'symptoms'
  | 'self_check_guide'
  | 'prevention'
  | 'myths'
  | 'statistics';

export interface ContentItem {
  symptom: string;
  description: string;
  severity: Severity;
}

export interface ContentSection {
  title: string;
  icon: string;
  items: ContentItem[];
}

export interface ContentResponse {
  topic: ContentTopic;
  title: string;
  content: {
    introduction: string;
    sections: ContentSection[];
    call_to_action: string;
  };
  last_updated: string;
}

// ── Endpoint 5: self-check guide ────────────────────────────────────
export interface SelfCheckStep {
  step_number: number;
  title: string;
  icon: string;
  duration_seconds: number;
  instruction: string;
  what_to_look_for: string[];
  image_url: string;
}

export interface SelfCheckGuide {
  title: string;
  best_time: string;
  total_duration_minutes: number;
  steps: SelfCheckStep[];
  important_note: string;
  disclaimer: string;
}

// ── Endpoint 6: statistics ──────────────────────────────────────────
export interface KeyFact {
  stat: string;
  description: string;
}

export interface Statistics {
  global: {
    affected_ratio: string;
    early_detection_survival: string;
    most_common_cancer_women: boolean;
    new_cases_yearly: string;
  };
  morocco: {
    new_cases_yearly: string;
    average_diagnosis_age: number;
    late_diagnosis_percentage: number;
    awareness_note: string;
  };
  key_facts: KeyFact[];
}

// ── Endpoint 7: reminders ───────────────────────────────────────────
export interface ReminderRequest {
  email?: string;
  phone?: string;
  preferred_day: number;
  language: Language;
  notification_type: 'email' | 'sms' | 'both';
}

export interface ReminderConfirmation {
  id: string;
  status: string;
  next_reminder: string;
  message: string;
}
