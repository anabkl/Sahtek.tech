import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Mic, Send, Sparkles, Trash2, UserRound } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/toastStore';
import { useLanguage } from '@/hooks/useLanguage';
import { usePersistedState } from '@/hooks/usePersistedState';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { formatTime } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

function renderMarkdownBold(content: string): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, boldText] = match;
    if (match.index > cursor) {
      parts.push(content.slice(cursor, match.index));
    }
    parts.push(<strong key={`${match.index}-${boldText}`}>{boldText}</strong>);
    cursor = match.index + fullMatch.length;
  }

  if (cursor < content.length) {
    parts.push(content.slice(cursor));
  }

  return parts.length > 0 ? <>{parts}</> : content;
}

function answerFor(text: string, lang: string): string {
  const q = text.toLowerCase();
  const ar = lang === 'ar';
  const fr = lang === 'fr';
  if (q.includes('symptom') || q.includes('sign') || q.includes('عرض') || q.includes('signe')) {
    return ar
      ? 'راقبي أي كتلة جديدة، تغيير فالجلد، إفراز من الحلمة، ألم مركز، أو تغيير فالحجم. أغلب التغييرات ماشي سرطان، ولكن أي تغيير جديد خاصو طبيب.'
      : fr
        ? 'Surveillez une masse nouvelle, changement de peau, ecoulement du mamelon, douleur localisee ou changement de taille. Un changement nouveau merite un avis medical.'
        : 'Watch for a new lump, skin change, nipple discharge, focused pain or size change. Most changes are not cancer, but new changes deserve a doctor visit.';
  }
  if (q.includes('check') || q.includes('فحص') || q.includes('exam')) {
    return ar
      ? 'ديري الفحص مرة فالشهر: شوفي فالمرآة، رفعي يديك، فحصي بحركات دائرية وانتي واقفة ومستلقيّة، ومن بعد راقبي الحلمة بلطف.'
      : fr
        ? 'Faites-le une fois par mois: miroir, bras leves, mouvements circulaires debout puis allongee, puis verification douce du mamelon.'
        : 'Do it once a month: mirror check, arms raised, circular touch while standing and lying down, then a gentle nipple check.';
  }
  if (q.includes('scared') || q.includes('خايف') || q.includes('peur')) {
    return ar
      ? 'الخوف مفهوم. خدي نفس، وما تبقايش بوحدك. هاد الدردشة للتوعية فقط، وأحسن خطوة هي تحددي موعد مع طبيب باش تطمني.'
      : fr
        ? 'La peur est normale. Respirez, ne restez pas seule. Cette discussion informe seulement; le meilleur geste est de prendre rendez-vous avec un medecin.'
        : 'Fear is understandable. Breathe and do not stay alone with it. This chat is educational; the best next step is booking a doctor visit for reassurance.';
  }
  return ar
    ? 'نقدر نعاونك بمعلومات توعوية على صحة الثدي، الفحص الذاتي، العلامات، والوقاية. ما نقدرش نعطي تشخيص، والطبيب هو المرجع.'
    : fr
      ? 'Je peux aider avec des informations educatives sur la sante du sein, les signes, l auto-examen et la prevention. Je ne pose pas de diagnostic.'
      : 'I can help with educational breast-health information, signs, self-checks and prevention. I cannot diagnose; a clinician is the right person for medical decisions.';
}

