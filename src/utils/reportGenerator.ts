import { jsPDF } from 'jspdf';

// ════════════════════════════════════════════════════════════════════
//  Risk-assessment report export (branded PDF + JSON).
//  Both functions receive `lang` and use it for ALL labels AND content,
//  so the report always matches the language the user is in when they
//  click download. JSON is correct for all 7 languages; the PDF uses
//  jsPDF's built-in Latin fonts, which cannot render Arabic/Cyrillic
//  glyphs — for ar/ru the branded layout is intact but script text may
//  show as boxes (a known jsPDF limitation). JSON always works perfectly.
// ════════════════════════════════════════════════════════════════════

export interface RiskReportData {
  riskLevel: string;
  riskScore: number;
  maxScore: number;
  riskPercentage: number;
  summary: string;
  recommendations: string[];
  riskFactors: string[];
  protectiveFactors: string[];
}

const RL: Record<string, Record<string, string>> = {
  title: { ar: 'تقرير تقييم مخاطر سرطان الثدي', fr: "Rapport d'évaluation du risque de cancer du sein", en: 'Breast Cancer Risk Assessment Report', es: 'Informe de evaluación de riesgo de cáncer de mama', de: 'Brustkrebs-Risikobewertungsbericht', ru: 'Отчёт об оценке риска рака груди', pt: 'Relatório de avaliação de risco de câncer de mama' },
  date: { ar: 'التاريخ', fr: 'Date', en: 'Date', es: 'Fecha', de: 'Datum', ru: 'Дата', pt: 'Data' },
  riskLevel: { ar: 'مستوى المخاطر', fr: 'Niveau de risque', en: 'Risk Level', es: 'Nivel de riesgo', de: 'Risikostufe', ru: 'Уровень риска', pt: 'Nível de risco' },
  summary: { ar: 'الملخص', fr: 'Résumé', en: 'Summary', es: 'Resumen', de: 'Zusammenfassung', ru: 'Итог', pt: 'Resumo' },
  recommendations: { ar: 'التوصيات', fr: 'Recommandations', en: 'Recommendations', es: 'Recomendaciones', de: 'Empfehlungen', ru: 'Рекомендации', pt: 'Recomendações' },
  riskFactors: { ar: 'عوامل الخطر', fr: 'Facteurs de risque', en: 'Risk Factors', es: 'Factores de riesgo', de: 'Risikofaktoren', ru: 'Факторы риска', pt: 'Fatores de risco' },
  protectiveFactors: { ar: 'العوامل الوقائية', fr: 'Facteurs protecteurs', en: 'Protective Factors', es: 'Factores protectores', de: 'Schutzfaktoren', ru: 'Защитные факторы', pt: 'Fatores protetores' },
  low: { ar: 'منخفض', fr: 'Faible', en: 'Low', es: 'Bajo', de: 'Niedrig', ru: 'Низкий', pt: 'Baixo' },
  moderate: { ar: 'متوسط', fr: 'Modéré', en: 'Moderate', es: 'Moderado', de: 'Mäßig', ru: 'Умеренный', pt: 'Moderado' },
  high: { ar: 'مرتفع', fr: 'Élevé', en: 'High', es: 'Alto', de: 'Hoch', ru: 'Высокий', pt: 'Alto' },
  disclaimer: { ar: 'هذا التقرير للتوعية فقط وليس تشخيصاً طبياً. استشيري طبيبك دائماً.', fr: 'Ce rapport est informatif uniquement, pas un diagnostic médical. Consultez toujours votre médecin.', en: 'This report is for awareness only, not a medical diagnosis. Always consult your doctor.', es: 'Este informe es solo informativo, no un diagnóstico médico. Consulte siempre a su médico.', de: 'Dieser Bericht dient nur zur Information, keine medizinische Diagnose. Konsultieren Sie immer Ihren Arzt.', ru: 'Этот отчёт только для информирования, не медицинский диагноз. Всегда консультируйтесь с врачом.', pt: 'Este relatório é apenas informativo, não um diagnóstico médico. Consulte sempre o seu médico.' },
};

function L(key: string, lang: string): string {
  return RL[key]?.[lang] || RL[key]?.en || key;
}

