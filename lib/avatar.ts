const gradientPalette: ReadonlyArray<[string, string]> = [
  ["#6366f1", "#a855f7"],
  ["#0ea5e9", "#22d3ee"],
  ["#f97316", "#facc15"],
  ["#22c55e", "#14b8a6"],
  ["#ec4899", "#f472b6"],
];

const sanitizeWords = (value: string) =>
  value
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const initialsFromName = (name: string) => {
  const words = sanitizeWords(name);
  if (words.length === 0) {
    return "•";
  }

  if (words.length === 1) {
    const [word] = words;
    return word.slice(0, 2).toUpperCase().padEnd(2, word[0]?.toUpperCase() ?? "•");
  }

  const first = words[0][0] ?? "";
  const last = words[words.length - 1][0] ?? "";
  const initials = `${first}${last}`.trim();
  return initials ? initials.toUpperCase() : "•";
};

const hashSeed = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export type AvatarOptions = {
  initials?: string;
  palette?: [string, string];
};

export const createInitialsAvatar = (seed: string, options: AvatarOptions = {}) => {
  const initials = (options.initials ?? initialsFromName(seed)).slice(0, 2) || "•";
  const paletteIndex = hashSeed(seed) % gradientPalette.length;
  const [from, to] = options.palette ?? gradientPalette[paletteIndex];
  const gradientId = `g${hashSeed(`${seed}-${from}-${to}`) % 1_000_000}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${initials}">\n  <defs>\n    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" stop-color="${from}" />\n      <stop offset="100%" stop-color="${to}" />\n    </linearGradient>\n  </defs>\n  <rect width="96" height="96" rx="48" fill="url(#${gradientId})" />\n  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="'Inter', 'Segoe UI', sans-serif" font-size="34" font-weight="600" fill="white">${initials}</text>\n</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const getInitials = (name: string) => initialsFromName(name);
