
import { Home } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';

export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <PageTransition>
      <section className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-card/85 p-8 text-center shadow-petal-xl">
        <h1 className="text-5xl font-black text-gradient">404</h1>
        <h2 className="mt-3 text-3xl font-black text-ink">{t.notFound.title}</h2>
        <p className="mt-3 font-medium text-muted">{t.notFound.text}</p>
        <Button to="/" className="mt-6" leftIcon={<Home size={18} />}>{t.notFound.cta}</Button>
      </section>
    </PageTransition>
  );
}