const RISK_RGB: Record<string, [number, number, number]> = {
  low: [22, 163, 74],
  moderate: [217, 119, 6],
  high: [220, 38, 38],
};

// ── JSON (all 7 languages, always correct) ──────────────────────────────
export function downloadJSON(data: RiskReportData, lang: string) {
  const report = {
    [L('title', lang)]: true,
    language: lang,
    [L('date', lang)]: new Date().toLocaleDateString(),
    [L('riskLevel', lang)]: `${L(data.riskLevel, lang)} (${data.riskPercentage}%)`,
    [L('summary', lang)]: data.summary,
    [L('recommendations', lang)]: data.recommendations,
    [L('riskFactors', lang)]: data.riskFactors,
    [L('protectiveFactors', lang)]: data.protectiveFactors,
    disclaimer: L('disclaimer', lang),
    source: 'sahtek.tech',
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sahtek-report-${lang}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── PDF (branded, professional) ─────────────────────────────────────────
export function downloadPDF(data: RiskReportData, lang: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210,
    M = 20;
  let y = 0;
  const rc = RISK_RGB[data.riskLevel] || RISK_RGB.moderate;

  // Header band
  doc.setFillColor(214, 51, 132);
  doc.rect(0, 0, W, 45, 'F');
  // Logo circle with monogram
  doc.setFillColor(255, 255, 255);
  doc.circle(M + 8, 22, 8, 'F');
  doc.setTextColor(214, 51, 132);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('S', M + 5, 26);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Sahtek', M + 22, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Breast Cancer Awareness', M + 22, 28);
  doc.setFontSize(8);
  doc.text('sahtek.tech', M + 22, 35);

  // Title
  y = 58;
  doc.setTextColor(45, 31, 45);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(L('title', lang), W - M * 2);
  doc.text(titleLines, W / 2, y, { align: 'center' });
  y += titleLines.length * 7;

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text(`${L('date', lang)}: ${new Date().toLocaleDateString()}`, W / 2, y, { align: 'center' });

  // Risk box
  y += 10;
  doc.setFillColor(rc[0], rc[1], rc[2]);
  doc.roundedRect(M, y, W - M * 2, 24, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(L('riskLevel', lang), W / 2, y + 8, { align: 'center' });
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text(`${L(data.riskLevel, lang)}  •  ${data.riskPercentage}%`, W / 2, y + 18, { align: 'center' });

  // Summary
  y += 34;
  doc.setTextColor(214, 51, 132);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(L('summary', lang), M, y);
  y += 7;
  doc.setTextColor(70, 70, 70);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const sLines = doc.splitTextToSize(data.summary || '', W - M * 2);
  doc.text(sLines, M, y);
  y += sLines.length * 5 + 6;

  // Recommendations
  if (data.recommendations?.length) {
    doc.setTextColor(214, 51, 132);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(L('recommendations', lang), M, y);
    y += 7;
    doc.setTextColor(70, 70, 70);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.recommendations.forEach((r) => {
      const lines = doc.splitTextToSize(`•  ${r}`, W - M * 2);
      doc.text(lines, M, y);
      y += lines.length * 5 + 2;
    });
    y += 5;
  }

  // Risk factors
  if (data.riskFactors?.length) {
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(L('riskFactors', lang), M, y);
    y += 6;
    doc.setTextColor(70, 70, 70);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    data.riskFactors.forEach((f) => {
      doc.text(`—  ${f}`, M + 2, y);
      y += 5;
    });
    y += 4;
  }

  // Protective factors
  if (data.protectiveFactors?.length) {
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(L('protectiveFactors', lang), M, y);
    y += 6;
    doc.setTextColor(70, 70, 70);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    data.protectiveFactors.forEach((f) => {
      doc.text(`+  ${f}`, M + 2, y);
      y += 5;
    });
  }

  // Footer
  const fy = 278;
  doc.setDrawColor(255, 208, 232);
  doc.setLineWidth(0.5);
  doc.line(M, fy - 6, W - M, fy - 6);
  doc.setTextColor(140, 140, 140);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const dLines = doc.splitTextToSize(L('disclaimer', lang), W - M * 2);
  doc.text(dLines, W / 2, fy, { align: 'center' });

  doc.save(`sahtek-report-${lang}-${Date.now()}.pdf`);
}
