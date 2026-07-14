/**
 * Brand asset generator.
 *
 * Every symbolic illustration in the product is GEOMETRY, so it is authored here
 * as SVG and rendered to AVIF/WebP/PNG — not commissioned, not stock, not a
 * placeholder waiting on someone.
 *
 * THE VOCABULARY (CLAUDE.md §4.4, HARD RULES 3-6):
 *   - Soft ceramic forms: a closed polar curve r(θ) = R·(1 + a·cos(kθ + φ)),
 *     the same maths as <PetalMark/>, so an illustration and a card are visibly
 *     the same object.
 *   - Khatam (eight-point star) line work, always faint.
 *   - Rose/berry gradients, gold hairlines, a teal accent for calm.
 *
 * WHAT IS FORBIDDEN HERE, AND WHY:
 *   - No anatomy, no clinical imagery, no distressed faces (rules 3 & 4).
 *   - No human figures at all: an illustrated woman is a specific woman, and the
 *     one thing we cannot draw is "every woman in Morocco". Symbols include her;
 *     a drawing of somebody else does not.
 *   - NO GRID OF TWELVE FRUITS. Peaches and apricots are allowed as ornament —
 *     a single still-life, a lone form — but the moment twelve of them are laid
 *     out in a grid each carrying a sign, we have rebuilt the awareness layout
 *     HARD RULE 6 exists to keep us away from. The twelve signs are ceramic.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'assets');
const OG = join(ROOT, 'public', 'og');

/* ── Brand tokens (mirrors src/styles/tokens.css) ────────────────────────── */
const C = {
  wash: '#FFF7FA',
  blush: '#FFF0F6',
  petal: '#FFE0EC',
  rose: '#FFC2D9',
  pink: '#FF94BA',
  brand: '#D63384',
  berry: '#8C1A55',
  ink: '#2D1F2D',
  gold: '#E0A458',
  teal: '#14B8A6',
  white: '#FFFFFF',
};

/* ── The ceramic form: identical maths to <PetalMark/> ───────────────────── */
function ceramic(cx, cy, radius, variant) {
  const lobes = 3 + (variant % 4);
  const amp = 0.05 + (variant % 3) * 0.022;
  const phase = variant * 0.9;
  const steps = 120;
  const pts = Array.from({ length: steps }, (_, i) => {
    const th = (i / steps) * Math.PI * 2;
    const r = radius * (1 + amp * Math.cos(lobes * th + phase));
    return `${(cx + r * Math.cos(th)).toFixed(2)},${(cy + r * Math.sin(th)).toFixed(2)}`;
  });
  return `M${pts.join('L')}Z`;
}

/** The khatam — two overlapping squares, the way the tilework actually is. */
function khatam(cx, cy, outer) {
  const inner = outer * 0.7654;
  return Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}

const defs = `
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.wash}"/>
      <stop offset="1" stop-color="${C.petal}"/>
    </linearGradient>
    <linearGradient id="clay" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="${C.petal}"/>
      <stop offset="1" stop-color="${C.rose}"/>
    </linearGradient>
    <linearGradient id="clayDeep" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="${C.rose}"/>
      <stop offset="1" stop-color="${C.pink}"/>
    </linearGradient>
    <linearGradient id="cta" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.brand}"/>
      <stop offset="1" stop-color="${C.berry}"/>
    </linearGradient>
    <!-- A whisper of light, not a 3D render. A strong radial highlight makes a
         soft pink curve read as a body; at 0.18 it reads as glazed clay. -->
    <radialGradient id="glaze" cx="0.34" cy="0.28" r="0.5">
      <stop offset="0" stop-color="#fff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bloom" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${C.pink}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${C.pink}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="zellige" width="72" height="72" patternUnits="userSpaceOnUse">
      <polygon points="${khatam(36, 36, 19)}" fill="none" stroke="${C.brand}" stroke-width="1" opacity="0.07"/>
      <polygon points="${khatam(0, 0, 9)}" fill="none" stroke="${C.brand}" stroke-width="0.75" opacity="0.05"/>
      <polygon points="${khatam(72, 72, 9)}" fill="none" stroke="${C.brand}" stroke-width="0.75" opacity="0.05"/>
    </pattern>
  </defs>`;

