// ── Groq API configuration ──────────────────────────────────────────
// Free-forever, fast LLM inference. Used by src/services/groqService.ts
// for the AI chat and the optional risk-assessment personalization.
//
// The key is read from the environment (VITE_GROQ_API_KEY in .env, which is
// gitignored). Vite inlines VITE_-prefixed vars into the client bundle at
// build time, so it still ships to the browser — fine for the hackathon
// demo, but for production this should be proxied through a backend so the
// key is never exposed. Set the same var in Vercel → Settings → Environment
// Variables for the deployed build.
//
// Get a free key at https://console.groq.com/keys — it starts with `gsk_`.

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export { GROQ_API_KEY };
