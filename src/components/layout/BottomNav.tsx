import { NavLink } from 'react-router-dom';
import { Bot, HeartPulse, Home, LibraryBig, Gauge, Bell, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

const items = [
  { to: '/', key: 'home', icon: Home },
  { to: '/learn', key: 'learn', icon: LibraryBig },
  { to: '/self-check', key: 'selfCheck', icon: HeartPulse },
  { to: '/risk', key: 'risk', icon: Gauge },
  { to: '/chat', key: 'chat', icon: Bot },
  { to: '/doctors', key: 'doctors', icon: MapPin },
  { to: '/reminder', key: 'reminder', icon: Bell },
] as const;

export function BottomNav() {
  const { t } = useLanguage();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-card/90 px-2 pb-safe pt-2 shadow-[0_-20px_50px_rgba(214,51,132,0.12)] backdrop-blur-2xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-7 gap-1">
        {items.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold text-muted transition',
                isActive && 'bg-primary-50 text-primary-700 shadow-glow',
              )
            }
          >
            <Icon size={20} strokeWidth={2.4} />
            <span className="max-w-full truncate">{t.nav[key]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