/** A ceramic vessel with its glaze highlight — the atom of every scene. */
const vessel = (cx, cy, r, variant, fill = 'url(#clay)') => `
    <path d="${ceramic(cx, cy, r, variant)}" fill="${fill}" stroke="${C.brand}" stroke-width="${Math.max(1.5, r * 0.018)}" stroke-opacity="0.28"/>
    <path d="${ceramic(cx, cy, r, variant)}" fill="url(#glaze)"/>`;

const ground = (w, h) => `
    <rect width="${w}" height="${h}" fill="url(#ground)"/>
    <rect width="${w}" height="${h}" fill="url(#zellige)"/>
    <ellipse cx="${w * 0.22}" cy="${h * 0.2}" rx="${w * 0.34}" ry="${h * 0.42}" fill="url(#bloom)"/>`;

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">${defs}${ground(w, h)}${body}</svg>`;

/* ── 1. The twelve individual sign compositions (1200 x 900) ─────────────── */
function signScene(i) {
  const w = 1200;
  const h = 900;

  /* A curated tray, deliberately NOT one big centred form.
   *
   * The first version WAS one big centred form, and on screen a large soft
   * glazed pink shape in a breast-health app reads as a breast — exactly what
   * HARD RULES 3 and 4 forbid. Scale and singularity were doing that, not the
   * curve itself. Six small vessels on a shelf cannot be mistaken for a body:
   * they are objects, and objects at that size read as objects.
   *
   * The sign's own form (variant i) is the one lifted forward and ringed in
   * gold. The rest are its siblings — the set, present behind it. */
  const shelfY = h * 0.62;
  const slots = [
    { x: 190, r: 58, v: i + 4 },
    { x: 360, r: 74, v: i + 8 },
    { x: 540, r: 62, v: i + 2 },
    { x: 830, r: 66, v: i + 6 },
    { x: 1010, r: 54, v: i + 10 },
  ];

  const siblings = slots
    .map((s) => `<g opacity="0.5">${vessel(s.x, shelfY - s.r * 0.15, s.r, s.v)}</g>`)
    .join('');

  const hx = 686;
  const hy = shelfY - 96;

  return svg(
    w,
    h,
    `
    ${siblings}

    <!-- the shelf: a gold hairline, the way a tray has an edge -->
    <line x1="120" y1="${shelfY + 40}" x2="${w - 120}" y2="${shelfY + 40}" stroke="${C.gold}" stroke-width="2" opacity="0.45"/>

    <!-- the sign's own vessel, lifted and ringed -->
    <circle cx="${hx}" cy="${hy}" r="132" fill="none" stroke="${C.gold}" stroke-width="2" opacity="0.55"/>
    ${vessel(hx, hy, 104, i, 'url(#clayDeep)')}
    <polygon points="${khatam(hx, hy, 34)}" fill="none" stroke="${C.white}" stroke-width="2" opacity="0.6"/>

    <text x="120" y="${h - 70}" font-family="Georgia, serif" font-size="46" fill="${C.gold}" opacity="0.9">${String(i + 1).padStart(2, '0')}</text>
    <polygon points="${khatam(w - 140, 130, 24)}" fill="none" stroke="${C.gold}" stroke-width="1.5" opacity="0.35"/>`,
  );
}

