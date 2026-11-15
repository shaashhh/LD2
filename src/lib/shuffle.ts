/**
 * Fisher-Yates shuffle. Always returns a new array so catalogue order is never
 * mutated. Randomness lives in one place so the behaviour is easy to reason about.
 */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Keep everything up to and including the current position intact and shuffle
 * only what comes next. Used when shuffle is enabled mid-playback so the
 * currently playing recording is never replaced.
 */
export function shuffleUpcoming<T>(items: readonly T[], currentIndex: number): T[] {
  if (currentIndex < 0 || currentIndex >= items.length - 1) return [...items];
  const head = items.slice(0, currentIndex + 1);
  const tail = shuffleArray(items.slice(currentIndex + 1));
  return [...head, ...tail];
}
