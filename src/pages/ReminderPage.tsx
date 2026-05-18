import { useMemo, useState } from 'react';
import { BellRing, CalendarDays, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDate, nextReminderDate } from '@/utils/formatters';

export function ReminderPage() {
  const { t, lang } = useLanguage();
  const [day, setDay] = useState(7);
  const [method, setMethod] = useState<'email' | 'sms' | 'both'>('sms');
  const [active, setActive] = useState(false);
  const next = useMemo(() => nextReminderDate(day), [day, active]);

  return (
    <PageTransition>
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <BellRing className="text-primary-500" size={44} />
          <h1 className="mt-4 text-4xl font-black text-ink">{t.reminder.title}</h1>
          <p className="mt-3 text-lg font-medium leading-8 text-muted">{t.reminder.subtitle}</p>
          <p className="mt-5 rounded-3xl bg-primary-50 p-5 font-bold leading-7 text-primary-800">{t.reminder.intro}</p>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-card/85 p-6 shadow-petal-xl">
          {!active ? (
            <>
              <label className="text-sm font-black text-muted">{t.reminder.pickDay}</label>
              <div className="mt-3 grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((value) => (
                  <button key={value} onClick={() => setDay(value)} className={`aspect-square rounded-2xl text-sm font-black transition ${day === value ? 'bg-primary-500 text-white shadow-glow' : 'bg-white/65 text-muted'}`}>{value}</button>
                ))}
              </div>
              <label className="mt-6 block text-sm font-black text-muted">{t.reminder.method}</label>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(['email', 'sms', 'both'] as const).map((item) => (
                  <button key={item} onClick={() => setMethod(item)} className={`min-h-12 rounded-2xl font-black ${method === item ? 'bg-rose-gradient text-white' : 'bg-white/65 text-muted'}`}>
                    {item === 'email' ? t.reminder.methodEmail : item === 'sms' ? t.reminder.methodSms : t.reminder.methodBoth}
                  </button>
                ))}
              </div>
              <Button className="mt-6" fullWidth size="lg" onClick={() => setActive(true)}>{t.reminder.confirmBtn}</Button>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle2 className="mx-auto text-accent-teal" size={58} />
              <h2 className="mt-4 text-3xl font-black text-ink">{t.reminder.confirmedTitle}</h2>
              <div className="mt-5 rounded-3xl bg-primary-50 p-5">
                <CalendarDays className="mx-auto text-primary-500" />
                <p className="mt-2 text-sm font-black text-muted">{t.reminder.nextReminderLabel}</p>
                <p className="mt-1 text-xl font-black text-primary-800">{formatDate(next, lang)}</p>
              </div>
              <Button className="mt-6" variant="secondary" fullWidth onClick={() => setActive(false)}>{t.reminder.changeBtn}</Button>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
