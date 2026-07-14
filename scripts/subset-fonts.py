# -*- coding: utf-8 -*-
"""Subset Fraunces to the glyphs it actually renders, and drop dead font files.

FRAUNCES is the editorial serif, and it is used in exactly one way across the
whole product: the numerals on the Care Cards (01-12), the How-It-Works steps and
the self-check step counter. Every call site is `String(i + 1)` / `padStart` /
`step_number` — digits, nothing else.

We were shipping the full Latin face for that: 66 KB per weight, 132 KB on the
home page alone, to draw twelve numbers.

NOTO SANS is declared as a *fallback* in the Tailwind stack and is never the
primary family for anything. Twenty files that no page ever fetches.

Run this when a font source changes; commit the output.
"""
import io, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, 'public', 'fonts')
CSS = os.path.join(ROOT, 'src', 'styles', 'fonts.css')

# Digits, plus the separators a numeral string could ever contain.
GLYPHS = '0123456789'

def kb(path):
    return os.path.getsize(path) / 1024.0

def main():
    print('== Fraunces: subset to digits ==')
    saved = 0.0
    for f in sorted(os.listdir(FONTS)):
        if not f.startswith('fraunces') or not f.endswith('.woff2'):
            continue
        src = os.path.join(FONTS, f)
        before = kb(src)
        out = src + '.tmp'
        subprocess.run([
            sys.executable, '-m', 'fontTools.subset', src,
            '--text=' + GLYPHS,
            '--flavor=woff2',
            '--layout-features=',      # no ligatures/kerning needed for digits
            '--desubroutinize',
            '--output-file=' + out,
        ], check=True, capture_output=True)
        os.replace(out, src)
        after = kb(src)
        saved += before - after
        print('  %-38s %6.1f KB -> %5.1f KB' % (f, before, after))
    print('  saved on disk: %.0f KB' % saved)

    print('== Noto Sans: remove (fallback only, never the primary family) ==')
    removed = 0
    freed = 0.0
    for f in sorted(os.listdir(FONTS)):
        if f.startswith('noto-sans'):
            p = os.path.join(FONTS, f)
            freed += kb(p)
            os.remove(p)
            removed += 1
    print('  removed %d files, %.0f KB' % (removed, freed))

    # Strip the now-dangling @font-face rules.
    css = io.open(CSS, encoding='utf-8').read()
    blocks = re.findall(r'@font-face\s*\{[^}]*\}', css, re.S)
    kept = [b for b in blocks if "'Noto Sans'" not in b]
    dropped = len(blocks) - len(kept)
    for b in blocks:
        if "'Noto Sans'" in b:
            css = css.replace(b, '')
    css = re.sub(r'\n{3,}', '\n\n', css)
    io.open(CSS, 'w', encoding='utf-8', newline='').write(css)
    print('  dropped %d @font-face rules from fonts.css' % dropped)

if __name__ == '__main__':
    main()
