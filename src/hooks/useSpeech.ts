import { useState, useCallback, useEffect, useRef } from 'react';

const LANG_VOICE_MAP: Record<string, string> = {
  ar: 'ar-SA',
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
  ru: 'ru-RU',
  pt: 'pt-BR',
};

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: string, id: string) => {
    // If already speaking this one, stop it
    if (activeId === id && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveId(null);
      return;
    }

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_VOICE_MAP[lang] || 'en-US';
    utterance.rate = 0.85;  // slightly slower for clarity
    utterance.pitch = 1.1;  // slightly higher for feminine voice

    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v =>
      v.lang.startsWith(LANG_VOICE_MAP[lang]?.split('-')[0] || 'en') &&
      (v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('woman') ||
       v.name.toLowerCase().includes('samantha') ||
       v.name.toLowerCase().includes('victoria') ||
       v.name.toLowerCase().includes('amelie') ||
       v.name.toLowerCase().includes('thomas') === false)
    );

    if (femaleVoice) utterance.voice = femaleVoice;

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
  }, [activeId, isSpeaking]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveId(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  return { speak, stop, isSpeaking, activeId };
}
