import type { ChatRequest, ChatResponse } from '@/types/chat';
import { USE_MOCK } from '@/config/api';
import { api } from './api';
import { mockChat } from './mockService';

/**
 * Send a message to the AI assistant.
 * Uses the live backend when configured, and always falls back to the
 * local demo brain so the chat never breaks in front of the jury.
 */
export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  if (USE_MOCK) return mockChat(req);
  try {
    const { data } = await api.post<ChatResponse>('/chat', req);
    return data;
  } catch {
    return mockChat(req);
  }
}