/* ── 2. How-it-works mini-scenes (960 x 720) ─────────────────────────────── */
const HOW = [
  // discover — a vessel opening, a star rising out of it
  (w, h) => `
    ${vessel(w / 2, h / 2 + 40, 160, 1)}
    <polygon points="${khatam(w / 2, h / 2 - 120, 54)}" fill="none" stroke="${C.brand}" stroke-width="3" opacity="0.5"/>
    <polygon points="${khatam(w / 2, h / 2 - 120, 30)}" fill="${C.wash}" stroke="${C.brand}" stroke-width="2" opacity="0.6"/>
    <path d="M${w / 2 - 90} ${h / 2 + 40} Q${w / 2} ${h / 2 - 40} ${w / 2 + 90} ${h / 2 + 40}" stroke="${C.white}" stroke-width="3" opacity="0.6" fill="none"/>`,
  // check — a timer ring closing around a form
  (w, h) => `
    ${vessel(w / 2, h / 2, 130, 4)}
    <circle cx="${w / 2}" cy="${h / 2}" r="200" fill="none" stroke="${C.petal}" stroke-width="14"/>
    <path d="M ${w / 2} ${h / 2 - 200} A 200 200 0 1 1 ${w / 2 - 173} ${h / 2 + 100}" fill="none" stroke="${C.brand}" stroke-width="14" stroke-linecap="round" opacity="0.85"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="8" fill="${C.brand}" opacity="0.6"/>`,
  // understand — two forms in conversation
  (w, h) => `
    ${vessel(w / 2 - 130, h / 2 + 10, 120, 2)}
    ${vessel(w / 2 + 140, h / 2 - 20, 100, 7)}
    <path d="M${w / 2 - 30} ${h / 2 - 60} q60 -70 130 -30" stroke="${C.teal}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6"/>
    <circle cx="${w / 2 - 40}" cy="${h / 2 - 58}" r="7" fill="${C.teal}" opacity="0.6"/>
    <circle cx="${w / 2 + 110}" cy="${h / 2 - 92}" r="7" fill="${C.teal}" opacity="0.6"/>`,
  // act — a form, a dashed path, a destination pin (one clean teardrop)
  (w, h) => {
    const px = w / 2 + 170;
    const py = h / 2 - 90;
    return `
    ${vessel(w / 2 - 160, h / 2 + 60, 104, 3)}
    <path d="M${w / 2 - 70} ${h / 2 + 50} C ${w / 2} ${h / 2 - 10}, ${w / 2 + 70} ${h / 2 + 90}, ${px} ${py + 76}" stroke="${C.gold}" stroke-width="4" stroke-dasharray="12 14" stroke-linecap="round" fill="none" opacity="0.75"/>
    <path d="M${px} ${py + 76} C ${px - 48} ${py + 22}, ${px - 44} ${py - 46}, ${px} ${py - 46} C ${px + 44} ${py - 46}, ${px + 48} ${py + 22}, ${px} ${py + 76} Z" fill="url(#cta)" opacity="0.92"/>
    <circle cx="${px}" cy="${py - 8}" r="19" fill="${C.wash}"/>
    <ellipse cx="${px}" cy="${py + 96}" rx="34" ry="7" fill="${C.brand}" opacity="0.14"/>`;
  },
];

/* ── 3. Risk factors: what you can change vs what you cannot (1680 x 720) ── */
function riskInfographic() {
  const w = 1680;
  const h = 720;
  const left = w * 0.28;
  const right = w * 0.72;
  const notChangeable = [0, 1, 2, 3].map((n, i) =>
    vessel(left + (i - 1.5) * 128, h / 2 + (i % 2 ? 26 : -26), 54, n + 2),
  ).join('');
  const changeable = [4, 5, 6, 7].map((n, i) =>
    vessel(right + (i - 1.5) * 128, h / 2 + (i % 2 ? 26 : -26), 54, n + 6, 'url(#clayDeep)'),
  ).join('');
  return svg(
    w,
    h,
    `
    <line x1="${w / 2}" y1="${h * 0.18}" x2="${w / 2}" y2="${h * 0.82}" stroke="${C.gold}" stroke-width="1.5" opacity="0.4"/>
    <polygon points="${khatam(w / 2, h / 2, 16)}" fill="${C.wash}" stroke="${C.gold}" stroke-width="1.5" opacity="0.7"/>
    <g opacity="0.75">${notChangeable}</g>
    ${changeable}
    <circle cx="${right}" cy="${h * 0.2}" r="9" fill="${C.teal}" opacity="0.8"/>
    <circle cx="${left}" cy="${h * 0.2}" r="9" fill="${C.rose}" opacity="0.9"/>`,
  );
}

