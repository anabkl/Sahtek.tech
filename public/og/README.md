# Open Graph assets

Social link-preview images. These are **asset slots — none of these files exist yet.**
Until a PNG is dropped here, a shared link renders with no preview image (no broken
image; just no image).

| File | Size | Used by | Alt text |
|---|---|---|---|
| `sahtek-og.png` | 1200 × 630 | Every route's default card | `signsPage.ogAlt` in `src/i18n/*` |
| `signs-og.png` | 1200 × 630 | **`/signs` — the shareable 12 Signs visual** | `signsPage.ogAlt` |

`signs-og.png` is the one that matters most: `/signs` is the page built to be shared,
and its card is what lands in a WhatsApp thread. It should show the twelve ceramic
Care Card forms as a set — the signature visual — with the headline and the ribbon
mark. Per-route images are wired in `src/seo/routes.ts` (`ogImage`); add one there to
give any other route its own card.

## Art direction

Same rules as the rest of the product (`CLAUDE.md` §4, HARD RULES 3–6):

- Rose/magenta gradient ground, the ribbon mark, generous breathing room.
- Symbolic only — soft ceramic/petal forms. **No anatomy, no clinical photography,
  no fruit-grid.**
- Readable at thumbnail size: one short line of type, high contrast. Most people
  see this at ~250px wide in a WhatsApp bubble.
- Set the type in Plus Jakarta Sans / IBM Plex Sans Arabic; the numeral accent is
  Fraunces.

## Per-route cards: SOLVED (read this before changing the build)

Sahtek is a client-rendered SPA, and the crawlers that build link previews —
Facebook, WhatsApp, LinkedIn, iMessage, Slack — **do not execute JavaScript.**
Anything React sets at runtime is invisible to them.

This used to mean every shared URL got the same site-wide card. It no longer does:
**`scripts/generate-seo.mjs` runs after `vite build`** and writes a real
`dist/<route>/index.html` for every route, whose `<head>` carries that route's own
title, description, canonical, hreflang, `og:*`, Twitter card and JSON-LD. The
`<body>` is the unchanged SPA shell, so React hydrates exactly as before.

- The **user** gets the app.
- The **crawler** gets the truth, without running a line of JS.

Two things this depends on — do not break them:

1. **The host must serve an exact file match before the SPA rewrite.** Netlify,
   Vercel, Cloudflare Pages and nginx `try_files` all do this by default, so
   `/signs` resolves to `dist/signs/index.html`. If you add a catch-all rewrite
   that fires *first*, every route silently reverts to the generic card.
2. **The service worker's `navigateFallback`** serves the cached `index.html` for
   in-app navigations. That is fine — real users get correct tags from React at
   runtime — but it means you cannot verify per-route tags by clicking around a
   PWA-installed app. Verify by fetching the URL cold (`curl`, or a share-debugger).

Do not "fix" per-route tags by adding react-helmet. It passes a manual browser test
and fails for every real crawler.
