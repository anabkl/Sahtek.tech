import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { MobileDrawer, type DrawerLink } from '@/components/layout/MobileDrawer';
import { LanguageSwitch } from '@/components/ui/LanguageSwitch';
import { LogoLockup } from '@/components/ui/LogoLockup';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

/* Desktop keeps the primary journey visible; the drawer carries everything. */
const PRIMARY_LINKS: DrawerLink[] = [
  { to: '/', key: 'home' },
  { to: '/learn', key: 'learn' },
  { to: '/self-check', key: 'selfCheck' },
  { to: '/risk', key: 'risk' },
  { to: '/chat', key: 'chat' },
];

const ALL_LINKS: DrawerLink[] = [
  ...PRIMARY_LINKS,
  { to: '/doctors', key: 'doctors' },
  { to: '/reminder', key: 'reminder' },
];

/** Sticky top bar: logo lockup, primary links, language, theme, mobile drawer. */
export function Navbar() {
  const { t } = useLanguage();
  const { resolved, toggle } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDark = resolved === 'dark';

  return (
    <>
      <header className="glass sticky top-0 z-40 border-x-0 border-t-0 border-b border-line px-4 pt-safe">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-3">
          {/* The link carries the accessible name; the lockup inside is decorative. */}
          <NavLink to="/" aria-label={t.app.name} className="focus-ring rounded-2xl">
            <LogoLockup showTagline />
          </NavLink>

          <nav aria-label={t.common.menu} className="hidden items-center gap-1 lg:flex">
            {PRIMARY_LINKS.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'focus-ring flex min-h-11 items-center rounded-pill px-4 text-body-sm font-bold transition',
                    isActive ? 'bg-accent-soft text-accent-text' : 'text-muted hover:bg-sunken hover:text-ink',
                  )
                }
              >
                {t.nav[key]}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitch />

            <button
              type="button"
              onClick={toggle}
              aria-pressed={isDark}
              aria-label={`${t.settings.theme}: ${isDark ? t.settings.dark : t.settings.light}`}
              title={isDark ? t.settings.light : t.settings.dark}
              className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-line bg-card text-accent-text shadow-petal transition hover:border-primary-200 active:scale-95"
            >
              {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t.common.menu}
              aria-expanded={drawerOpen}
              className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-line bg-card text-ink shadow-petal transition hover:border-primary-200 active:scale-95 lg:hidden"
            >
              <Menu size={18} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} links={ALL_LINKS} />
    </>
  );
}
