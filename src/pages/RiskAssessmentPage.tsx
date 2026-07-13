import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, FileText, Gauge, MapPin, Share2 } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { useLanguage, interpolate } from '@/hooks/useLanguage';
import { useRiskAssessment } from '@/hooks/useRiskAssessment';
import type { RiskReportData } from '@/utils/reportGenerator';
import { cn } from '@/utils/cn';

// Download button labels per language — never hardcode a single locale.
const DOWNLOAD_LABELS = {
  downloadPdf: {
    ar: 'تحميل PDF', fr: 'Télécharger PDF', en: 'Download PDF',
    es: 'Descargar PDF', de: 'PDF herunterladen', ru: 'Скачать PDF', pt: 'Baixar PDF',
  },
  downloadJson: {
    ar: 'تحميل JSON', fr: 'Télécharger JSON', en: 'Download JSON',
    es: 'Descargar JSON', de: 'JSON herunterladen', ru: 'Скачать JSON', pt: 'Baixar JSON',
  },
  shareDoctor: {
    ar: 'شاركي مع طبيبك', fr: 'Partager avec votre médecin', en: 'Share with your doctor',
    es: 'Compartir con su médico', de: 'Mit Ihrem Arzt teilen', ru: 'Поделиться с врачом', pt: 'Compartilhar com médico',
  },
} as const;

