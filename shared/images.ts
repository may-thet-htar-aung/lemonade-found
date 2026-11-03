/**
 * Item photos. Real photos for the known categories, hotlinked from Unsplash
 * (free to use, no API key). Each id below was checked to show the right object.
 * Anything else falls back to a simple drawn box, so a card is never empty.
 */

const INK = '#292D28';
const SAND = '#F3F0E6';
const LEMON = '#F6D84C';

/** Unsplash photo ids, verified by eye to match their label. */
const UNSPLASH: Record<string, string> = {
  wallet: 'photo-1627123424574-724758594e93',
  umbrella: 'photo-1553550814-5ddd97fe5840',
  phone: 'photo-1511707171634-5f897ff02aa9',
  glasses: 'photo-1574258495973-f010dfbb5371',
  backpack: 'photo-1622560480605-d83c853bc5c3',
  earbuds: 'photo-1590658268037-6bf12165a8df',
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

/** Picks the photo that matches an item's title. */
export function photoFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('wallet')) return unsplash(UNSPLASH.wallet);
  if (t.includes('umbrella')) return unsplash(UNSPLASH.umbrella);
  if (t.includes('phone')) return unsplash(UNSPLASH.phone);
  if (t.includes('glasses')) return unsplash(UNSPLASH.glasses);
  if (t.includes('backpack') || t.includes('bag')) return unsplash(UNSPLASH.backpack);
  if (t.includes('earbuds')) return unsplash(UNSPLASH.earbuds);
  return FALLBACK;
}
