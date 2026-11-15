"use client";

import { Play, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArchiveButton } from "@/components/ArchiveButton";
import { TrackList } from "@/components/TrackList";
import { usePlayer } from "@/context/PlayerContext";
import { getCollection, getCollectionTracks } from "@/data/tracks";
import { formatDuration } from "@/lib/format";
import type { Section } from "@/types/music";

interface TapeCollectionProps {
  onNavigate: (section: Section) => void;
}

export function TapeCollection({ onNavigate }: TapeCollectionProps) {
  const collection = getCollection("tape");
  const tracks = getCollectionTracks("tape");
  const track = tracks[0];
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
        <span className="text-paper/80">Archive object 001</span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
        <motion.div
          className="relative mx-auto w-full max-w-[470px]"
          initial={{ opacity: 0, scale: 1.02, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative aspect-square border border-line/80 bg-ink-2 p-3 shadow-[0_50px_120px_-50px_rgba(0,0,0,1)]">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={track.artwork}
                alt="A worn cassette tape with a faded blank label"
                fill
                priority
                sizes="(min-width: 1024px) 470px, 85vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/30 via-transparent to-transparent" />
              <div className="absolute inset-0 film-grain opacity-[0.14] mix-blend-overlay" />
            </div>
            <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-highlight/50" />
            <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-highlight/50" />
            <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-highlight/50" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-highlight/50" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
            <span>Archive object / 001</span>
            <span>Side A / 22:22</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            <span className="text-highlight">Collection 03</span>
            <span className="h-px w-5 bg-line" aria-hidden="true" />
            <span>Archive object</span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(3rem,5.6vw,5.6rem)] leading-[0.9] text-paper">
            Let Down,
            <br />
            <span className="italic text-highlight">The Tape</span>
          </h1>

          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted">
            {collection.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
            <span>01 recording</span>
            <span>{formatDuration(collection.runtimeSeconds)}</span>
            <span>One continuous tape</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <ArchiveButton variant="primary" onClick={() => playCollection("tape")}>
              <Play className="h-3.5 w-3.5" fill="currentColor" />
              Play the tape
            </ArchiveButton>
            <ArchiveButton variant="outline" onClick={() => shuffleCollection("tape")}>
              <Shuffle className="h-3.5 w-3.5" strokeWidth={1.6} />
              Shuffle
            </ArchiveButton>
          </div>

          <div className="mt-9 max-w-md border-t border-line pt-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
              Tape notes / recorded as one
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-faint">
              The complete tape is a single archival object, kept outside the two collections
              it holds together. It plays continuously and can be started independently of
              every other recording in the archive.
            </p>
          </div>
        </motion.div>
      </div>

      <TrackList collection={collection} tracks={tracks} />
    </div>
  );
}
