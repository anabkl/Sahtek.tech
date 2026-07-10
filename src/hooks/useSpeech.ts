import { useState, useCallback, useEffect } from 'react';

// Preferred BCP-47 voice codes per language, most specific first. Matching is
// done on the primary subtag (e.g. 'ar'), so any regional variant qualifies —
// important for Arabic, where a device may only ship ar-EG or ar-MA, not ar-SA.
const LANG_VOICE_MAP: Record<string, string[]> = {
  ar: ['ar-SA', 'ar-AE', 'ar-EG', 'ar-MA', 'ar'],
  fr: ['fr-FR', 'fr'],
  en: ['en-US', 'en-GB', 'en'],
  es: ['es-ES', 'es-MX', 'es'],
  de: ['de-DE', 'de'],
  ru: ['ru-RU', 'ru'],
  pt: ['pt-BR', 'pt-PT', 'pt'],
};

/** First installed voice whose language matches any preferred variant, or null. */
function findVoice(lang: string): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const codes = LANG_VOICE_MAP[lang] || ['en-US'];
  const voices = window.speechSynthesis.getVoices();
  for (const code of codes) {
    const match = voices.find((v) => v.lang.startsWith(code.split('-')[0]));
    if (match) return match;
  }
  return null;
}

// ── Global speech state ─────────────────────────────────────────────────
// Playback is owned by the SpeechSynthesis singleton, so its state lives at
// module level (not inside the hook). This lets narration keep playing when
// the component that started it unmounts — e.g. navigating away from the
// Self-Check page — while every mounted useSpeech() consumer stays in sync
// via the subscription below. The global Stop button in Layout uses this.
let globalIsSpeaking = false;
let globalActiveId: string | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function useSpeech() {
  const [, forceUpdate] = useState({});
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Re-render this consumer whenever the global speaking state changes, even
  // if another mounted instance (or the Layout Stop button) triggered it.
  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Voices often load asynchronously — getVoices() can be empty on first call.
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      if (window.speechSynthesis.getVoices().length > 0) setVoicesLoaded(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /** Whether the device has any installed voice for the given language. */
  const hasVoice = useCallback((lang: string) => findVoice(lang) !== null, []);

  const speak = useCallback((text: string, lang: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    // Toggle: clicking the currently-speaking card stops it.
    if (globalActiveId === id && globalIsSpeaking) {
      window.speechSynthesis.cancel();
      globalIsSpeaking = false;
      globalActiveId = null;
      notifyListeners();
      return;
    }

    // Cancel any current speech.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = (LANG_VOICE_MAP[lang] || ['en-US'])[0];
    utterance.rate = 0.85; // slightly slower for clarity
    utterance.pitch = 1.1; // slightly higher, softer voice

    // Pick the best installed voice for the language across its variants.
    const selectedVoice = findVoice(lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onstart = () => {
      globalIsSpeaking = true;
      globalActiveId = id;
      notifyListeners();
    };
    utterance.onend = () => {
      globalIsSpeaking = false;
      globalActiveId = null;
      notifyListeners();
    };
    utterance.onerror = () => {
      globalIsSpeaking = false;
      globalActiveId = null;
      notifyListeners();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    globalIsSpeaking = false;
    globalActiveId = null;
    notifyListeners();
  }, []);

  // NOTE: no unmount cleanup that cancels speech — narration intentionally
  // continues across navigation. The Layout Stop button keeps the user in control.

  return {
    speak,
    stop,
    isSpeaking: globalIsSpeaking,
    activeId: globalActiveId,
    voicesLoaded,
    hasVoice,
  };
}
