import { NavLink } from 'react-router-dom';
import { HeartPulse, Languages, ShieldCheck } from 'lucide-react';
import { LANGUAGE_META, SUPPORTED_LANGUAGES } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/', key: 'home' },
  { to: '/learn', key: 'learn' },
  { to: '/self-check', key: 'selfCheck' },
  { to: '/risk', key: 'risk' },
  { to: '/chat', key: 'chat' },
] as const;

export function Navbar() {
  const { t, lang, setLang } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-canvas/80 px-4 py-3 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <NavLink to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-gradient text-white shadow-petal-lg">
            <HeartPulse size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black leading-tight text-ink">{t.app.name}</span>
            <span className="hidden truncate text-xs font-semibold text-muted sm:block">{t.app.tagline}</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 rounded-full border border-line bg-card/70 p-1 shadow-petal lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm font-bold text-muted transition',
                  isActive && 'bg-primary-500 text-white shadow-petal',
                )
              }
            >
              {t.nav[item.key]}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1 rounded-full bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700 sm:flex">
            <ShieldCheck size={14} />
            {t.common.demoMode}
          </span>
          <div className="relative">
            <Languages className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-600" />
            <select
              value={lang}
              onChange={(event) => setLang(event.target.value as typeof lang)}
              className="h-10 rounded-full border border-line bg-card ps-9 pe-4 text-sm font-bold text-ink shadow-petal outline-none"
              aria-label={t.settings.language}
            >
              {SUPPORTED_LANGUAGES.map((code) => (
                <option key={code} value={code}>
                  {LANGUAGE_META[code].native}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
