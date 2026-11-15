import type { Collection, CollectionId, Track } from "@/types/music";

export const LANDING_ARTWORK = "/images/landing/landing-artwork.jpg";

/**
 * Catalogue order is canonical: Performances (01–05), Variations (06–14),
 * Let Down, The Tape (15). Queue builders always copy from this array, so
 * shuffle and custom selection can never mutate the archive order.
 *
 * Durations are the archive's stated approximations. The player swaps in the
 * real duration as soon as the audio file reports its metadata.
 */
export const TRACKS: Track[] = [
  // ── COLLECTION 01 · PERFORMANCES ─────────────────────────────────────────
  {
    id: "perf-1995-11-14",
    collectionId: "performances",
    collectionOrder: 1,
    catalogueOrder: 1,
    title: "14 November 1995",
    subtitle: "Live recording",
    identifier: "LDA-P-01",
    durationSeconds: 292,
    artwork: "/images/performances/cover-1995-11-14.jpg",
    audioFile: "1995-11-14_letdown.mp3",
    audioFolder: "performances",
  },
  {
    id: "perf-1996-03-14",
    collectionId: "performances",
    collectionOrder: 2,
    catalogueOrder: 2,
    title: "14 March 1996",
    subtitle: "Live recording",
    identifier: "LDA-P-02",
    durationSeconds: 246,
    artwork: "/images/performances/cover-1996-03-14.jpg",
    audioFile: "1996-03-14letdown.mp3",
    audioFolder: "performances",
  },
  {
    id: "perf-1996-07-26",
    collectionId: "performances",
    collectionOrder: 3,
    catalogueOrder: 3,
    title: "26 July 1996",
    subtitle: "Live recording",
    identifier: "LDA-P-03",
    durationSeconds: 278,
    artwork: "/images/performances/cover-1996-07-26.jpg",
    audioFile: "1996-07-26letdown.mp3",
    audioFolder: "performances",
  },
  {
    id: "perf-1996-08-19",
    collectionId: "performances",
    collectionOrder: 4,
    catalogueOrder: 4,
    title: "19 August 1996",
    subtitle: "Live recording",
    identifier: "LDA-P-04",
    durationSeconds: 264,
    artwork: "/images/performances/cover-1996-08-19.jpg",
    audioFile: "1996-08-19letdown.mp3",
    audioFolder: "performances",
  },
  {
    id: "perf-four-track-demo",
    collectionId: "performances",
    collectionOrder: 5,
    catalogueOrder: 5,
    title: "The Four-Track Demo",
    subtitle: "Four-track demo",
    identifier: "LDA-P-05",
    durationSeconds: 105,
    artwork: "/images/performances/cover-four-track-demo.jpg",
    audioFile: "oknotok_letdown4track.mp3",
    audioFolder: "performances",
  },

  // ── COLLECTION 02 · VARIATIONS ───────────────────────────────────────────
  {
    id: "var-9-1",
    collectionId: "variations",
    collectionOrder: 1,
    catalogueOrder: 6,
    title: "Let Down 9.1",
    subtitle: "Unreleased demo",
    identifier: "LDA-V-01",
    durationSeconds: 296,
    artwork: "/images/variations/cover-9-1.jpg",
    audioFile: "let-down-9-1.mp3",
    audioFolder: "variations",
  },
  {
    id: "var-9-2",
    collectionId: "variations",
    collectionOrder: 2,
    catalogueOrder: 7,
    title: "Let Down 9.2",
    subtitle: "Unreleased demo",
    identifier: "LDA-V-02",
    durationSeconds: 278,
    artwork: "/images/variations/cover-9-2.jpg",
    audioFile: "let-down-9-2.mp3",
    audioFolder: "variations",
  },
  {
    id: "var-9-3",
    collectionId: "variations",
    collectionOrder: 3,
    catalogueOrder: 8,
    title: "Let Down 9.3",
    subtitle: "Unreleased demo · 119 MD",
    identifier: "LDA-V-03",
    durationSeconds: 269,
    artwork: "/images/variations/cover-9-3.jpg",
    audioFile: "let-down-9-3.mp3",
    audioFolder: "variations",
  },
  {
    id: "var-10-1",
    collectionId: "variations",
    collectionOrder: 4,
    catalogueOrder: 9,
    title: "Let Down 10.1",
    subtitle: "Unreleased demo",
    identifier: "LDA-V-04",
    durationSeconds: 301,
    artwork: "/images/variations/cover-10-1.jpg",
    audioFile: "let-down-10-1.mp3",
    audioFolder: "variations",
  },
  {
    id: "var-change-your-life",
    collectionId: "variations",
    collectionOrder: 5,
    catalogueOrder: 10,
    title: "But It Will Change Your Life",
    subtitle: "Alternate interpretation",
    identifier: "LDA-V-05",
    durationSeconds: 317,
    artwork: "/images/variations/cover-but-it-will-change-your-life.jpg",
    audioFile: "but-it-will-change-your-life.mp3",
    audioFolder: "variations",
  },
  {
    id: "var-worse-and-worse",
    collectionId: "variations",
    collectionOrder: 6,
    catalogueOrder: 11,
    title: "The Song Gets Worse and Worse",
    subtitle: "Alternate interpretation",
    identifier: "LDA-V-06",
    durationSeconds: 329,
    artwork: "/images/variations/cover-worse-and-worse.jpg",
    audioFile: "the-song-gets-worse-and-worse.mp3",
    audioFolder: "variations",
  },
  {
    id: "var-galway",
    collectionId: "variations",
    collectionOrder: 7,
    catalogueOrder: 12,
    title: "Galway Version",
    subtitle: "Alternate interpretation · 121 MD",
    identifier: "LDA-V-07",
    durationSeconds: 284,
    artwork: "/images/variations/cover-galway.jpg",
    audioFile: "galway-version.mp3",
    audioFolder: "variations",
  },
  {
    id: "var-final-mix",
    collectionId: "variations",
    collectionOrder: 8,
    catalogueOrder: 13,
    title: "Final Version / 9.1 Demo Mix",
    subtitle: "Final version · demo composite",
    identifier: "LDA-V-08",
    durationSeconds: 352,
    artwork: "/images/variations/cover-final-mix.jpg",
    audioFile: "final-version-9-1-demo-mix.mp3",
    audioFolder: "variations",
  },
  {
    id: "var-choir-orchestral",
    collectionId: "variations",
    collectionOrder: 9,
    catalogueOrder: 14,
    title: "Choir + Orchestral + 9.1",
    subtitle: "Choir & orchestral arrangement",
    identifier: "LDA-V-09",
    durationSeconds: 522,
    artwork: "/images/variations/cover-choir-orchestral.jpg",
    audioFile: "choir-orchestral-9-1.mp3",
    audioFolder: "variations",
  },

  // ── COLLECTION 03 · LET DOWN, THE TAPE ───────────────────────────────────
  {
    id: "tape-complete",
    collectionId: "tape",
    collectionOrder: 1,
    catalogueOrder: 15,
    title: "The Complete Tape",
    subtitle: "One continuous recording",
    identifier: "LDA-T-01",
    durationSeconds: 1342,
    artwork: "/images/let-down-the-tape/cover-complete-tape.jpg",
    audioFile: "all-versions-let-down-radiohead.mp3",
    audioFolder: "let-down-the-tape",
  },
];

