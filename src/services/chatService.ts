import type { ChatRequest, ChatResponse } from '@/types/chat';
import { api } from './api';

/** Send a message to the live Sahtek backend AI assistant. */
export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>('/chat', req);
  return data;
}
