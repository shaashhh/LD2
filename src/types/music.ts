export type CollectionId = "performances" | "variations" | "tape";

export type Section = "home" | CollectionId;

export type RepeatMode = "off" | "all" | "one";

export interface Collection {
  id: CollectionId;
  /** Two-digit catalogue index, e.g. "01". */
  index: string;
  title: string;
  /** Uppercase label used in metadata rows. */
  label: string;
  description: string;
  recordingCount: number;
  runtimeSeconds: number;
  /** Wide 21:9 banner artwork. */
  artwork: string;
  /** Archive-side label, e.g. "SIDE A". */
  side: string;
  /** Shown on the collection header. */
  archiveNote: string;
}

export interface Track {
  /** Stable identifier — never a filename. */
  id: string;
  collectionId: CollectionId;
  /** Position inside its collection, starting at 1. */
  collectionOrder: number;
  /** Position in the complete 15-recording catalogue, starting at 1. */
  catalogueOrder: number;
  title: string;
  /** Small descriptor shown under the title. */
  subtitle: string;
  /** Archive identifier shown in monospace metadata. */
  identifier: string;
  durationSeconds: number;
  artwork: string;
  /** Clean filename expected inside the collection's audio folder. */
  audioFile: string;
  /** Folder beneath public/audio. */
  audioFolder: string;
}

export interface PlaybackError {
  trackId: string;
  title: string;
  filename: string;
  folder: string;
  message: string;
}
