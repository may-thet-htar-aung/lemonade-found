/**
 * Illustrated item photos, drawn as inline SVG so the apps need no image hosting.
 * Colours follow the Lemonade brand: Soft Sand backdrop, Dark Ink outlines.
 */

const INK = '#292D28';
const SAND = '#F3F0E6';
const LEMON = '#F6D84C';

const frame = (inner: string, bg = SAND) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">` +
  `<rect width="400" height="300" fill="${bg}"/>` +
  `<ellipse cx="200" cy="262" rx="120" ry="14" fill="${INK}" opacity="0.08"/>` +
  inner +
  `</svg>`;

const wallet = frame(`
  <rect x="80" y="90" width="240" height="150" rx="22" fill="#1F1F1F" stroke="${INK}" stroke-width="4"/>
  <rect x="96" y="70" width="90" height="40" rx="6" fill="#E8E3D2" transform="rotate(-6 96 70)"/>
  <rect x="106" y="62" width="90" height="40" rx="6" fill="${LEMON}" transform="rotate(4 106 62)"/>
  <path d="M80 130 H320" stroke="#3A3A3A" stroke-width="3"/>
  <rect x="250" y="150" width="70" height="52" rx="14" fill="#2E2E2E" stroke="#4A4A4A" stroke-width="3"/>
  <circle cx="276" cy="176" r="8" fill="${LEMON}"/>
  <path d="M96 112 H234 M96 224 H234" stroke="#4A4A4A" stroke-width="2" stroke-dasharray="6 6"/>
`);

const umbrella = frame(`
  <path d="M70 160 A130 120 0 0 1 330 160 Q307 140 285 160 Q262 140 240 160 Q220 140 200 160 Q180 140 160 160 Q138 140 115 160 Q92 140 70 160Z" fill="#8C9096" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M200 40 V160 M200 40 Q150 80 160 160 M200 40 Q250 80 240 160" stroke="${INK}" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M200 160 V230 Q200 252 178 252 Q158 252 158 232" fill="none" stroke="#7A5230" stroke-width="10" stroke-linecap="round"/>
  <circle cx="200" cy="38" r="6" fill="${INK}"/>
`);

const phone = frame(`
  <rect x="135" y="40" width="130" height="220" rx="22" fill="#1B1D22" stroke="${INK}" stroke-width="4"/>
  <rect x="146" y="58" width="108" height="184" rx="10" fill="#3B4350"/>
  <circle cx="200" cy="50" r="3.5" fill="#555B66"/>
  <path d="M150 62 L190 120 L172 150 L232 238 M190 120 L246 112 M172 150 L148 196" stroke="#E7ECF3" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.9"/>
  <rect x="178" y="248" width="44" height="4" rx="2" fill="#555B66"/>
`);

const glasses = frame(`
  <rect x="70" y="196" width="190" height="52" rx="26" fill="#7A5230" stroke="${INK}" stroke-width="4" transform="rotate(-8 165 222)"/>
  <circle cx="145" cy="130" r="48" fill="#DCEBF2" fill-opacity="0.55" stroke="#2B2B2B" stroke-width="9"/>
  <circle cx="265" cy="130" r="48" fill="#DCEBF2" fill-opacity="0.55" stroke="#2B2B2B" stroke-width="9"/>
  <path d="M193 124 Q205 110 217 124" fill="none" stroke="#2B2B2B" stroke-width="8" stroke-linecap="round"/>
  <path d="M97 120 L56 100 M313 120 L354 100" stroke="#2B2B2B" stroke-width="8" stroke-linecap="round"/>
  <path d="M120 112 Q132 100 146 104" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
`);

const backpack = frame(`
  <path d="M155 70 Q155 30 200 30 Q245 30 245 70" fill="none" stroke="#5A3A20" stroke-width="12" stroke-linecap="round"/>
  <rect x="110" y="62" width="180" height="200" rx="52" fill="#8A5A34" stroke="${INK}" stroke-width="4"/>
  <rect x="135" y="170" width="130" height="72" rx="22" fill="#7A4D2B" stroke="${INK}" stroke-width="3"/>
  <path d="M140 118 H260" stroke="${INK}" stroke-width="3" stroke-dasharray="8 6"/>
  <rect x="190" y="106" width="20" height="26" rx="5" fill="${LEMON}" stroke="${INK}" stroke-width="3"/>
  <path d="M135 190 H265" stroke="${INK}" stroke-width="3"/>
  <path d="M110 110 Q84 150 96 220 M290 110 Q316 150 304 220" fill="none" stroke="#5A3A20" stroke-width="10" stroke-linecap="round"/>
`);

const earbuds = frame(`
  <rect x="115" y="80" width="170" height="130" rx="52" fill="#F7F7F4" stroke="${INK}" stroke-width="4"/>
  <path d="M115 130 H285" stroke="${INK}" stroke-width="3" opacity="0.6"/>
  <circle cx="200" cy="164" r="7" fill="${LEMON}" stroke="${INK}" stroke-width="2"/>
  <rect x="180" y="200" width="40" height="6" rx="3" fill="${INK}" opacity="0.25"/>
  <path d="M140 100 Q200 82 260 100" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
`);

const generic = frame(`
  <rect x="120" y="90" width="160" height="130" rx="18" fill="#E2D9BF" stroke="${INK}" stroke-width="4"/>
  <path d="M120 130 H280" stroke="${INK}" stroke-width="3"/>
  <rect x="180" y="118" width="40" height="24" rx="4" fill="${LEMON}" stroke="${INK}" stroke-width="3"/>
`);

const toUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const PHOTOS: Record<string, string> = {
  wallet: toUri(wallet),
  umbrella: toUri(umbrella),
  phone: toUri(phone),
  glasses: toUri(glasses),
  backpack: toUri(backpack),
  earbuds: toUri(earbuds),
  generic: toUri(generic),
};

/** Picks the illustration that matches an item's title. */
export function photoFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('wallet')) return PHOTOS.wallet;
  if (t.includes('umbrella')) return PHOTOS.umbrella;
  if (t.includes('phone')) return PHOTOS.phone;
  if (t.includes('glasses')) return PHOTOS.glasses;
  if (t.includes('backpack')) return PHOTOS.backpack;
  if (t.includes('earbuds')) return PHOTOS.earbuds;
  return PHOTOS.generic;
}