/* ── 4. Credibility: the editorial flow (960 x 720) ──────────────────────── */
function methodDiagram() {
  const w = 960;
  const h = 720;

  /* Was four grey bars beside numbered discs — which is precisely what a
     loading skeleton looks like. A diagram has to depict something. This one
     depicts the actual editorial pipeline: write -> adapt -> review -> publish,
     with the review node OPEN (dashed) because nobody has reviewed the content
     yet, and the diagram should not claim otherwise. */
  const xs = [150, 390, 630, 850];
  const y = h / 2 - 30;

  const spine = `<line x1="${xs[0]}" y1="${y}" x2="${xs[3]}" y2="${y}" stroke="${C.gold}" stroke-width="2" stroke-dasharray="7 9" opacity="0.6"/>`;

  const nodes = xs
    .map((x, i) => {
      const pending = i === 2; // medical review — not yet done
      const r = i === 3 ? 62 : 54;
      return `
    ${pending
      ? `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.wash}" stroke="${C.gold}" stroke-width="3" stroke-dasharray="8 8" opacity="0.9"/>`
      : vessel(x, y, r, i * 3 + 2, i === 3 ? 'url(#clayDeep)' : 'url(#clay)')}
    <polygon points="${khatam(x, y, i === 3 ? 20 : 16)}" fill="none" stroke="${pending ? C.gold : C.white}" stroke-width="1.8" opacity="0.65"/>
    <text x="${x}" y="${y + 110}" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${C.gold}" opacity="0.9">${i + 1}</text>`;
    })
    .join('');

  return svg(
    w,
    h,
    `
    ${spine}
    ${nodes}
    <line x1="150" y1="${h - 92}" x2="${w - 110}" y2="${h - 92}" stroke="${C.gold}" stroke-width="1.5" opacity="0.35"/>
    <polygon points="${khatam(w / 2, h - 92, 13)}" fill="${C.wash}" stroke="${C.gold}" stroke-width="1.5" opacity="0.6"/>`,
  );
}

/* ── 5. "What to do next": the four lanes as a decision graphic (1600x900) ─ */
function decisionGraphic() {
  const w = 1600;
  const h = 900;
  const lanes = [C.teal, C.pink, '#3B82F6', C.gold];
  const cols = lanes
    .map((colour, i) => {
      const x = 200 + i * 400;
      return `
    <rect x="${x - 150}" y="${180}" width="300" height="520" rx="48" fill="${C.white}" opacity="0.72"/>
    <rect x="${x - 150}" y="${180}" width="300" height="10" rx="5" fill="${colour}"/>
    ${vessel(x, 340, 78, i * 3 + 1)}
    <rect x="${x - 96}" y="470" width="192" height="14" rx="7" fill="${C.petal}"/>
    <rect x="${x - 96}" y="506" width="140" height="12" rx="6" fill="${C.petal}" opacity="0.7"/>
    <rect x="${x - 96}" y="566" width="192" height="42" rx="21" fill="${colour}" opacity="0.14"/>
    <circle cx="${x - 70}" cy="587" r="9" fill="${colour}" opacity="0.65"/>
    ${i < 3 ? `<path d="M${x + 165} 440 h 60" stroke="${C.gold}" stroke-width="3" stroke-dasharray="8 8" stroke-linecap="round" opacity="0.7"/>` : ''}`;
    })
    .join('');
  return svg(w, h, cols);
}

