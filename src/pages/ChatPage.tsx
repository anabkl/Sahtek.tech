import { FormEvent, useMemo, useRef, useState } from 'react';
import { Bot, Send, Sparkles, Trash2, UserRound } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { sendChatMessage } from '@/services/chatService';
import { formatTime } from '@/utils/formatters';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function ChatPage() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.chat.disclaimer, timestamp: Date.now() },
  ]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const quickReplies = useMemo(() => t.chat.quickReplies, [t.chat.quickReplies]);

  const send = async (value = text) => {
    const trimmed = value.trim();
    if (!trimmed || typing) return;
    const userMessage: Message = { role: 'user', content: trimmed, timestamp: Date.now() };
    const conversation = [...messages, userMessage].slice(-10);
    setMessages((prev) => [...prev, userMessage]);
    setText('');
    setTyping(true);
    try {
      const response = await sendChatMessage({
        message: trimmed,
        language: lang,
        conversation_history: conversation.map(({ role, content }) => ({ role, content })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.response, timestamp: Date.now() }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: t.chat.disclaimer, timestamp: Date.now() }]);
    } finally {
      setTyping(false);
      window.setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void send();
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
            {quickReplies.map((reply) => <button key={reply} onClick={() => void send(reply)} className="shrink-0 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-primary-700 shadow-petal">{reply}</button>)}
          </div>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={`${message.timestamp}-${index}`} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-100 text-primary-700"><Sparkles size={16} /></span>}
              <div className={`max-w-[82%] rounded-3xl p-4 shadow-petal ${message.role === 'user' ? 'bg-rose-gradient text-white' : 'bg-white/80 text-ink'}`}>
                <p className="font-medium leading-7">{message.content}</p>
                <p className="mt-2 text-[11px] opacity-70">{formatTime(message.timestamp, lang)}</p>
              </div>
              {message.role === 'user' && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-teal/15 text-accent-teal"><UserRound size={16} /></span>}
            </div>
          ))}
          {typing && <div className="rounded-full bg-white/80 px-4 py-3 text-sm font-bold text-muted shadow-petal">{t.chat.typing}</div>}
          <div ref={endRef} />
        </div>
        <form onSubmit={submit} className="border-t border-line p-3">
          <div className="flex gap-2 rounded-full bg-white/80 p-2 shadow-inner">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.chat.placeholder} className="min-w-0 flex-1 bg-transparent px-4 font-bold text-ink outline-none" />
            <Button type="submit" disabled={!text.trim()} aria-label={t.common.send}><Send size={18} /></Button>
          </div>
        </form>
      </section>
    </PageTransition>
  );
}
