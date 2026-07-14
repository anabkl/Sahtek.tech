import { Link, NavLink } from 'react-router-dom';
import { Facebook, Instagram, Youtube, type LucideIcon } from 'lucide-react';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { LanguageSwitch } from '@/components/ui/LanguageSwitch';
import { LogoLockup } from '@/components/ui/LogoLockup';
import { TrustPill } from '@/components/ui/TrustPill';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { APP, FOOTER_LINKS, SOCIAL_LINKS } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { Translation } from '@/i18n';

const EXPLORE: { to: string; key: keyof Translation['nav'] }[] = [
  { to: '/signs', key: 'signs' },
  { to: '/when-to-seek-help', key: 'whenToSeek' },
  { to: '/learn', key: 'learn' },
  { to: '/self-check', key: 'selfCheck' },
  { to: '/risk-factors', key: 'riskFactors' },
  { to: '/risk', key: 'risk' },
  { to: '/companion', key: 'companion' },
  { to: '/chat', key: 'chat' },
  { to: '/doctors', key: 'doctors' },
  { to: '/reminder', key: 'reminder' },
  { to: '/faq', key: 'faq' },
  { to: '/about', key: 'about' },
];

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

const linkClass =
  'focus-ring inline-flex min-h-11 items-center rounded-sm text-body-sm font-semibold text-muted transition hover:text-accent-text';

/**
 * Site footer: brand, navigation, legal, and the standing medical disclaimer.
 *
 * Social icons and legal links render only when a destination is configured in
 * `src/config/constants.ts` — an unconfigured entry disappears rather than
 * shipping a link that 404s.
 */
export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const legalLinks = FOOTER_LINKS.filter((link) => link.to || link.href);
  const socials = SOCIAL_LINKS.filter((social) => social.url);

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-line bg-card/70 pb-28 pt-12 lg:pb-12">
      <ZelligeAccent
        variant="corner"
        tone="gold"
        size={120}
        opacity={0.12}
        className="pointer-events-none absolute end-0 top-0 rotate-90"
      />

      <div className="relative mx-auto max-w-content px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" aria-label={t.app.name} className="focus-ring inline-block rounded-2xl">
              <LogoLockup size="lg" />
            </Link>
            <p className="mt-4 max-w-sm text-body-sm text-muted">{t.app.tagline}</p>
            <div className="mt-4">
              <TrustPill tone="calm">{t.footer.privacyNote}</TrustPill>
            </div>
          </div>

          {/* Explore */}
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="text-overline uppercase text-muted">
              {t.footer.explore}
            </h2>
            <ul className="mt-3 space-y-0.5">
              {EXPLORE.map(({ to, key }) => (
                <li key={to}>
                  <NavLink to={to} className={linkClass}>
                    {t.nav[key]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal + contact */}
          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="text-overline uppercase text-muted">
              {t.footer.legal}
            </h2>
            <ul className="mt-3 space-y-0.5">
              {legalLinks.map((link) => (
                <li key={link.key}>
                  {link.href ? (
                    <a href={link.href} className={linkClass}>
                      {t.footer[link.key]}
                    </a>
                  ) : (
                    <Link to={link.to as string} className={linkClass}>
                      {t.footer[link.key]}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <>
                <h2 className="mt-6 text-overline uppercase text-muted">{t.footer.followUs}</h2>
                <ul className="mt-3 flex gap-2">
                  {socials.map(({ id, url }) => {
                    const Icon = SOCIAL_ICONS[id];
                    return (
                      <li key={id}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={id}
                          className="focus-ring grid h-11 w-11 place-items-center rounded-pill border border-line bg-card text-muted transition hover:border-primary-200 hover:text-accent-text"
                        >
                          <Icon size={18} aria-hidden />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </nav>
        </div>

        {/* The disclaimer is the load-bearing trust element — it gets its own row. */}
        <div className="mt-10">
          <Disclaimer full withTitle />
        </div>

        <div className="hairline mt-10" />

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-caption text-muted">
              © {year} {APP.latinName}. {t.footer.rights}
            </p>
            <p className="text-caption text-muted">{t.footer.madeIn}</p>
          </div>
          <LanguageSwitch variant="inline" className="justify-start sm:justify-end" />
        </div>
      </div>
    </footer>
  );
}
