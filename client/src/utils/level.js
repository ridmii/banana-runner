export function computeLevel(bananas) {
  if (bananas >= 125) return { level: 3, nextAt: null };
  if (bananas >= 75) return { level: 2, nextAt: 125 };
  if (bananas >= 25) return { level: 1, nextAt: 75 };
  return { level: 0, nextAt: 25 };
}
