import { useState, useCallback, useEffect, useRef } from 'react';

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

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  const speak = useCallback(
    (text: string, lang: string, id: string) => {
      if (!('speechSynthesis' in window)) return;

      // Toggle: clicking the currently-speaking card stops it.
      if (activeId === id && isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setActiveId(null);
        return;
      }

      // Cancel any current speech
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
        setIsSpeaking(true);
        setActiveId(id);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setActiveId(null);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [activeId, isSpeaking],
  );

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveId(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return { speak, stop, isSpeaking, activeId, voicesLoaded, hasVoice };
}
