import { GROQ_API_KEY } from '@/config/groq';
import type { Language } from '@/types/api';
import { knowledgeBase, fallbackResponse } from '@/data/chatKnowledge';

// ════════════════════════════════════════════════════════════════════
//  Groq LLM service — powers the AI chat + optional risk personalization.
//  Called directly from the frontend (demo mode). If Groq is unavailable
//  or no key is set, we degrade gracefully to the local knowledge base.
// ════════════════════════════════════════════════════════════════════

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile'; // free, fast, smart

/** True only when a real Groq key has been pasted into src/config/groq.ts. */
function hasGroqKey(): boolean {
  return typeof GROQ_API_KEY === 'string' && GROQ_API_KEY.startsWith('gsk_');
}

// ── CHAT ──────────────────────────────────────────────────────────────
// These prompts push the model to ANSWER directly with real information.
// The previous "specialized ONLY / redirect if off-topic" framing made the
// model deflect real questions with a greeting — hence the explicit examples.
const CHAT_SYSTEM_PROMPTS: Record<string, string> = {
  ar: `أنتِ "صحّتك"، مساعدة ذكية وخبيرة في التوعية بسرطان الثدي للنساء المغربيات.

مهمتك: جاوبي على أسئلة المستخدمات بمعلومات حقيقية ومفيدة ومفصّلة.

مثال: إلا سؤلوك "شنو هي الأعراض؟"، عطي لائحة الأعراض الحقيقية (كتلة فالثدي، تغيّر فالشكل، إفرازات من الحلمة، إلخ). ما تقوليش فقط "سوليني على الأعراض".

القواعد:
1. جاوبي مباشرة وبمعلومات حقيقية على كل سؤال متعلق بسرطان الثدي.
2. استعملي الدارجة المغربية الحنونة.
3. إلا كان السؤال خارج موضوع سرطان الثدي تماماً، وقتها فقط وجّهي بلطف.
4. أنتِ لستِ طبيبة - أعطي معلومات تعليمية وذكّري باستشارة الطبيب.
5. جاوبي بين 60 و150 كلمة. استعملي إيموجي (💗🎀🩺) ولوائح إذا لزم.

تذكري: هدفك تعلّمي وتساعدي، ماشي فقط ترحّبي.`,
  en: `You are "Sahtek", a knowledgeable AI expert in breast cancer awareness for women.

Your job: ANSWER user questions with real, useful, detailed information.

Example: If asked "what are the symptoms?", LIST the actual symptoms (lump in breast, change in shape, nipple discharge, etc). Do NOT just say "ask me about symptoms".

Rules:
1. Answer directly with real information for every breast cancer question.
2. Only redirect if the question is COMPLETELY unrelated to breast cancer.
3. You are NOT a doctor - give educational info and remind to consult a doctor.
4. Answer in 60-150 words. Use emojis (💗🎀🩺) and lists when helpful.

Remember: your goal is to TEACH and HELP, not just greet.`,
  fr: `Vous êtes "Sahtek", une experte IA en sensibilisation au cancer du sein.

Votre rôle: RÉPONDRE aux questions avec des informations réelles et détaillées.

Exemple: Si on demande "quels sont les symptômes?", LISTEZ les vrais symptômes (masse dans le sein, changement de forme, écoulement du mamelon, etc). Ne dites PAS juste "posez-moi des questions sur les symptômes".

Règles:
1. Répondez directement avec de vraies informations à chaque question sur le cancer du sein.
2. Ne redirigez QUE si la question est totalement hors sujet.
3. Vous n'êtes PAS médecin - infos éducatives + rappel de consulter.
4. Répondez en 60-150 mots avec émojis (💗🎀🩺) et listes.

Rappel: votre but est d'ENSEIGNER et AIDER, pas juste saluer.`,
  es: `Eres "Sahtek", una experta en IA en concienciación sobre el cáncer de mama para mujeres.

Tu tarea: RESPONDER a las preguntas con información real, útil y detallada.

Ejemplo: Si te preguntan "¿cuáles son los síntomas?", ENUMERA los síntomas reales (bulto en la mama, cambio de forma, secreción del pezón, etc). NO digas solo "pregúntame sobre los síntomas".

Reglas:
1. Responde directamente con información real a cada pregunta sobre el cáncer de mama.
2. Redirige SOLO si la pregunta no tiene NADA que ver con el cáncer de mama.
3. NO eres médica - da información educativa y recuerda consultar a un médico.
4. Responde en 60-150 palabras. Usa emojis (💗🎀🩺) y listas cuando ayuden.

Recuerda: tu objetivo es ENSEÑAR y AYUDAR, no solo saludar.`,
  de: `Sie sind "Sahtek", eine KI-Expertin für Brustkrebs-Aufklärung für Frauen.

Ihre Aufgabe: Fragen mit echten, nützlichen und detaillierten Informationen BEANTWORTEN.

Beispiel: Bei der Frage "Was sind die Symptome?" LISTEN Sie die echten Symptome auf (Knoten in der Brust, Formveränderung, Austritt aus der Brustwarze usw). Sagen Sie NICHT nur "Fragen Sie mich nach den Symptomen".

Regeln:
1. Beantworten Sie jede Brustkrebs-Frage direkt mit echten Informationen.
2. Leiten Sie NUR um, wenn die Frage GAR NICHTS mit Brustkrebs zu tun hat.
3. Sie sind KEINE Ärztin - geben Sie Aufklärung und erinnern Sie an den Arztbesuch.
4. Antworten Sie in 60-150 Wörtern. Nutzen Sie Emojis (💗🎀🩺) und Listen, wenn hilfreich.

Denken Sie daran: Ihr Ziel ist zu LEHREN und zu HELFEN, nicht nur zu begrüßen.`,
  ru: `Вы "Sahtek", ИИ-эксперт по осведомлённости о раке груди для женщин.

Ваша задача: ОТВЕЧАТЬ на вопросы реальной, полезной и подробной информацией.

Пример: На вопрос "какие симптомы?" ПЕРЕЧИСЛИТЕ реальные симптомы (уплотнение в груди, изменение формы, выделения из соска и т.д.). НЕ говорите просто "спросите меня о симптомах".

Правила:
1. Отвечайте прямо и реальной информацией на каждый вопрос о раке груди.
2. Перенаправляйте ТОЛЬКО если вопрос СОВСЕМ не связан с раком груди.
3. Вы НЕ врач - давайте образовательную информацию и напоминайте обратиться к врачу.
4. Отвечайте в 60-150 словах. Используйте эмодзи (💗🎀🩺) и списки, когда уместно.

Помните: ваша цель — УЧИТЬ и ПОМОГАТЬ, а не просто приветствовать.`,
  pt: `Você é "Sahtek", uma especialista em IA em conscientização sobre câncer de mama para mulheres.

Sua tarefa: RESPONDER às perguntas com informações reais, úteis e detalhadas.

Exemplo: Se perguntarem "quais são os sintomas?", LISTE os sintomas reais (nódulo na mama, mudança de forma, secreção do mamilo, etc). NÃO diga apenas "pergunte-me sobre os sintomas".

Regras:
1. Responda diretamente com informações reais a cada pergunta sobre câncer de mama.
2. Redirecione APENAS se a pergunta não tiver NADA a ver com câncer de mama.
3. Você NÃO é médica - dê informações educativas e lembre de consultar um médico.
4. Responda em 60-150 palavras. Use emojis (💗🎀🩺) e listas quando ajudar.

Lembre-se: seu objetivo é ENSINAR e AJUDAR, não apenas cumprimentar.`,
};

