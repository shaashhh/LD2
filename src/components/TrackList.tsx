"use client";

import { motion } from "motion/react";
import { TrackRow } from "@/components/TrackRow";
import { usePlayer } from "@/context/PlayerContext";
import type { Collection, Track } from "@/types/music";

interface TrackListProps {
  collection: Collection;
  tracks: Track[];
}

export function TrackList({ collection, tracks }: TrackListProps) {
  const { currentTrack, isPlaying, selection } = usePlayer();

  return (
    <section className="mt-10 md:mt-12" aria-label={`Recordings in ${collection.title}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
          <span>Recording index</span>
          <span className="h-px w-6 bg-line" aria-hidden="true" />
          <span>{tracks.length} entries</span>
        </div>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-faint sm:block">
          Select □ for a custom queue
        </span>
      </div>

      <div className="hidden items-center gap-x-4 border-b border-line/70 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint md:grid md:grid-cols-[26px_26px_48px_minmax(0,1fr)_56px_32px]">
        <span />
        <span className="text-right">No.</span>
        <span />
        <span>Recording</span>
        <span className="text-right">Time</span>
        <span />
      </div>

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
      >
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index + 1}
            isCurrent={currentTrack?.id === track.id}
            isPlaying={isPlaying}
            isSelected={selection.includes(track.id)}
          />
        ))}
      </motion.ol>
    </section>
  );
}
