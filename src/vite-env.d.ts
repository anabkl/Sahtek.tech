/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/**
 * NEVER declare a secret here.
 *
 * Vite inlines every VITE_-prefixed variable into the public JS bundle at build
 * time, so anything named VITE_*_KEY is readable by anyone who opens the page.
 * VITE_GROQ_API_KEY and VITE_OPENWA_KEY / _URL / _SESSION used to live here and
 * shipped to the browser. They are gone; API keys belong on the server.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_USE_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
