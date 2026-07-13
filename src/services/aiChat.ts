import type { Language } from '@/types/api';
import { knowledgeBase, fallbackResponse } from '@/data/chatKnowledge';

// ════════════════════════════════════════════════════════════════════
//  Chat brain — LOCAL ONLY. Nothing here leaves the device.
//
//  This used to POST straight to api.groq.com from the browser, which meant
//  (a) the API key shipped in the public JS bundle and (b) the woman's
//  message, her last 6 turns of conversation, and a context block naming her
//  risk level / self-check status / reminder day were all sent to a third
//  party she was never told about.
//
//  Both are now gone. The key is out of the client, and the chat answers from
//  the bundled trilingual knowledge base instead.
//
//  RESTORING AI: do NOT reintroduce a VITE_-prefixed key — Vite inlines those
//  into the bundle, so any key here is public by construction. Route through
//  POST /api/v1/chat on the backend, which already accepts
//  { message, language, conversation_history } and holds its key server-side.
//  When you do, gate it behind explicit consent: sending her conversation to
//  an external model is a disclosure, and she has to agree to it first.
// ════════════════════════════════════════════════════════════════════

/**
 * Answer a chat message from the local knowledge base.
 *
 * `history` is accepted so the signature survives the future backend proxy,
 * but it is deliberately unused: no conversation history is transmitted,
 * because nothing is transmitted at all.
 */
export async function askChat(message: string, lang: Language): Promise<string> {
  const entry = knowledgeBase.find((e) => e.pattern.test(message));
  return entry ? entry.responses[lang] : fallbackResponse[lang];
}