/* ── 6. The 12 Signs signature composition — the social card (1200 x 630) ── */
function signsOg() {
  const w = 1200;
  const h = 630;
  // Twelve ceramic forms as ONE curated collection. Not a grid of fruit: a tray
  // of vessels, uneven, hand-arranged, with the ribbon over them.
  const forms = Array.from({ length: 12 }, (_, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const x = 150 + col * 180 + (row ? 60 : 0);
    const y = 300 + row * 165;
    const r = 62 + ((i * 7) % 14);
    return vessel(x, y, r, i, row ? 'url(#clayDeep)' : 'url(#clay)');
  }).join('');

  const ribbon = `
    <g transform="translate(1010, 120) scale(1.15)" opacity="0.95">
      <path d="M0 0 C-12 16 -22 24 -22 34 C-22 50 2 62 22 74" fill="none" stroke="${C.brand}" stroke-width="13" stroke-linecap="round"/>
      <path d="M0 0 C12 16 22 24 22 34 C22 50 -2 62 -22 74" fill="none" stroke="${C.brand}" stroke-width="13" stroke-linecap="round"/>
    </g>`;

  return svg(
    w,
    h,
    `
    ${forms}
    <rect x="0" y="0" width="${w}" height="150" fill="${C.wash}" opacity="0.55"/>
    <text x="70" y="96" font-family="Georgia, serif" font-size="62" fill="${C.berry}">12</text>
    <text x="150" y="94" font-family="system-ui, sans-serif" font-weight="700" font-size="46" fill="${C.ink}">changes worth knowing</text>
    <line x1="70" y1="122" x2="640" y2="122" stroke="${C.gold}" stroke-width="2" opacity="0.5"/>
    ${ribbon}`,
  );
}

/* ── 7. Footer brand visual (600 x 600, transparent-ish mark) ────────────── */
function footerMark() {
  const w = 600;
  const h = 600;
  return svg(
    w,
    h,
    `
    ${vessel(w / 2, h / 2 + 30, 190, 6)}
    <polygon points="${khatam(w / 2, h / 2 + 30, 92)}" fill="none" stroke="${C.white}" stroke-width="3" opacity="0.5"/>
    <g transform="translate(${w / 2}, ${h / 2 - 140}) scale(1.5)">
      <path d="M0 0 C-12 16 -22 24 -22 34 C-22 50 2 62 22 74" fill="none" stroke="${C.brand}" stroke-width="13" stroke-linecap="round"/>
      <path d="M0 0 C12 16 22 24 22 34 C22 50 -2 62 -22 74" fill="none" stroke="${C.brand}" stroke-width="13" stroke-linecap="round"/>
    </g>`,
  );
}


/* ── 8. Self-check step scenes (960 x 720) ───────────────────────────────── */
/* Symbolic aids, NOT instruction. An abstract vessel cannot teach a hand motion,
   and that is an honest limit — see docs/ASSETS.md, where these are listed as
   the one slot a commissioned illustrator would genuinely outperform. What they
   can do is set a calm tone and mark the step, which is what they do. */
