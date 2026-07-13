# Open Graph assets

Social link-preview images. These are **asset slots — none of these files exist yet.**
Until a PNG is dropped here, a shared link renders with no preview image (no broken
image; just no image).

| File | Size | Used by | Alt text |
|---|---|---|---|
| `sahtek-og.png` | 1200 × 630 | Site-wide default (`index.html`) | `signsPage.ogAlt` in `src/i18n/*` |
| `signs-og.png` | 1200 × 630 | `/signs` — **needs prerendering first, see below** | `signsPage.ogAlt` |

## Art direction

Same rules as the rest of the product (`CLAUDE.md` §4, HARD RULES 3–6):

- Rose/magenta gradient ground, the ribbon mark, generous breathing room.
- Symbolic only — soft ceramic/petal forms. **No anatomy, no clinical photography,
  no fruit-grid.**
- Readable at thumbnail size: one short line of type, high contrast. Most people
  see this at ~250px wide in a WhatsApp bubble.
- Set the type in Plus Jakarta Sans / IBM Plex Sans Arabic; the numeral accent is
  Fraunces.

## The per-route limitation (important)

Sahtek is a client-rendered SPA. The crawlers that build link previews — Facebook,
WhatsApp, LinkedIn, iMessage, Slack — **do not execute JavaScript.** They read the
HTML that the server returns, which is always `index.html`.

So today:

- Sharing **any** URL, including `/signs`, produces the **site-wide** card from
  `index.html`.
- Setting `og:*` tags at runtime from React (react-helmet or a `useEffect`) will
  **not** change that. It looks like it works when you test in a browser and fails
  for every real crawler.

To give `/signs` its own card you need the tags in the served HTML:

1. **Prerender** the route at build time (e.g. `vite-plugin-ssg` / a prerender step),
   emitting a real `dist/signs/index.html` with its own `og:*` block; or
2. **Inject at the edge** (Netlify/Vercel/Cloudflare function) that rewrites the
   `og:*` tags per path before returning `index.html`.

Either is a build/deploy change, not a component change. Do not "fix" this by
setting meta tags in a React effect — it will pass a manual test and fail in
production.