export function RiskAssessmentPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const risk = useRiskAssessment();
  const [copied, setCopied] = useState(false);
  const pct = risk.result?.risk_percentage ?? 0;
  const levelLabel = risk.result?.risk_level === 'high' ? t.risk.levelHigh : risk.result?.risk_level === 'moderate' ? t.risk.levelModerate : t.risk.levelLow;

  // The score, the summary and the recommendations are all computed LOCALLY
  // (see services/riskService.ts). Her answers never leave the device.
  //
  // This page used to POST the full questionnaire — `JSON.stringify(answers)` —
  // to a third-party LLM the instant this screen rendered, with no prompt and
  // no way to refuse. That is gone. If a personalised AI summary comes back
  // later via the backend proxy, it must be an explicit opt-in: she sees the
  // complete local result first, and nothing is sent unless she asks for it.
  const summaryText = risk.result?.summary || t.disclaimer.short;
  const recommendations = [t.selfCheck.logBtn, t.learn.whenToSee, t.reminder.confirmBtn, t.home.ctaSecondary];

  const copy = async () => {
    if (!risk.result) return;
    await navigator.clipboard?.writeText(`${t.risk.yourScore}: ${pct}% - ${levelLabel}. ${t.disclaimer.short}`);
    setCopied(true);
  };

  // Build the report from the current result. The content is already localized
  // by the risk engine (it runs in the active language), and the report labels
  // come from `lang` too — so PDF/JSON always match the current app language.
  const reportData: RiskReportData | null = risk.result
    ? {
        riskLevel: risk.result.risk_level,
        riskScore: risk.result.risk_score,
        maxScore: risk.result.max_score,
        riskPercentage: risk.result.risk_percentage,
        summary: risk.result.summary,
        recommendations: risk.result.recommendations.map((r) => r.action),
        riskFactors: risk.result.risk_factors_identified,
        protectiveFactors: risk.result.protective_factors_identified,
      }
    : null;

  return (
    <PageTransition>
      {risk.stage === 'intro' && (
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-card/85 p-6 shadow-petal-xl">
          <Gauge className="text-primary-500" size={42} />
          <h1 className="mt-4 text-4xl font-black text-ink">{t.risk.title}</h1>
          <p className="mt-3 text-lg font-medium leading-8 text-muted">{t.risk.subtitle}</p>
          <p className="mt-5 rounded-3xl bg-primary-50 p-5 font-bold leading-7 text-primary-800">{t.risk.intro}</p>
          <Button className="mt-6" size="lg" fullWidth onClick={risk.start}>{t.risk.startBtn}</Button>
        </section>
      )}

      {risk.stage === 'quiz' && risk.current && (
        <section className="mx-auto max-w-2xl">
          <div className="mb-4 h-3 overflow-hidden rounded-full bg-primary-100">
            <motion.div className="h-full bg-rose-gradient" animate={{ width: `${((risk.index + 1) / risk.total) * 100}%` }} />
          </div>
          <motion.div key={risk.current.id} initial={{ opacity: 0, x: 20 * risk.direction }} animate={{ opacity: 1, x: 0 }} className="rounded-[2rem] border border-white/70 bg-card/85 p-6 shadow-petal-xl">
            <p className="font-black text-primary-700">{interpolate(t.risk.questionOf, { n: risk.index + 1, total: risk.total })}</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-ink">{risk.current.question}</h1>
            {risk.current.hint && <p className="mt-2 font-medium text-muted">{risk.current.hint}</p>}
            <div className="mt-6 grid gap-3">
              {risk.current.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => risk.choose(option.value)}
                  className={cn('flex min-h-16 items-center justify-between rounded-2xl border p-4 text-start text-base font-black transition', risk.selected === option.value ? 'border-primary-400 bg-primary-50 text-primary-800 shadow-glow' : 'border-line bg-white/55 text-ink')}
                >
                  {option.label}
                  {risk.selected === option.value && <CheckCircle2 className="text-primary-500" />}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="secondary" disabled={risk.index === 0} onClick={risk.back}>{t.common.back}</Button>
              <Button disabled={!risk.selected} onClick={risk.next}>{risk.isLast ? t.common.finish : t.common.next}</Button>
            </div>
          </motion.div>
        </section>
      )}

      {risk.stage === 'analyzing' && (
        <section className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-card/85 p-8 text-center shadow-petal-xl">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />
          <h1 className="mt-5 text-2xl font-black text-ink">{t.risk.analyzing}</h1>
        </section>
      )}

      {risk.stage === 'result' && risk.result && (
        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-white/70 bg-card/85 p-6 text-center shadow-petal-xl">
            <div className="relative mx-auto h-48 w-48">
              <svg className="-rotate-90" width="192" height="192">
                <circle cx="96" cy="96" r="78" fill="none" stroke="rgba(214,51,132,0.12)" strokeWidth="18" />
                <motion.circle cx="96" cy="96" r="78" fill="none" stroke="#D63384" strokeWidth="18" strokeLinecap="round" strokeDasharray={490} initial={{ strokeDashoffset: 490 }} animate={{ strokeDashoffset: 490 - (490 * pct) / 100 }} />
              </svg>
              <div className="absolute inset-0 grid place-items-center"><span className="text-5xl font-black text-ink">{pct}%</span></div>
            </div>
            <p className="mt-2 text-sm font-black text-muted">{t.risk.riskLevelLabel}</p>
            <h2 className="text-3xl font-black text-gradient">{levelLabel}</h2>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-card/85 p-6 shadow-petal-xl">
            <h1 className="text-3xl font-black text-ink">{t.risk.summary}</h1>
            <p className="mt-3 font-medium leading-7 text-muted">{summaryText}</p>
            <div className="mt-5 grid gap-3">
              {recommendations.map((action, index) => (
                <div key={action} className="rounded-2xl bg-primary-50 p-4">
                  <p className="text-xs font-black uppercase text-primary-700">{index === 0 ? t.risk.priorityHigh : t.risk.priorityMedium}</p>
                  <p className="mt-1 font-bold text-ink">{action}</p>
                </div>
              ))}
            </div>
            {(risk.result.risk_level === 'high' || risk.result.risk_level === 'moderate') && (
              <div className="mt-5 rounded-2xl border border-primary-200 bg-rose-soft p-4">
                <p className="font-black text-primary-800">{t.risk.doctorsCtaTitle}</p>
                <Button
                  className="mt-3"
                  fullWidth
                  onClick={() => navigate('/doctors')}
                  leftIcon={<MapPin size={18} />}
                >
                  {t.risk.doctorsCtaBtn}
                </Button>
              </div>
            )}
            <p className="mt-5 rounded-2xl bg-white/60 p-4 text-sm font-bold leading-6 text-muted">{t.disclaimer.short}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button onClick={copy} leftIcon={<Share2 size={18} />}>{copied ? t.risk.shared : t.risk.shareBtn}</Button>
              <Button
                onClick={async () => {
                  if (!reportData) return;
                  // Lazy-load jsPDF so it only ships when a report is downloaded.
                  const { downloadPDF } = await import('@/utils/reportGenerator');
                  downloadPDF(reportData, lang);
                }}
                leftIcon={<FileText size={18} />}
              >
                {DOWNLOAD_LABELS.downloadPdf[lang] || DOWNLOAD_LABELS.downloadPdf.en}
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  if (!reportData) return;
                  const { downloadJSON } = await import('@/utils/reportGenerator');
                  downloadJSON(reportData, lang);
                }}
                leftIcon={<Download size={18} />}
              >
                {DOWNLOAD_LABELS.downloadJson[lang] || DOWNLOAD_LABELS.downloadJson.en}
              </Button>
              <Button variant="secondary" onClick={risk.restart}>{t.risk.retakeBtn}</Button>
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