const STEPS = [
  // 1. look in the mirror — a vessel before a soft arc
  (w, h) => `
    <path d="M${w / 2 - 250} ${h / 2 + 190} A 250 250 0 0 1 ${w / 2 + 250} ${h / 2 + 190}" fill="none" stroke="${C.rose}" stroke-width="10" opacity="0.55"/>
    <path d="M${w / 2 - 190} ${h / 2 + 190} A 190 190 0 0 1 ${w / 2 + 190} ${h / 2 + 190}" fill="none" stroke="${C.gold}" stroke-width="2" stroke-dasharray="8 10" opacity="0.5"/>
    ${vessel(w / 2, h / 2 + 40, 120, 1)}`,
  // 2. raise your arms — two rising curves
  (w, h) => `
    ${vessel(w / 2, h / 2 + 70, 116, 4)}
    <path d="M${w / 2 - 92} ${h / 2 + 10} C ${w / 2 - 150} ${h / 2 - 120}, ${w / 2 - 70} ${h / 2 - 190}, ${w / 2 - 40} ${h / 2 - 230}" stroke="${C.brand}" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.5"/>
    <path d="M${w / 2 + 92} ${h / 2 + 10} C ${w / 2 + 150} ${h / 2 - 120}, ${w / 2 + 70} ${h / 2 - 190}, ${w / 2 + 40} ${h / 2 - 230}" stroke="${C.brand}" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.5"/>
    <polygon points="${khatam(w / 2, h / 2 - 250, 22)}" fill="none" stroke="${C.gold}" stroke-width="2" opacity="0.6"/>`,
  // 3. check standing — concentric circular motion
  (w, h) => `
    ${vessel(w / 2, h / 2, 108, 2)}
    <circle cx="${w / 2}" cy="${h / 2}" r="160" fill="none" stroke="${C.brand}" stroke-width="2.5" stroke-dasharray="4 12" opacity="0.5"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="212" fill="none" stroke="${C.brand}" stroke-width="2" stroke-dasharray="4 14" opacity="0.35"/>
    <circle cx="${w / 2 + 212}" cy="${h / 2}" r="10" fill="${C.brand}" opacity="0.6"/>`,
  // 4. check lying down — a vessel resting on a cushion
  (w, h) => `
    <path d="M${w / 2 - 260} ${h / 2 + 150} q 260 -90 520 0 q -260 90 -520 0 z" fill="${C.petal}" stroke="${C.brand}" stroke-width="2" stroke-opacity="0.22"/>
    ${vessel(w / 2, h / 2 + 30, 118, 6)}
    <line x1="${w / 2 - 190}" y1="${h / 2 + 205}" x2="${w / 2 + 190}" y2="${h / 2 + 205}" stroke="${C.gold}" stroke-width="2" opacity="0.4"/>`,
  // 5. check the nipple — a small centred khatam, gentle rays. Deliberately the
  //    most abstract of the five: this is the step where anything literal would
  //    be a violation, and the words carry the instruction anyway.
  (w, h) => `
    ${vessel(w / 2, h / 2, 130, 9)}
    <polygon points="${khatam(w / 2, h / 2, 42)}" fill="${C.wash}" stroke="${C.brand}" stroke-width="2.5" opacity="0.75"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="14" fill="none" stroke="${C.brand}" stroke-width="2" opacity="0.5"/>
    ${[0, 1, 2, 3, 4, 5].map((k) => {
      const a = (Math.PI / 3) * k - Math.PI / 2;
      const x1 = w / 2 + Math.cos(a) * 170;
      const y1 = h / 2 + Math.sin(a) * 170;
      const x2 = w / 2 + Math.cos(a) * 215;
      const y2 = h / 2 + Math.sin(a) * 215;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.gold}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>`;
    }).join('')}`,
];

/* ── Render ──────────────────────────────────────────────────────────────── */
async function emit(name, markup, dir = OUT, widths = null) {
  const buf = Buffer.from(markup);
  await writeFile(join(dir, `${name}.svg`), markup, 'utf8');

  // SVG is the primary format for these (they are vector, they scale, they are
  // ~4 KB). Raster fallbacks exist only for the OG cards, which crawlers cannot
  // read as SVG.
  if (widths) {
    for (const width of widths) {
      await sharp(buf, { density: 200 }).resize({ width }).png({ quality: 90 }).toFile(join(dir, `${name}.png`));
    }
  }
  return markup.length;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(OG, { recursive: true });

  let n = 0;

  for (let i = 0; i < 12; i++) {
    await emit(`sign-${String(i + 1).padStart(2, '0')}`, signScene(i));
    n++;
  }

  const howNames = ['discover', 'check', 'understand', 'act'];
  for (let i = 0; i < 4; i++) {
    await emit(`how-${howNames[i]}`, svg(960, 720, HOW[i](960, 720)));
    n++;
  }

  for (let i = 0; i < 5; i++) {
    await emit(`step-${i + 1}`, svg(960, 720, STEPS[i](960, 720)));
    n++;
  }

  await emit('risk-factors-infographic', riskInfographic()); n++;
  await emit('method-flow', methodDiagram()); n++;
  await emit('decision-lanes', decisionGraphic()); n++;
  await emit('footer-mark', footerMark()); n++;

  // OG cards must be raster — no crawler renders SVG.
  await emit('signs-og', signsOg(), OG, [1200]); n++;
  await emit('sahtek-og', signsOg(), OG, [1200]); n++;

  console.log(`  generated ${n} brand assets (SVG${''}, + PNG for the 2 OG cards)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
