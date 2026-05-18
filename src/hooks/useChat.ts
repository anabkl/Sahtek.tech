import { useCallback, useState } from 'react';
import type { ChatCategory, ChatMessage } from '@/types/chat';
import { useChatStore } from '@/stores/chatStore';
import { sendChatMessage } from '@/services/chatService';
import { useLanguage } from './useLanguage';

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Conversation engine — sends messages and manages history + typing state. */
export function useChat() {
  const { lang } = useLanguage();
  const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);
  const clearChat = useChatStore((s) => s.clearChat);

  const [isTyping, setIsTyping] = useState(false);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMessage: ChatMessage = {
        id: uid(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };
      addMessage(userMessage);
      setIsTyping(true);

      // Send only the last 10 turns as context (per the API contract).
      const history = messages
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await sendChatMessage({
          message: trimmed,
          language: lang,
          conversation_history: history,
        });
        addMessage({
          id: uid(),
          role: 'assistant',
          content: res.response,
          timestamp: Date.now(),
          category: res.category as ChatCategory,
          disclaimer: res.disclaimer,
        });
      } catch {
        addMessage({
          id: uid(),
          role: 'assistant',
          content:
            lang === 'ar'
              ? 'سمحي ليا، وقع مشكل تقني صغير. عاودي جرّبي من بعد. 💗'
              : lang === 'fr'
                ? 'Désolée, un petit souci technique. Réessayez dans un instant. 💗'
                : 'Sorry, a small technical hiccup. Please try again in a moment. 💗',
          timestamp: Date.now(),
          category: 'general',
        });
      } finally {
        setIsTyping(false);
      }
    },
    [messages, lang, isTyping, addMessage],
  );

  return { messages, isTyping, send, clearChat };
}