const MAX_MESSAGES = 50;
const CHAT_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export function ChatPage() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = usePersistedState<Message[]>(
    'sahtek_chat',
    [{ role: 'assistant', content: t.chat.disclaimer, timestamp: Date.now() }],
    CHAT_MAX_AGE,
  );
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const quickReplies = useMemo(() => t.chat.quickReplies, [t.chat.quickReplies]);

  // On mount, jump to the latest message of the restored history.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  // ── Voice input — browser Web Speech API, frontend only ──────────
  const toast = useToast();
  const voiceBaseRef = useRef('');
  const voice = useSpeechRecognition({
    lang,
    onResult: (transcript) => {
      const base = voiceBaseRef.current;
      setText(base ? `${base} ${transcript}` : transcript);
    },
  });

  // Click the mic: toggle listening; warn once if the API is missing.
  // Speech only fills the input — the user still presses Send themselves.
  const toggleVoice = () => {
    if (!voice.supported) {
      toast(t.chat.voiceUnsupported, 'error');
      return;
    }
    if (voice.listening) {
      voice.stop();
      return;
    }
    voiceBaseRef.current = text.trim();
    voice.start();
  };

  const send = (value = text) => {
    const trimmed = value.trim();
    if (!trimmed || typing) return;
    if (voice.listening) voice.stop();
    setMessages((prev) => [...prev, { role: 'user' as const, content: trimmed, timestamp: Date.now() }].slice(-MAX_MESSAGES));
    setText('');
    setTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant' as const, content: answerFor(trimmed, lang), timestamp: Date.now() }].slice(-MAX_MESSAGES));
      setTyping(false);
      window.setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, 650);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send();
  };

  return (
    <PageTransition>
      <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-card/85 shadow-petal-xl">
        <header className="border-b border-line p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-gradient text-white"><Bot /></span>
              <div><h1 className="text-2xl font-black text-ink">{t.chat.title}</h1><p className="text-sm font-bold text-muted">{t.chat.online}</p></div>
            </div>
            <button onClick={() => setMessages([])} className="grid h-11 w-11 place-items-center rounded-full bg-primary-50 text-primary-700" aria-label={t.chat.clear}><Trash2 size={18} /></button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {quickReplies.map((reply) => <button key={reply} onClick={() => send(reply)} className="shrink-0 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-primary-700 shadow-petal">{reply}</button>)}
          </div>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={`${message.timestamp}-${index}`} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-100 text-primary-700"><Sparkles size={16} /></span>}
              <div className={`max-w-[82%] rounded-3xl p-4 shadow-petal ${message.role === 'user' ? 'bg-rose-gradient text-white' : 'bg-white/80 text-ink'}`}>
                <p className="whitespace-pre-wrap font-medium leading-7">{renderMarkdownBold(message.content)}</p>
                <p className="mt-2 text-[11px] opacity-70">{formatTime(message.timestamp, lang)}</p>
              </div>
              {message.role === 'user' && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-teal/15 text-accent-teal"><UserRound size={16} /></span>}
            </div>
          ))}
          {typing && <div className="rounded-full bg-white/80 px-4 py-3 text-sm font-bold text-muted shadow-petal">{t.chat.typing}</div>}
          <div ref={endRef} />
        </div>
        <form onSubmit={submit} className="border-t border-line p-3">
          {voice.listening && (
            <div className="mb-2 flex items-center justify-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-black text-primary-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
              </span>
              {t.chat.listening}
            </div>
          )}
          <div className="flex gap-2 rounded-full bg-white/80 p-2 shadow-inner">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.chat.placeholder} className="min-w-0 flex-1 bg-transparent px-4 font-bold text-ink outline-none" />
            <div className="relative shrink-0">
              {voice.listening && (
                <span className="pointer-events-none absolute inset-0 animate-pulse-ring rounded-full bg-rose-gradient" aria-hidden />
              )}
              <button
                type="button"
                onClick={toggleVoice}
                aria-pressed={voice.listening}
                aria-label={voice.listening ? t.chat.listening : t.chat.voiceLabel}
                className={cn(
                  'relative grid h-12 w-12 place-items-center rounded-full transition-all duration-200 active:scale-95',
                  voice.listening
                    ? 'bg-rose-gradient text-white shadow-petal-lg'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100',
                )}
              >
                <Mic size={18} />
              </button>
            </div>
            <Button type="submit" disabled={!text.trim()} aria-label={t.common.send}><Send size={18} /></Button>
          </div>
        </form>
      </section>
    </PageTransition>
  );
}
