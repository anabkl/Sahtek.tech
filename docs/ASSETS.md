# Image & asset placement plan

Every placeholder in the product has been replaced. Nothing renders a dashed box.

Two pipelines produce everything, and both are committed and repeatable:

| Script | Produces | Run when |
|---|---|---|
| `node scripts/generate-assets.mjs` | 25 brand illustrations (SVG) + 2 OG cards (PNG) | the brand vocabulary changes |
| `node scripts/optimize-images.mjs` | responsive AVIF/WebP for raster sources | a source photo/render changes |

App screenshots are captured from the running build (see **Screenshots** below).

---

## The visual vocabulary

Everything symbolic is **geometry**, authored in `scripts/generate-assets.mjs`:

- **Ceramic forms** — a closed polar curve `r(θ) = R·(1 + a·cos(kθ + φ))`, the same maths
  as `<PetalMark/>`. An illustration and a card are visibly the same object.
- **Khatam** (eight-point star) line work, always faint.
- Rose/berry gradients, gold hairlines, a teal accent for calm.

### Rules the art obeys

- **No anatomy, no clinical imagery, no distressed faces** (HARD RULES 3 & 4).
- **No human figures.** An illustrated woman is a *specific* woman, and the one thing we
  cannot draw is "every woman in Morocco". Symbols include her; a drawing of somebody
  else does not.
- **No grid of twelve fruits.** Peaches and apricots are permitted as *ornament* — a lone
  still-life, a single form — but twelve of them in a grid, each carrying a sign, rebuilds
  the exact awareness layout HARD RULE 6 exists to keep us away from. **The twelve signs
  are ceramic vessels, not fruit.**

### One thing that had to be redesigned

The first pass rendered each sign as **one large, glazed, centred pink form**. On screen,
in a breast-health app, that reads as a breast — precisely what rules 3 and 4 forbid.
Scale and singularity were doing it, not the curve. The fix: a **tray of small vessels on
a shelf**, with the sign's own form lifted and ringed in gold. Objects at that size read
as objects. The glaze highlight was also dropped from 0.85 to 0.18 — a strong radial
highlight is what turns a soft curve into a body.

---

## Slot-by-slot placement

| # | Slot | Type | File | Size | Role | Alt text |
|---|---|---|---|---|---|---|
| 1 | **Hero phone mockup** | Screenshot (AVIF/WebP/PNG) | `screens/self-check-step.*` | 1170×2532 | The one above-the-fold image. `fetchpriority=high`, eager. | `home.previewAlt` |
| 2 | **Hero background** | Inline SVG + CSS | `ZelligeAccent` + blur blooms | fluid | Atmosphere. Parallaxed, `aria-hidden`. | decorative |
| 3 | **12 Signs signature composition** | PNG (social) | `og/signs-og.png` | 1200×630 | The shareable card for `/signs`. Twelve vessels as one collection + ribbon. | `signsPage.ogAlt` |
| 4 | **Individual sign cards** (×12) | Inline SVG | `<PetalMark variant={i}/>` | 92px | The card face. Ornament; the *label* teaches. | `aria-hidden` |
| 5 | **Sign detail scenes** (×12) | SVG | `assets/sign-01…12.svg` | 1200×900 | One per sign, on `/signs`. Tray-of-vessels. | `signsPage.imageAltTemplate` |
| 6 | **How-it-works** (×4) | SVG | `assets/how-{discover,check,understand,act}.svg` | 960×720 | Mini-scenes: vessel+star, timer ring, two vessels in dialogue, path+pin. | `home.howItWorks.steps[i].imageAlt` |
| 7 | **Self-check preview** (×3) | Screenshot | `screens/{self-check-intro,self-check-step,reminder}.*` | 1170×2532 | Real screens, alternating with text. Lazy. | `home.selfCheckPreview.steps[i].imageAlt` |
| 8 | **Self-check step scenes** (×5) | SVG | `assets/step-1…5.svg` | 960×720 | One per step, in-flow. | `selfCheck.steps[i].imageAlt` |
| 9 | **AI companion chat** | **Live JSX** | `Companion.tsx` / `CompanionPage.tsx` | — | A real rendered conversation. Costs nothing, can never go stale, already localized. | live text |
| 10 | **Risk-factor cards** | Lucide icons | — | 20px | Icon per factor. | `aria-hidden` |
| 11 | **Risk-factor infographic** | SVG | `assets/risk-factors-infographic.svg` | 1680×720 | Can-change vs cannot-change, split by a gold khatam. | `home.riskFactorsSection.infographicAlt` |
| 12 | **"What to do next" graphic** | SVG | `assets/decision-lanes.svg` | 1600×900 | Four lanes. **No red lane** — gold is the most urgent. | (available; lanes render as cards today) |
| 13 | **Trust / methodology** | SVG | `assets/method-flow.svg` | 960×720 | write → adapt → **review (dashed/open)** → publish. The review node is open **because nobody has reviewed the content yet.** | `home.credibility.methodImageAlt` |
| 14 | **Footer brand visual** | Inline SVG | `LogoLockup` + `ZelligeAccent` corner | — | Already brand-marked. `assets/footer-mark.svg` (600×600) is available for app-icon / social-avatar use. | decorative |
| 15 | **Site OG card** | PNG | `og/sahtek-og.png` | 1200×630 | Default social card. | `signsPage.ogAlt` |

