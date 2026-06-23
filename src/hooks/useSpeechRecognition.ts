import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '@/types/api';

// ── UI language → BCP-47 locale for browser speech recognition ──────
const SPEECH_LOCALE: Record<Language, string> = {
  ar: 'ar-MA',
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
  ru: 'ru-RU',
  pt: 'pt-BR',
};

/** Returns the browser's SpeechRecognition constructor, if it exists. */
function getRecognitionCtor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

interface UseSpeechRecognitionOptions {
  /** Active UI language — drives the recognition locale. */
  lang: Language;
  /** Receives the transcribed text (interim updates included). */
  onResult: (transcript: string) => void;
  /** Optional: notified of recognition errors (e.g. mic denied). */
  onError?: (error: string) => void;
}

interface UseSpeechRecognition {
  /** Whether this browser exposes the Web Speech API at all. */
  supported: boolean;
  /** True while the microphone is actively listening. */
  listening: boolean;
  /** Request the microphone and begin a listening session. */
  start: () => void;
  /** Stop listening early — any captured text is still delivered. */
  stop: () => void;
}

/**
 * Thin, frontend-only wrapper around the browser Web Speech API.
 *
 * Speech is transcribed on-device by the browser and handed back as
 * plain text via `onResult`. Nothing here calls the backend or touches
 * the chat API contract — it only fills the existing text input.
 */
export function useSpeechRecognition({
  lang,
  onResult,
  onError,
}: UseSpeechRecognitionOptions): UseSpeechRecognition {
  const [supported] = useState(() => Boolean(getRecognitionCtor()));
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Keep the latest callbacks without re-creating the recogniser.
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  onResultRef.current = onResult;
  onErrorRef.current = onError;

  // Keep recognition language in sync with the active UI language.
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = SPEECH_LOCALE[lang];
    }
  }, [lang]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    // Re-use a single recogniser instance across sessions.
    let recognition = recognitionRef.current;
    if (!recognition) {
      recognition = new Ctor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
    }
    recognition.lang = SPEECH_LOCALE[lang];

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      onErrorRef.current?.(event.error);
    };
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (transcript) onResultRef.current(transcript);
    };

    try {
      recognition.start();
    } catch {
      // start() throws if invoked while already running — harmless.
    }
  }, [lang]);

  // Abort any in-flight recognition if the component unmounts.
  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  return { supported, listening, start, stop };
}
