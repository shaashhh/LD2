import type { Track } from "@/types/music";

/**
 * Audio can be served from the bundled public folder (default) or from an
 * external, authorised host that mirrors the public/audio folder, so the same
 * <folder>/<file> structure sits directly under the base URL. Set
 * NEXT_PUBLIC_AUDIO_BASE_URL in .env.local to switch.
 *
 * Note: the browser must still be able to reach the URL. A base URL is not
 * DRM — do not describe externally hosted audio as private.
 */
const configuredBase = process.env.NEXT_PUBLIC_AUDIO_BASE_URL?.trim() ?? "";

function normalizeBase(base: string): string {
  return base.replace(/\/+$/, "");
}

/** Relative path inside the public folder, e.g. "performances/…​.mp3". */
export function getAudioPath(track: Track): string {
  return `${track.audioFolder}/${track.audioFile}`;
}

/** The URL handed to the single HTML5 audio element. */
export function getAudioSrc(track: Track): string {
  const path = getAudioPath(track);
  const base = normalizeBase(configuredBase);
  return base ? `${base}/${path}` : `/audio/${path}`;
}

/** Human-readable location used in the missing-audio notice and README. */
export function getAudioLocation(track: Track): string {
  const base = normalizeBase(configuredBase);
  const path = getAudioPath(track);
  return base ? `${base}/${path}` : `public/audio/${path}`;
}

export function hasExternalAudioBase(): boolean {
  return configuredBase.length > 0;
}
