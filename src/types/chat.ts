import type { Language } from './api';

export type ChatRole = 'user' | 'assistant';

export type ChatCategory =
  | 'symptoms'
  | 'prevention'
  | 'self_check'
  | 'treatment'
  | 'myths'
  | 'emotional_support'
  | 'genetics'
  | 'diet'
  | 'exercise'
  | 'greeting'
  | 'general';

/** A single message in the chat UI. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  category?: ChatCategory;
  disclaimer?: boolean;
  pending?: boolean;
}

// ── POST /api/v1/chat ───────────────────────────────────────────────
export interface ChatRequest {
  message: string;
  language: Language;
  conversation_history?: { role: ChatRole; content: string }[];
}

export interface ChatResponse {
  response: string;
  category: string;
  confidence: number;
  related_topics: string[];
  disclaimer: boolean;
}
