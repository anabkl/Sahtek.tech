import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Bot,
  Check,
  Gauge,
  HeartPulse,
  LockKeyhole,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { GlassCard } from '@/components/ui/GlassCard';
import { IconCard } from '@/components/ui/IconCard';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TrustPill } from '@/components/ui/TrustPill';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { cn } from '@/utils/cn';

/* Design-system preview — the approval surface for the token layer.
   Not linked from the app; reachable at /design-system.
   Contrast ratios here are COMPUTED LIVE from the CSS variables, so they
   cannot drift away from the truth: if a token changes, the badge changes. */

// -- WCAG 2.1 relative luminance + contrast -------------------------------
function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: number[]): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: number[], b: number[]): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Read a token like `--ink` ("45 31 45") into [r,g,b]. */
function readToken(name: string): number[] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parts = raw.split(/[\s,/]+/).map(Number).filter((n) => !Number.isNaN(n));
  return parts.length >= 3 ? parts.slice(0, 3) : [0, 0, 0];
}

const rgbOf = (t: number[]) => `rgb(${t[0]} ${t[1]} ${t[2]})`;

// -- Small display helpers -------------------------------------------------
function ContrastBadge({ ratio, large = false }: { ratio: number; large?: boolean }) {
  const min = large ? 3 : 4.5;
  const pass = ratio >= min;
  const aaa = ratio >= (large ? 4.5 : 7);
  return (
    <span
      className={cn(
        'rounded-pill px-2 py-0.5 text-overline',
        pass ? 'bg-calm-soft text-calm-text' : 'bg-attention-soft text-attention-text',
      )}
      title={`${ratio.toFixed(2)}:1 — needs ${min}:1`}
    >
      {ratio.toFixed(2)} {aaa ? 'AAA' : pass ? 'AA' : 'FAIL'}
    </span>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <h2 className="text-h2 text-ink">{title}</h2>
      {note && <p className="mt-2 max-w-prose text-body-sm text-muted">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const BRAND_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const SAND_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/* Tailwind scans source for complete class strings — a template literal like
   `text-${step}` is invisible to it and would never be generated. Spell them out. */
const TYPE_SAMPLES = [
  { cls: 'text-display', token: 'display', sample: 'Recognize. Learn. Act earlier.', body: false },
  { cls: 'text-h1', token: 'h1', sample: 'A companion, not a diagnosis', body: false },
  { cls: 'text-h2', token: 'h2', sample: 'Know the next step', body: false },
  { cls: 'text-h3', token: 'h3', sample: 'Five minutes, once a month', body: false },
  { cls: 'text-h4', token: 'h4', sample: 'What to look for', body: false },
  {
    cls: 'text-body-lg',
    token: 'body-lg',
    sample: 'Sahtek helps you notice changes early, in your own language, in private.',
    body: true,
  },
  {
    cls: 'text-body',
    token: 'body',
    sample: 'Sahtek helps you notice changes early, in your own language, in private.',
    body: true,
  },
  { cls: 'text-body-sm', token: 'body-sm', sample: 'Educational guidance only. Sahtek does not diagnose.', body: true },
  { cls: 'text-caption', token: 'caption', sample: 'Your answers stay on this device.', body: true },
] as const;

const ELEVATIONS = [
  { cls: 'shadow-e1', label: 'shadow-e1' },
  { cls: 'shadow-e2', label: 'shadow-e2' },
  { cls: 'shadow-e3', label: 'shadow-e3' },
  { cls: 'shadow-e4', label: 'shadow-e4' },
  { cls: 'shadow-overlay', label: 'shadow-overlay' },
] as const;

const RADII = [
  { cls: 'rounded-xs', label: 'xs' },
  { cls: 'rounded-sm', label: 'sm' },
  { cls: 'rounded-md', label: 'md' },
  { cls: 'rounded-lg', label: 'lg' },
  { cls: 'rounded-xl', label: 'xl' },
  { cls: 'rounded-2xl', label: '2xl' },
  { cls: 'rounded-3xl', label: '3xl' },
  { cls: 'rounded-pill', label: 'pill' },
] as const;

export default function DesignSystemPage() {
  const [dark, setDark] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [, force] = useState(0);
  const rerender = useCallback(() => force((n) => n + 1), []);

  // Drive the real <html> attributes so tokens resolve exactly as they will
  // in production. Restore on unmount — this page must not leak state.
  useEffect(() => {
    const root = document.documentElement;
    const prevDark = root.classList.contains('dark');
    const prevDir = root.dir;
    root.classList.toggle('dark', dark);
    root.dir = rtl ? 'rtl' : 'ltr';
    // Tokens change with the theme, so recompute the contrast badges.
    const id = window.setTimeout(rerender, 0);
    return () => {
      window.clearTimeout(id);
      root.classList.toggle('dark', prevDark);
      root.dir = prevDir;
    };
  }, [dark, rtl, rerender]);

  const ink = readToken('--ink');
  const canvas = readToken('--canvas');
  const card = readToken('--card');
  const white = [255, 255, 255];

  const semantic = [
    { name: '--ink', label: 'ink — primary text', role: 'text' },
    { name: '--muted', label: 'muted — secondary text', role: 'text' },
    { name: '--faint', label: 'faint — LARGE text / UI only', role: 'large' },
    { name: '--accent-text', label: 'accent-text — brand text', role: 'text' },
    { name: '--calm-text', label: 'calm — success / AI', role: 'text' },
    { name: '--warn-text', label: 'warn — soft caution', role: 'text' },
    { name: '--attention-text', label: 'attention — sparingly', role: 'text' },
    { name: '--info-text', label: 'info', role: 'text' },
    { name: '--gold-text', label: 'gold — Moroccan warmth', role: 'text' },
  ];

  const surfaces = ['--canvas', '--card', '--elevated', '--sunken', '--line', '--line-strong'];

  return (
    <div className="min-h-full bg-canvas bg-aurora">
      <div className="mx-auto max-w-content px-gutter py-12">
        {/* -- Header -- */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-overline uppercase text-accent-text">Sahtek.tech</span>
            <h1 className="mt-2 text-display text-ink">
              The <span className="text-gradient">design system</span>
            </h1>
            <p className="mt-4 max-w-prose text-body-lg text-muted">
              One source of truth: <code className="text-body-sm text-accent-text">src/styles/tokens.css</code>. Every
              ratio below is computed live from the tokens in your browser — nothing here is asserted.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setDark((d) => !d)}
              leftIcon={dark ? <Sun size={16} /> : <Moon size={16} />}
            >
              {dark ? 'Light' : 'Dark'}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setRtl((r) => !r)}>
              {rtl ? 'LTR' : 'RTL'}
            </Button>
          </div>
        </header>

        <div className="hairline mt-10" />

        {/* -- Brand scale -- */}
        <Section
          title="Brand — rose, magenta, berry"
          note="The identity, unchanged. Each swatch shows the best-contrast text on it, measured live. Note where white text stops being legal: 500 is the lightest step that carries white text at AA."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {BRAND_STEPS.map((step) => {
              const t = readToken(`--brand-${step}`);
              const onWhite = contrast(white, t);
              const onInk = contrast(ink, t);
              const useWhite = onWhite >= onInk;
              return (
                <div
                  key={step}
                  className="rounded-xl p-4 shadow-e1"
                  style={{ background: rgbOf(t), color: useWhite ? '#fff' : rgbOf(ink) }}
                >
                  <div className="text-body-sm font-bold">{step}</div>
                  <div className="mt-6 text-caption opacity-90">{rgbOf(t)}</div>
                  <div className="mt-1 text-caption font-bold">
                    {useWhite ? 'white' : 'ink'} {Math.max(onWhite, onInk).toFixed(1)}:1
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* -- Warm neutrals -- */}
        <Section title="Warm neutral base" note="Rose-tinted, never a cold grey. This is what keeps the product warm.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {SAND_STEPS.map((step) => {
              const t = readToken(`--sand-${step}`);
              const useWhite = contrast(white, t) >= contrast(ink, t);
              return (
                <div
                  key={step}
                  className="rounded-xl p-4 shadow-e1"
                  style={{ background: rgbOf(t), color: useWhite ? '#fff' : rgbOf(ink) }}
                >
                  <div className="text-body-sm font-bold">sand-{step}</div>
                  <div className="mt-4 text-caption opacity-90">{rgbOf(t)}</div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* -- Semantic text tokens -- */}
        <Section
          title="Semantic text — every one clears AA"
          note="Text tokens are separate from fill tokens on purpose. The brand fill (#D63384) is only 4.2:1 on the canvas — it fails as body text. --accent-text exists so brand-coloured text is always legal."
        >
          <div className="overflow-x-auto rounded-2xl border border-line bg-card">
            <table className="w-full text-start text-body-sm">
              <thead>
                <tr className="border-b border-line text-overline uppercase text-faint">
                  <th className="p-4 text-start">Token</th>
                  <th className="p-4 text-start">Sample</th>
                  <th className="p-4 text-start">On card</th>
                  <th className="p-4 text-start">On canvas</th>
                </tr>
              </thead>
              <tbody>
                {semantic.map(({ name, label, role }) => {
                  const t = readToken(name);
                  const large = role === 'large';
                  return (
                    <tr key={name} className="border-b border-line last:border-0">
                      <td className="p-4">
                        <code className="text-caption text-muted">{name}</code>
                      </td>
                      <td className="p-4">
                        <span style={{ color: rgbOf(t) }} className="font-bold">
                          {label}
                        </span>
                      </td>
                      <td className="p-4">
                        <ContrastBadge ratio={contrast(t, card)} large={large} />
                      </td>
                      <td className="p-4">
                        <ContrastBadge ratio={contrast(t, canvas)} large={large} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* -- Surfaces -- */}
        <Section title="Surfaces" note="Theme-aware. These flip wholesale between light and berry-dark.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {surfaces.map((name) => {
              const t = readToken(name);
              return (
                <div key={name} className="rounded-xl border border-line p-4 shadow-e1" style={{ background: rgbOf(t) }}>
                  <code className="text-caption text-ink">{name}</code>
                  <div className="mt-6 text-caption text-muted">{rgbOf(t)}</div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* -- Gradients: the important finding -- */}
        <Section
          title="Gradients — and one contrast trap"
          note="The decorative brand gradient is beautiful and it CANNOT carry white text: white on its lightest stop measures 2.06:1, less than half the AA floor. The CTA gradient exists so buttons stay on-brand and still clear AA at every stop (4.50 / 5.27 / 6.91)."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-rose-gradient p-6 shadow-e3">
              <div className="flex items-center justify-between">
                <code className="text-caption text-white/90">--gradient-brand</code>
                <ContrastBadge ratio={contrast(white, readToken('--brand-300'))} />
              </div>
              <p className="mt-8 text-h4 text-white">White text at the light end</p>
              <p className="mt-1 text-body-sm text-white/90">
                Decorative only — marks, hero shapes, fills. Never white body text.
              </p>
            </div>
            <div className="rounded-2xl bg-brand-cta p-6 shadow-e3">
              <div className="flex items-center justify-between">
                <code className="text-caption text-white/90">--gradient-cta</code>
                <ContrastBadge ratio={contrast(white, readToken('--brand-500'))} />
              </div>
              <p className="mt-8 text-h4 text-white">White text, legal at every stop</p>
              <p className="mt-1 text-body-sm text-white/90">This is what primary buttons should use.</p>
            </div>
          </div>
        </Section>

        {/* -- Type scale -- */}
        <Section
          title="Type scale"
          note="Fluid clamp() steps. Plus Jakarta Sans for Latin, IBM Plex Sans Arabic for Darija, Fraunces reserved for one editorial accent per page."
        >
          <div className="space-y-6 rounded-2xl border border-line bg-card p-8">
            {TYPE_SAMPLES.map(({ cls, token, sample, body }) => (
              <div key={token} className="flex flex-col gap-1 border-b border-line pb-5 last:border-0 last:pb-0">
                <code className="text-overline uppercase text-faint">text-{token}</code>
                <p className={cn(cls, body ? 'text-muted' : 'text-ink')}>{sample}</p>
              </div>
            ))}

            <div className="rounded-xl bg-sunken p-6">
              <code className="text-overline uppercase text-faint">Arabic / Darija — font-arabic</code>
              <p dir="rtl" className="mt-3 font-arabic text-h2 text-ink">
                صحّتك — رفيقتك الرقمية
              </p>
              <p dir="rtl" className="mt-2 font-arabic text-body-lg text-muted">
                صحّتك كتعاونك تعرفي التغييرات بدري، بلغتك، وفخصوصية تامة.
              </p>
            </div>

            <div className="rounded-xl bg-sunken p-6">
              <code className="text-overline uppercase text-faint">font-serif — Fraunces, one accent per page</code>
              <p className="mt-3 font-serif text-h2 text-ink">Early is everything.</p>
            </div>
          </div>
        </Section>

        {/* -- Buttons -- */}
        <Section title="Buttons" note="Existing Button component, now resolving through tokens. Pill radius, soft press.">
          <div className="rounded-2xl border border-line bg-card p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Button rightIcon={<ArrowRight size={18} />}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg" leftIcon={<Bell size={18} />}>
                Large
              </Button>
            </div>
            <div className="mt-8 rounded-xl bg-calm-soft p-4">
              <p className="text-body-sm text-calm-text">
                <strong>Shipped:</strong> the primary button now uses <code>bg-brand-cta</code>. Every surface in the app
                that carries white text or a white glyph moved with it — nothing renders white on the decorative
                gradient any more.
              </p>
            </div>
          </div>
        </Section>

        {/* -- Glass + glow -- */}
        <Section
          title="Glass, glow, and the soft gradient"
          note="Glass is selective: one panel per view, never stacked. Text on glass always uses ink/muted — never faint."
        >
          <div className="relative overflow-hidden rounded-3xl bg-rose-gradient p-10">
            <ZelligeAccent variant="field" tone="current" opacity={0.07} className="text-white" />
            <div className="relative grid gap-6 md:grid-cols-2">
              <div className="glass-panel p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-cta text-white shadow-e2">
                    <Sparkles size={20} />
                  </span>
                  <div>
                    <h3 className="text-h4 text-ink">Glass panel</h3>
                    <p className="text-caption text-muted">.glass-panel</p>
                  </div>
                </div>
                <p className="mt-4 text-body-sm text-muted">
                  Frosted surface, soft radius, elevation 3. Degrades to a near-opaque card where backdrop-filter is
                  unsupported.
                </p>
                <div className="mt-5 flex gap-2">
                  <span className="rounded-pill bg-calm-soft px-3 py-1 text-caption font-bold text-calm-text">
                    <Check size={12} className="inline" /> Readable
                  </span>
                  <span className="rounded-pill bg-accent-soft px-3 py-1 text-caption font-bold text-accent-text">
                    On brand
                  </span>
                </div>
              </div>

              <div className="glow-brand rounded-2xl bg-card p-6">
                <h3 className="text-h4 text-ink">Glow</h3>
                <p className="mt-2 text-body-sm text-muted">
                  <code>.glow-brand</code> — a soft bloom for a single focal element. Never a neon ring.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-pill bg-calm shadow-glow-calm" />
                  <span className="text-caption text-muted">.shadow-glow-calm</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* -- Elevation + radii -- */}
        <Section title="Elevation & radii" note="Pink-tinted shadows in light, true depth in dark. Nothing sharp.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ELEVATIONS.map(({ cls, label }) => (
              <div key={cls} className={cn('rounded-2xl bg-card p-6', cls)}>
                <code className="text-caption text-muted">{label}</code>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {RADII.map(({ cls, label }) => (
              <div
                key={cls}
                className={cn('grid h-20 w-24 place-items-center border border-line bg-card shadow-e1', cls)}
              >
                <code className="text-caption text-muted">{label}</code>
              </div>
            ))}
          </div>
        </Section>

        {/* -- Zellige -- */}
        <Section
          title="Moroccan accent — the khatam"
          note="The eight-point star, built from two overlapping squares the way real zellige is. Accent, never theme: a corner, a divider, a whisper behind a hero."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-card p-6">
              <ZelligeAccent variant="corner" tone="gold" size={72} className="absolute end-0 top-0" />
              <h3 className="text-h4 text-ink">Corner</h3>
              <p className="mt-2 text-body-sm text-muted">A quarter rosette, tucked into a card corner.</p>
            </div>
            <div className="grid place-items-center rounded-2xl border border-line bg-card p-6">
              <ZelligeAccent variant="seal" tone="gold" size={88} opacity={0.5} />
              <p className="mt-3 text-caption text-muted">Seal — a section mark</p>
            </div>
            <div className="flex flex-col justify-center rounded-2xl border border-line bg-card p-6">
              <p className="text-center text-caption text-muted">Divider</p>
              <ZelligeAccent variant="divider" tone="gold" opacity={0.55} className="my-3" />
              <p className="text-center text-caption text-muted">between sections</p>
            </div>
          </div>
        </Section>

        {/* -- Component library -- */}
        <Section
          title="Component library"
          note="The primitives pages compose from. Every interactive element has a ≥44px target, a visible focus ring, and a screen-reader name."
        >
          <div className="space-y-8">
            <div>
              <code className="text-overline uppercase text-faint">SectionHeading</code>
              <div className="mt-3 rounded-2xl border border-line bg-card p-6">
                <SectionHeading
                  as="h3"
                  size="h2"
                  eyebrow="Learn"
                  title="Know what matters"
                  subtitle="Five quiet minutes, once a month — that is the whole habit."
                  accent
                />
              </div>
            </div>

            <div>
              <code className="text-overline uppercase text-faint">IconCard</code>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <IconCard icon={HeartPulse} title="Self-check" description="Five guided minutes." tone="brand" />
                <IconCard icon={Gauge} title="Risk factors" description="Awareness, not a verdict." tone="calm" />
                <IconCard icon={Bot} title="Ask Sahtek" description="In Darija, any time." tone="info" />
                <IconCard icon={Bell} title="Reminders" description="A monthly nudge." tone="gold" />
              </div>
            </div>

            <div>
              <code className="text-overline uppercase text-faint">TrustPill</code>
              <div className="mt-3 flex flex-wrap gap-2 rounded-2xl border border-line bg-card p-6">
                <TrustPill icon={LockKeyhole} tone="calm">
                  Stays on your device
                </TrustPill>
                <TrustPill tone="brand">No account needed</TrustPill>
                <TrustPill tone="gold">Free</TrustPill>
                <TrustPill tone="neutral">Darija, French, English</TrustPill>
              </div>
            </div>

            <div>
              <code className="text-overline uppercase text-faint">Accordion</code>
              <div className="mt-3">
                <Accordion
                  headingLevel="h4"
                  items={[
                    {
                      id: 'lump',
                      question: 'Does a lump always mean cancer?',
                      answer: 'No. Most lumps turn out to be benign — but any new change deserves a doctor’s look.',
                    },
                    {
                      id: 'when',
                      question: 'When should I do a self-check?',
                      answer: 'A few days after your period ends, when the tissue is least tender.',
                    },
                    {
                      id: 'private',
                      question: 'Does Sahtek store my answers?',
                      answer: 'They stay on your device. No account, no tracking.',
                    },
                  ]}
                />
              </div>
            </div>

            <div>
              <code className="text-overline uppercase text-faint">SafetyNote — four variants</code>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Disclaimer full withTitle />
                <SafetyNote variant="privacy" title="Private by default">
                  Your answers never leave this device.
                </SafetyNote>
                <SafetyNote variant="care" title="You are not alone">
                  Feeling anxious is normal. Take it one step at a time.
                </SafetyNote>
                <SafetyNote variant="seeDoctor" title="Worth a visit">
                  Noticed a change? Book a consultation — calm, not alarmed.
                </SafetyNote>
              </div>
            </div>

            <div>
              <code className="text-overline uppercase text-faint">PhoneMockup + GlassCard</code>
              <div className="mt-3 grid items-center gap-8 rounded-3xl bg-brand-cta p-8 md:grid-cols-2">
                <PhoneMockup glow>
                  <div className="flex h-full flex-col gap-3 p-5">
                    <div className="h-3 w-20 rounded-pill bg-primary-200" />
                    <div className="h-8 w-40 rounded-lg bg-primary-100" />
                    <GlassCard tone="strong" className="mt-2">
                      <p className="text-caption font-bold text-ink">Step 1 of 5</p>
                      <p className="mt-1 text-body-sm text-muted">Look in the mirror.</p>
                    </GlassCard>
                    <div className="mt-auto h-11 rounded-pill bg-brand-cta" />
                  </div>
                </PhoneMockup>

                <GlassCard tone="strong">
                  <h3 className="text-h4 text-ink">GlassCard</h3>
                  <p className="mt-2 text-body-sm text-muted">
                    Selective, never stacked. Over a gradient it steps up to <code>tone=&quot;strong&quot;</code> so text
                    stays legible.
                  </p>
                </GlassCard>
              </div>
            </div>
          </div>
        </Section>

        <div className="hairline mt-16" />
        <p className="py-8 text-center text-caption text-faint">
          Sahtek.tech — tokens live in src/styles/tokens.css · surfaced by tailwind.config.js
        </p>
      </div>
    </div>
  );
}
