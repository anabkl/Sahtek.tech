import type { ChatRequest, ChatResponse } from '@/types/chat';
import { api } from './api';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function parsePossibleJson(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeChatResponse(payload: unknown): ChatResponse {
  const parsed = parsePossibleJson(payload);

  if (isRecord(parsed) && typeof parsed.response === 'string') {
    const nested = parsePossibleJson(parsed.response);

    if (isRecord(nested) && typeof nested.response === 'string') {
      return {
        response: nested.response,
        category: typeof nested.category === 'string' ? nested.category : 'general',
        confidence: typeof nested.confidence === 'number' ? nested.confidence : 0.9,
        related_topics: Array.isArray(nested.related_topics)
          ? nested.related_topics.filter((item): item is string => typeof item === 'string')
          : ['self_check', 'prevention'],
        disclaimer: typeof nested.disclaimer === 'boolean' ? nested.disclaimer : true,
      };
    }

    return {
      response: parsed.response,
      category: typeof parsed.category === 'string' ? parsed.category : 'general',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
      related_topics: Array.isArray(parsed.related_topics)
        ? parsed.related_topics.filter((item): item is string => typeof item === 'string')
        : ['self_check', 'prevention'],
      disclaimer: typeof parsed.disclaimer === 'boolean' ? parsed.disclaimer : true,
    };
  }

  if (isRecord(parsed) && Array.isArray(parsed.choices)) {
    const firstChoice = parsed.choices[0];
    const content =
      isRecord(firstChoice) &&
      isRecord(firstChoice.message) &&
      typeof firstChoice.message.content === 'string'
        ? firstChoice.message.content
        : '';

    return normalizeChatResponse({ response: content });
  }

  if (typeof parsed === 'string' && parsed.trim()) {
    return {
      response: parsed,
      category: 'general',
      confidence: 0.8,
      related_topics: ['self_check', 'prevention'],
      disclaimer: true,
    };
  }

  throw new Error('Invalid chat response from backend');
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const { data } = await api.post<unknown>('/chat', req);
  return normalizeChatResponse(data);
}