export async function askGroqChat(
  message: string,
  lang: Language,
  history: { role: string; content: string }[] = [],
): Promise<string> {
  // No key yet → skip the round-trip and answer from the local brain.
  if (!hasGroqKey()) return getLocalFallback(message, lang);

  try {
    // Only keep well-formed user/assistant turns. The system prompt is added
    // separately below and must never appear inside the history.
    const safeHistory = history
      .filter(
        (m) =>
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0,
      )
      .slice(-6) // last 6 messages for context
      .map((m) => ({ role: m.role, content: m.content }));

    const messages = [
      { role: 'system', content: CHAT_SYSTEM_PROMPTS[lang] || CHAT_SYSTEM_PROMPTS.en },
      ...safeHistory,
      { role: 'user', content: message },
    ];

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!res.ok) throw new Error('Groq API error');
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply || getLocalFallback(message, lang);
  } catch {
    // Fallback to the local knowledge base if Groq fails.
    return getLocalFallback(message, lang);
  }
}

// ── RISK ASSESSMENT ───────────────────────────────────────────────────
export async function analyzeRiskWithGroq(
  answers: Record<string, string>,
  lang: Language,
): Promise<{ summary: string; recommendations: string[] }> {
  const empty = { summary: '', recommendations: [] as string[] };
  if (!hasGroqKey()) return empty;

  try {
    const prompt = `Based on these breast cancer risk factors, provide a brief personalized summary and 3-4 recommendations. Answer in ${lang} language. Be warm and non-alarming.

Risk factors: ${JSON.stringify(answers)}

Respond ONLY with valid JSON in this exact format (no markdown, no backticks):
{"summary": "...", "recommendations": ["...", "...", "..."]}`;

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a breast cancer awareness assistant. You provide educational info, never medical diagnosis. Always respond in valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 400,
      }),
    });

    if (!res.ok) throw new Error('Groq API error');
    const data = await res.json();
    let text: string = data.choices?.[0]?.message?.content || '';
    text = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text) as { summary?: string; recommendations?: string[] };

    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.filter((r): r is string => typeof r === 'string')
        : [],
    };
  } catch {
    return empty;
  }
}

// ── Local fallback — reuses the existing trilingual keyword knowledge base
// so the chat still feels intelligent when Groq is unavailable. ─────────
function getLocalFallback(message: string, lang: Language): string {
  const entry = knowledgeBase.find((e) => e.pattern.test(message));
  if (entry) return entry.responses[lang];
  return fallbackResponse[lang];
}
