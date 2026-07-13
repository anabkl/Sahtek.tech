import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/* tailwind-merge only knows Tailwind's stock scale (text-sm, text-lg, …). Our
   named type steps (text-h2, text-body-lg, …) are custom, and an unknown
   `text-*` class lands in its TEXT COLOUR group by default — so it treated
   `text-h2` and `text-ink` as rivals and silently dropped the size:

     cn('text-h2', 'text-ink')  ->  'text-ink'      // 16px, not 34px

   Every heading built through a `cn()` call (SectionHeading, Card, IconCard)
   was rendering at body size because of it. Registering the steps as font
   sizes puts them in the right group, so a size and a colour coexist and only
   two SIZES conflict. Any new step in tailwind.config must be added here too. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      /* Keep in sync with `fontSize` in tailwind.config.js. */
      'font-size': [
        {
          text: [
            'display',
            'h1',
            'h2',
            'h3',
            'h4',
            'body-lg',
            'body',
            'body-sm',
            'caption',
            'overline',
          ],
        },
      ],
    },
  },
});

/** Merge conditional class names while resolving Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
