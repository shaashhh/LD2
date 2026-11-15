"use client";

import { Play, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArchiveButton } from "@/components/ArchiveButton";
import { TrackList } from "@/components/TrackList";
import { usePlayer } from "@/context/PlayerContext";
import { getCollection, getCollectionTracks } from "@/data/tracks";
import { formatDuration } from "@/lib/format";
import type { CollectionId, Section } from "@/types/music";

interface CollectionPageProps {
  collectionId: Extract<CollectionId, "performances" | "variations">;
  onNavigate: (section: Section) => void;
}

export function CollectionPage({ collectionId, onNavigate }: CollectionPageProps) {
  const collection = getCollection(collectionId);
  const tracks = getCollectionTracks(collectionId);
  const { playCollection, shuffleCollection } = usePlayer();

  return (
    <div>
      <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="uppercase transition-colors hover:text-paper"
        >
          The Archive
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-paper/80">Collection {collection.index}</span>
      </div>

      <motion.header
        className="mt-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative overflow-hidden border border-line/70 bg-ink-2">
          <div className="relative aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src={collection.artwork}
              alt={`${collection.title} collection artwork`}
              fill
              priority
              sizes="(min-width: 1500px) 1200px, (min-width: 768px) 80vw, 100vw"
              className="object-cover saturate-[0.82]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 font-mono text-[8px] uppercase tracking-[0.18em] text-paper/70 sm:p-7 sm:text-[9px]">
              <span>
                Collection {collection.index} / {collection.label}
              </span>
              <span>{collection.side}</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
              <h1 className="font-display text-[clamp(2.5rem,5.8vw,6rem)] leading-[0.9] text-paper">
                {collection.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[8px] uppercase tracking-[0.16em] text-muted sm:text-[9px]">
                <span>{String(collection.recordingCount).padStart(2, "0")} recordings</span>
                <span>{formatDuration(collection.runtimeSeconds)}</span>
                <span className="hidden sm:inline">{collection.archiveNote}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 border-b border-line pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="max-w-2xl text-[13px] leading-relaxed text-muted sm:text-[14px]">
              {collection.description}
            </p>
            <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
              Archival copies / approximate durations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ArchiveButton variant="primary" onClick={() => playCollection(collection.id)}>
              <Play className="h-3.5 w-3.5" fill="currentColor" />
              Play all
            </ArchiveButton>
            <ArchiveButton
              variant="outline"
              onClick={() => shuffleCollection(collection.id)}
            >
              <Shuffle className="h-3.5 w-3.5" strokeWidth={1.6} />
              Shuffle
            </ArchiveButton>
          </div>
        </div>
      </motion.header>

      <TrackList collection={collection} tracks={tracks} />
    </div>
  );
}
