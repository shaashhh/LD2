const PREFIX = "lda.v1.";

export const STORAGE_KEYS = {
  volume: `${PREFIX}volume`,
  muted: `${PREFIX}muted`,
  shuffle: `${PREFIX}shuffle`,
  repeat: `${PREFIX}repeat`,
  speed: `${PREFIX}speed`,
  lastSection: `${PREFIX}lastSection`,
  lastTrackId: `${PREFIX}lastTrackId`,
  queue: `${PREFIX}queue`,
  visited: `${PREFIX}visited`,
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or disabled (private mode). The archive still works.
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore unavailable storage.
  }
}
