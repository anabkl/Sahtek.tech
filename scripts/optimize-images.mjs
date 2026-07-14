/**
 * Image optimizer. Run once when a source asset changes; commit the output.
 *
 * `body-map.png` shipped at 1536x2752 and 3.86 MB while rendering at a maximum
 * of 320 CSS px wide. That is a ~5x oversized image and, on the 3G connections
 * a lot of this audience is on, roughly forty seconds of staring at nothing.
 *
 * We emit AVIF + WebP at the two sizes the layout can actually use (2x and 3x of
 * the 320px cap) and keep a small PNG as the last-resort fallback.
 */
import { readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
/* Source lives OUTSIDE public/: anything in public/ is copied verbatim into
   dist, so keeping the 3.9 MB original there shipped it on every deploy even
   though nothing referenced it. */
const SRC_DIR = join(ROOT, 'assets-src');
const DIR = join(ROOT, 'public', 'assets');

/** Widths the layout can actually paint: 320 CSS px cap, at 2x and 3x. */
const WIDTHS = [640, 960];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function main() {
  const before = (await stat(join(SRC_DIR, 'body-map.png'))).size;
  const src = sharp(join(SRC_DIR, 'body-map.png'));

  for (const width of WIDTHS) {
    await src.clone().resize({ width }).avif({ quality: 55, effort: 6 }).toFile(join(DIR, `body-map-${width}.avif`));
    await src.clone().resize({ width }).webp({ quality: 78 }).toFile(join(DIR, `body-map-${width}.webp`));
  }

  // Fallback for browsers with neither AVIF nor WebP. Kept small on purpose —
  // it is a fallback, not the main path.
  await src.clone().resize({ width: 640 }).png({ quality: 80, compressionLevel: 9, palette: true }).toFile(join(DIR, 'body-map-640.png'));

  const files = (await readdir(DIR)).filter((f) => f.startsWith('body-map-')).sort();
  let biggestPath = 0;
  console.log(`  source: body-map.png  ${kb(before)}`);
  for (const f of files) {
    const size = (await stat(join(DIR, f))).size;
    if (f.endsWith('.avif') && f.includes('960')) biggestPath = size;
    console.log(`  -> ${f.padEnd(22)} ${kb(size)}`);
  }
  console.log(
    `  worst-case modern payload (960 AVIF): ${kb(biggestPath)} — ${(before / biggestPath).toFixed(0)}x smaller`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
