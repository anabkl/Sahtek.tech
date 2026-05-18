import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';
import { useLanguage } from '@/hooks/useLanguage';

export function Layout() {
  const { dir, lang, fontClass } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [dir, lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className={`min-h-full overflow-x-hidden ${fontClass}`}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute bottom-20 right-[-20%] h-80 w-80 rounded-full bg-accent-teal/15 blur-3xl" />
      </div>
      <Navbar />
      <Outlet />
      <BottomNav />
    </div>
  );
}
