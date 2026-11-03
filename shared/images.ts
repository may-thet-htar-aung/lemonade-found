/**
 * Item photos. Real photos for the known categories, hotlinked from Unsplash
 * (free to use, no API key). Each id below was checked to show the right object.
 * Each category has a few photos so the detail gallery can cycle through them.
 * Anything else falls back to a simple drawn box, so a card is never empty.
 */

const INK = '#292D28';
const SAND = '#F3F0E6';
const LEMON = '#F6D84C';

/** Unsplash photo ids per category, verified by eye to match their label. */
const UNSPLASH: Record<string, string[]> = {
  wallet: [
    'photo-1627123424574-724758594e93',
    'photo-1579014134953-1580d7f123f3',
    'photo-1628483211662-9bcc692c46dc',
  ],
  umbrella: [
    'photo-1553550814-5ddd97fe5840',
    'photo-1604560353366-28e44ad06afe',
    'photo-1668761401578-f66731b79a9c',
  ],
  phone: [
    'photo-1511707171634-5f897ff02aa9',
    'photo-1523206489230-c012c64b2b48',
    'photo-1592890288564-76628a30a657',
  ],
  glasses: [
    'photo-1574258495973-f010dfbb5371',
    'photo-1556306510-31ca015374b0',
    'photo-1646084081219-1090f72a531c',
  ],
  backpack: [
    'photo-1622560480605-d83c853bc5c3',
    'photo-1622560480654-d96214fdc887',
    'photo-1765516833058-c322c800fee1',
  ],
  earbuds: [
    'photo-1590658268037-6bf12165a8df',
    'photo-1572569511254-d8f925fe2cbb',
    'photo-1606841837239-c5a1a4a07af7',
  ],
};

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;

/** Drawn fallback for an item with no matching photo. */
const genericBox =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">` +
  `<rect width="400" height="300" fill="${SAND}"/>` +
  `<ellipse cx="200" cy="262" rx="120" ry="14" fill="${INK}" opacity="0.08"/>` +
  `<rect x="120" y="90" width="160" height="130" rx="18" fill="#E2D9BF" stroke="${INK}" stroke-width="4"/>` +
  `<path d="M120 130 H280" stroke="${INK}" stroke-width="3"/>` +
  `<rect x="180" y="118" width="40" height="24" rx="4" fill="${LEMON}" stroke="${INK}" stroke-width="3"/>` +
  `</svg>`;

const FALLBACK = `data:image/svg+xml;utf8,${encodeURIComponent(genericBox)}`;

function idsFor(title: string): string[] | null {
  const t = title.toLowerCase();
  if (t.includes('wallet')) return UNSPLASH.wallet;
  if (t.includes('umbrella')) return UNSPLASH.umbrella;
  if (t.includes('phone')) return UNSPLASH.phone;
  if (t.includes('glasses')) return UNSPLASH.glasses;
  if (t.includes('backpack') || t.includes('bag')) return UNSPLASH.backpack;
  if (t.includes('earbuds')) return UNSPLASH.earbuds;
  return null;
}

/** The lead photo for an item, used on cards. */
export function photoFor(title: string): string {
  const ids = idsFor(title);
  return ids ? unsplash(ids[0]) : FALLBACK;
}

/** All photos for an item, used by the detail gallery. */
export function photosFor(title: string, w = 1000): string[] {
  const ids = idsFor(title);
  return ids ? ids.map((id) => unsplash(id, w)) : [FALLBACK];
}