**Alt-text strategy** — two categories, no third. *Decorative* (`PetalMark`, `ZelligeAccent`,
`RibbonMark`, every icon inside a labelled control) is `aria-hidden`. *Meaningful* carries a
**translated** alt from `src/i18n` — so every illustration announces correctly in all 7
languages.

**Performance** — SVG is the primary format for illustrations: they are geometry, so they are
4–30 KB, scale to any density for free, and need no `srcset`. Screenshots are AVIF-first
(~44 KB each, vs 250 KB PNG). Every image carries `width`/`height`, so **CLS is 0**. Only the
hero is eager; everything else is `loading="lazy"` + `decoding="async"`.

---

## Screenshots: how they are made

They are captured **from the running build**, not mocked up:

```bash
npm run build
npx vite preview --port 5173
# viewport 390×844 at deviceScaleFactor 3 → 1170×2532
# capture /self-check (intro), /self-check (mid-step), /reminder
# then: sharp → .avif (q52) + .webp (q76) + .png fallback → public/assets/screens/
```

Because they come from the product, they cannot drift from what she actually sees, and they
arrive already in the right language and direction. **Re-capture them whenever those screens
change** — a stale screenshot is a lie about your own app.

---

# Assets YOU must supply

Everything above is generated or captured. These four are the only things that need a human,
and none of them block the site.

### 1. Self-check step illustrations (×5) — **the one real gap**
- **Spec:** 960 × 720, SVG (or 1920×1440 PNG), transparent or `#FFF7FA` ground
- **Files:** replace `public/assets/step-1.svg` … `step-5.svg`
- **Steps:** 1 look in the mirror · 2 raise your arms · 3 check standing · 4 check lying down · 5 check the nipple
- **Why you:** an abstract vessel can set a tone, but it **cannot teach a hand motion**. These
  five have an *instructional* job, and that is the one job symbolism does badly. What ships
  today (ceramic + mirror arc, rising curves, motion rings, cushion, khatam+rays) is a
  respectful holding pattern, not an instruction.
- **Art direction:** modest line-art or silhouette; no explicit anatomy; convey *posture and
  motion*, not body detail. Match the rose/gold palette. Look at `step-3.svg` for the motion
  language to keep.

### 2. Medical reviewer portrait — **only once a reviewer exists**
- **Spec:** 400 × 400, WebP + PNG fallback, plain background
- **Blocked on:** an actual named clinician reviewing the content. `MEDICAL_REVIEW` in
  `src/config/constants.ts` is `null`, so the block currently says *"not yet reviewed by a
  named clinician"* — which is true. **Do not add a portrait before the review is real.**

### 3. Brand photography — **optional, only if you want warmth beyond symbolism**
- **Spec:** 2400 × 1600, AVIF/WebP, 3–5 images
- **Direction:** Moroccan interiors, hands, ceramic, textiles, soft daylight. **No clinical
  settings, no distressed faces, no medical props.** If you cannot get photography that
  clears those bars, the symbolic system is better than bad photography — do nothing.

### 4. App-store screenshots — **only when you list the PWA**
- **Spec:** 1290 × 2796 (iPhone 6.7"), 1080 × 1920 (Android), PNG
- These are marketing crops, not product assets. The capture pipeline above produces the
  source frames; they just need store framing and captions.
