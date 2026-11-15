const cache = new Map<string, number[]>();

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * A deterministic, waveform-shaped set of bar heights for a recording. There is
 * no analyser dependency and no network cost: each track gets a stable shape
 * derived from its id, smoothed so it reads like an analogue waveform.
 */
export function getWaveform(seed: string, barCount = 88): number[] {
  const key = `${seed}:${barCount}`;
  const cached = cache.get(key);
  if (cached) return cached;

  let state = hashString(seed) || 1;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967295;
  };

  const phase = random() * Math.PI * 2;
  const raw = Array.from({ length: barCount }, (_, index) => {
    const position = index / barCount;
    const envelope =
      0.52 +
      0.2 * Math.sin(position * Math.PI * 3.1 + phase) +
      0.14 * Math.sin(position * Math.PI * 7.4 + phase * 1.7) +
      0.08 * Math.sin(position * Math.PI * 13.2 + phase * 0.4);
    const jitter = 0.42 + random() * 0.58;
    return Math.min(1, Math.max(0.14, envelope * jitter));
  });

  // Light smoothing keeps neighbouring bars related rather than noisy.
  const smoothed = raw.map((value, index) => {
    const previous = raw[index - 1] ?? value;
    const next = raw[index + 1] ?? value;
    return Math.min(1, Math.max(0.12, (previous + value * 2 + next) / 4));
  });

  cache.set(key, smoothed);
  return smoothed;
}
