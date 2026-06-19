import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';
import { NavArrows } from './NavArrows';
import { useLanguage } from '@/hooks/useLanguage';

export function Layout() {
  const { t, dir, lang, fontClass } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [dir, lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Sequential page flow shown as fixed corner arrows. The Learn page owns its
  // own hybrid tab+page arrows, so the global ones step aside there.
  const pageOrder = [
    { path: '/', label: t.nav.home },
    { path: '/learn', label: t.nav.learn },
    { path: '/self-check', label: t.nav.selfCheck },
    { path: '/risk', label: t.nav.risk },
    { path: '/chat', label: t.nav.chat },
    { path: '/reminder', label: t.nav.reminder },
  ];
  const currentIndex = pageOrder.findIndex((p) => p.path === location.pathname);
  const isKnownPage = currentIndex !== -1;
  const isLearn = location.pathname === '/learn';
  const prevPage = currentIndex > 0 ? pageOrder[currentIndex - 1] : null;
  const nextPage = currentIndex < pageOrder.length - 1 ? pageOrder[currentIndex + 1] : null;

  const go = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showGlobalArrows = isKnownPage && !isLearn;

  return (
    <div className={`min-h-full overflow-x-hidden ${fontClass}`}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute bottom-20 right-[-20%] h-80 w-80 rounded-full bg-accent-teal/15 blur-3xl" />
      </div>
      <Navbar />
      <Outlet />
      {showGlobalArrows && (
        <NavArrows
          transitionKey={location.pathname}
          prev={prevPage ? { label: prevPage.label, aria: t.common.previous, onActivate: () => go(prevPage.path) } : null}
          next={nextPage ? { label: nextPage.label, aria: t.common.next, onActivate: () => go(nextPage.path) } : null}
        />
      )}
      <BottomNav />
    </div>
  );
}
