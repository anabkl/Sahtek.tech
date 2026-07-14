import { motion } from 'framer-motion';
import { BookOpenCheck, ExternalLink, LockKeyhole, Languages, ShieldCheck, type LucideIcon } from 'lucide-react';
import { BrandImage } from '@/components/ui/BrandImage';
import { SafetyNote } from '@/components/ui/SafetyNote';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EVIDENCE_SOURCES, MEDICAL_REVIEW } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { VIEWPORT, staggerContainer, staggerItem } from '@/motion/motion';

/* In the order of `home.credibility.points`. */
const POINT_ICONS: LucideIcon[] = [ShieldCheck, LockKeyhole, Languages];

/**
 * Credibility — earned, not decorated.
 *
 * There are no testimonials here and no clinician photos, because we have
 * neither. What we do have is a method, and the method is checkable: every
 * claim in `points` is enforced somewhere in this codebase (no diagnosis
 * copy, no analytics bundle, Darija authored first).
 *
 * The medical-review credit and the source list render ONLY when
 * `MEDICAL_REVIEW` / `EVIDENCE_SOURCES` are filled in — the same convention the
 * Footer uses for social links. Both are empty today, so neither block ships.
 * That is the point: an unearned "expert-reviewed" badge is worse than no badge
 * at all, because the woman reading it is deciding whether to trust us with
 * something she is frightened of.
 */
export function Credibility() {
  const { t } = useLanguage();
  const section = t.home.credibility;

  return (
    <section className="py-12">
      <SectionHeading
        as="h2"
        size="h2"
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={section.subtitle}
        accent
      />

      <motion.ul
        className="mt-10 grid gap-4 sm:grid-cols-3"
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
      >
        {section.points.map((point, i) => {
          const Icon = POINT_ICONS[i] ?? ShieldCheck;
          return (
            <motion.li
              key={point.title}
              variants={staggerItem}
              className="rounded-3xl border border-line bg-card p-5 shadow-petal"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent-text">
                <Icon size={20} aria-hidden />
              </span>
              <h3 className="mt-4 text-h4 text-ink">{point.title}</h3>
              <p className="mt-1.5 text-body-sm text-muted">{point.desc}</p>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* The method. This is the "how it is made" block — it is the honest
          version of an expert badge, and every line of it is true today. */}
      <div className="mt-6 rounded-3xl border border-line bg-sunken p-6">
        <h3 className="flex items-center gap-2 text-h4 text-ink">
          <BookOpenCheck size={20} className="text-accent-text" aria-hidden />
          {section.methodTitle}
        </h3>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <ul className="grid gap-2.5">
            {section.method.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5 text-body-sm text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                {rule}
              </li>
            ))}
          </ul>

          {/* The methodology preview. A diagram of how the words get made —
              not a badge, and not a stock photo of a doctor. */}
          <div className="overflow-hidden rounded-2xl border border-line">
            <BrandImage name="method-flow" alt={section.methodImageAlt} width={960} height={720} />
          </div>
        </div>

        {/* The review block.
         *
         * It used to render NOTHING when unconfigured — which is worse than it
         * sounds. A page that talks at length about its editorial method and
         * then says nothing about review lets a reader assume review happened.
         * Silence is not honesty; it is just a quieter claim.
         *
         * So the block is always present, and it states the truth either way:
         * the reviewer's name when there is one, and plainly "not yet reviewed"
         * when there is not. Nobody has to trust us about which — they can read
         * which one it says. */}
        <div className="mt-6 border-t border-line pt-5">
          <h4 className="text-overline uppercase text-accent-text">{section.reviewTitle}</h4>

          {MEDICAL_REVIEW ? (
            <>
              <p className="mt-1.5 text-body-sm text-ink">
                {MEDICAL_REVIEW.name} — {MEDICAL_REVIEW.credential}
              </p>
              <p className="text-caption text-muted">{MEDICAL_REVIEW.reviewedOn}</p>
            </>
          ) : (
            <SafetyNote variant="medical" title={section.reviewPendingTitle} className="mt-2">
              {section.reviewPendingBody}
            </SafetyNote>
          )}
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <h4 className="text-overline uppercase text-accent-text">{section.sourcesTitle}</h4>

          {EVIDENCE_SOURCES.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {EVIDENCE_SOURCES.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-pill border border-line bg-card px-3.5 text-caption font-bold text-muted transition hover:text-accent-text"
                  >
                    {source.label}
                    <ExternalLink size={12} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-body-sm text-muted">{section.sourcesPending}</p>
          )}
        </div>
      </div>
    </section>
  );
}
