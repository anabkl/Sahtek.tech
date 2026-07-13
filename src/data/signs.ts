import {
  ArrowDownToDot,
  CircleDashed,
  CircleDot,
  Droplet,
  Flame,
  Grip,
  PersonStanding,
  Shapes,
  Spline,
  Target,
  Waves,
  Waypoints,
  type LucideIcon,
} from 'lucide-react';

/**
 * One icon per sign, in the order of `home.signs.items` — the single source of
 * truth for both the homepage section and the /signs page. The words live in
 * i18n; only the glyphs live here.
 *
 * These are calm, neutral marks. They stand for the QUALITY to notice — a
 * shape, a texture, a warmth — never for a wound, and never for a body part.
 * There is deliberately no bone or anatomy glyph: that is the clinical register
 * HARD RULE 3 rules out.
 *
 * The teaching is carried by the label and the words. Adding a 13th entry here
 * without adding a 13th `items` entry in all seven languages will not typecheck
 * at the call site — keep them in lockstep.
 */
export const SIGN_ICONS: LucideIcon[] = [
  CircleDot, // a new lump
  CircleDashed, // swelling in part of the breast
  Grip, // dimpling of the skin
  Flame, // redness or warmth
  Shapes, // a change in size or shape
  ArrowDownToDot, // a nipple turning inward
  Droplet, // discharge from the nipple
  Waves, // flaking or itching
  Target, // persistent pain in one spot
  Waypoints, // new prominent veins
  PersonStanding, // a lump under the arm
  Spline, // swelling above the collarbone
];
