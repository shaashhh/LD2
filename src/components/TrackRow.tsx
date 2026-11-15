"use client";

import { Check, Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Equalizer } from "@/components/Equalizer";
import { TrackMenu } from "@/components/TrackMenu";
import { usePlayer } from "@/context/PlayerContext";
import { cn } from "@/lib/cn";
import { formatDuration, formatIndex } from "@/lib/format";
import type { Track } from "@/types/music";

interface TrackRowProps {
  track: Track;
  index: number;
  isCurrent: boolean;
  isPlaying: boolean;
  isSelected: boolean;
}

export const trackRowVariants = {
  hidden: { opacity: 0, y: 9 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function TrackRow({ track, index, isCurrent, isPlaying, isSelected }: TrackRowProps) {
  const { toggleSelection, playTrack, togglePlay } = usePlayer();

  const handlePlay = () => {
    if (isCurrent) togglePlay();
    else playTrack(track);
  };

  return (
    <motion.li
      variants={trackRowVariants}
      className={cn(
        "group relative grid grid-cols-[32px_40px_minmax(0,1fr)_40px_32px] items-center gap-x-2.5 border-b border-line/60 py-2.5 transition-colors duration-300 md:grid-cols-[26px_26px_48px_minmax(0,1fr)_56px_32px] md:gap-x-4 md:py-3",
        isSelected ? "bg-burgundy/[0.07]" : "hover:bg-paper/[0.025]",
      )}
    >
      {isSelected ? (
        <span className="absolute inset-y-2 left-0 w-[2px] bg-burgundy-bright" aria-hidden="true" />
      ) : null}

      <button
        type="button"
        onClick={() => toggleSelection(track.id)}
        aria-pressed={isSelected}
        aria-label={
          isSelected
            ? `Remove ${track.title} from selection`
            : `Select ${track.title} for a custom queue`
        }
        className="flex h-8 w-8 items-center justify-center md:w-[26px]"
      >
        <span
          className={cn(
            "flex h-3.5 w-3.5 items-center justify-center border transition-colors duration-200",
            isSelected
              ? "border-burgundy-bright bg-burgundy"
              : "border-line bg-transparent group-hover:border-highlight",
          )}
        >
          {isSelected ? (
            <Check className="h-2.5 w-2.5 text-paper" strokeWidth={2.5} />
          ) : null}
        </span>
      </button>

      <span className="hidden text-right font-mono text-[10px] tabular-nums text-faint md:block">
        {formatIndex(index)}
      </span>

      <button
        type="button"
        onClick={handlePlay}
        tabIndex={-1}
        aria-hidden="true"
        className="relative h-10 w-10 shrink-0 overflow-hidden border border-line/50 bg-ink-3 md:h-12 md:w-12"
      >
        <Image
          src={track.artwork}
          alt=""
          fill
          sizes="48px"
          className="object-cover saturate-[0.8]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {isCurrent && isPlaying ? (
            <Equalizer active />
          ) : isCurrent ? (
            <Pause className="h-3.5 w-3.5 text-paper" fill="currentColor" />
          ) : (
            <Play className="h-3.5 w-3.5 text-paper" fill="currentColor" />
          )}
        </span>
        {isCurrent ? (
          <span className="absolute inset-0 ring-1 ring-inset ring-burgundy-bright/70" />
        ) : null}
      </button>

      <button
        type="button"
        onClick={handlePlay}
        aria-label={`${isCurrent && isPlaying ? "Pause" : "Play"} ${track.title}`}
        className="min-w-0 text-left"
      >
        <span className="flex items-center gap-2">
          {isCurrent ? <Equalizer active={isPlaying} /> : null}
          <span
            className={cn(
              "truncate text-[14px] leading-snug transition-colors duration-300 md:text-[15px]",
              isCurrent ? "text-paper" : "text-paper/80 group-hover:text-paper",
            )}
          >
            {track.title}
          </span>
        </span>
        <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.08em] text-faint">
          {track.subtitle}
          <span className="hidden sm:inline"> · {track.identifier}</span>
        </span>
      </button>

      <span className="text-right font-mono text-[10px] tabular-nums text-muted">
        {formatDuration(track.durationSeconds)}
      </span>

      <TrackMenu track={track} />
    </motion.li>
  );
}
