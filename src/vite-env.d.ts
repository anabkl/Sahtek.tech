/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_OPENWA_URL: string;
  readonly VITE_OPENWA_KEY: string;
  readonly VITE_OPENWA_SESSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