type CollectionSeed = Omit<Collection, "recordingCount" | "runtimeSeconds">;

const COLLECTION_SEEDS: CollectionSeed[] = [
  {
    id: "performances",
    index: "01",
    title: "Performances",
    label: "PERFORMANCES",
    description:
      "Fragments of the song as it existed on stage. Different nights, different rooms, different moments.",
    artwork: "/images/performances/banner.jpg",
    side: "SIDE A",
    archiveNote: "LIVE TRANSCRIPTIONS / 1995–1996",
  },
  {
    id: "variations",
    index: "02",
    title: "Variations",
    label: "VARIATIONS",
    description:
      "An unfinished thought, revisited. Demos, alternate arrangements and fragments of something familiar.",
    artwork: "/images/variations/banner.jpg",
    side: "SIDE B",
    archiveNote: "WORKING MATERIAL / DEMOS & MIXES",
  },
  {
    id: "tape",
    index: "03",
    title: "Let Down, The Tape",
    label: "LET DOWN, THE TAPE",
    description: "One continuous recording. Everything, held together on a single tape.",
    artwork: "/images/let-down-the-tape/banner.jpg",
    side: "ARCHIVE OBJECT",
    archiveNote: "SINGLE OBJECT / ONE CONTINUOUS TAPE",
  },
];

export const COLLECTIONS: Collection[] = COLLECTION_SEEDS.map((collection) => {
  const tracks = TRACKS.filter((track) => track.collectionId === collection.id);
  return {
    ...collection,
    recordingCount: tracks.length,
    runtimeSeconds: tracks.reduce((total, track) => total + track.durationSeconds, 0),
  };
});

export const TRACK_BY_ID: ReadonlyMap<string, Track> = new Map(
  TRACKS.map((track) => [track.id, track]),
);

export const COLLECTION_BY_ID: ReadonlyMap<CollectionId, Collection> = new Map(
  COLLECTIONS.map((collection) => [collection.id, collection]),
);

export const TOTAL_RECORDINGS = TRACKS.length;
export const TOTAL_RUNTIME_SECONDS = TRACKS.reduce(
  (total, track) => total + track.durationSeconds,
  0,
);

export function getCollection(id: CollectionId): Collection {
  const collection = COLLECTION_BY_ID.get(id);
  if (!collection) throw new Error(`Unknown collection: ${id}`);
  return collection;
}

export function getCollectionTracks(id: CollectionId): Track[] {
  return TRACKS.filter((track) => track.collectionId === id);
}

export function getTrack(id: string): Track | undefined {
  return TRACK_BY_ID.get(id);
}

export function isCollectionId(value: string): value is CollectionId {
  return COLLECTIONS.some((collection) => collection.id === value);
}
