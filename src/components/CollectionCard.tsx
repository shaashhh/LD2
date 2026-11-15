"use client";

import { ArrowRight, Play, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArchiveButton } from "@/components/ArchiveButton";
import { usePlayer } from "@/context/PlayerContext";
import { formatDuration } from "@/lib/format";
import type { Collection } from "@/types/music";

interface CollectionCardProps {
  collection: Collection;
  onOpen: (collection: Collection) => void;
  index: number;
}

export function CollectionCard({ collection, onOpen, index }: CollectionCardProps) {
  const { playCollection, shuffleCollection } = usePlayer();

  return (
    <motion.article
      className="group"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.08 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
        <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
          <span className="text-highlight">Collection {collection.index}</span>
          <span className="h-px w-5 bg-line" aria-hidden="true" />
          <span>{collection.side}</span>
        </div>
        <span className="text-right font-mono text-[8px] uppercase tracking-[0.14em] text-faint sm:text-[9px]">
          {String(collection.recordingCount).padStart(2, "0")} recordings /{" "}
          {formatDuration(collection.runtimeSeconds)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpen(collection)}
        aria-label={`Open ${collection.title}`}
        className="relative mt-4 block w-full overflow-hidden border border-line/60 bg-ink-2 text-left"
      >
        <span className="relative block aspect-[16/9] overflow-hidden lg:aspect-[21/9]">
          <Image
            src={collection.artwork}
            alt={`${collection.title} collection artwork`}
            fill
            sizes="(min-width: 1500px) 1200px, (min-width: 768px) 80vw, 100vw"
            className="object-cover saturate-[0.82] transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/5" />
          <span className="absolute inset-0 bg-ink/10 transition-colors duration-700 group-hover:bg-ink/0" />
          <span className="absolute right-4 top-4 font-mono text-[8px] uppercase tracking-[0.16em] text-faint/90 sm:right-6 sm:top-6">
            Archival banner / {collection.index}
          </span>

          <span className="absolute inset-x-0 bottom-0 block p-5 sm:p-8 lg:p-10">
            <span className="flex items-end justify-between gap-6">
              <span className="block max-w-2xl transition-transform duration-700 ease-out group-hover:-translate-y-[3px]">
                <span className="block font-display text-[clamp(2rem,4.6vw,4.4rem)] leading-none text-paper">
                  {collection.title}
                </span>
                <span className="mt-3 block max-w-lg text-[12px] leading-relaxed text-muted sm:text-[14px]">
                  {collection.description}
                </span>
              </span>
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper opacity-0 transition-all duration-500 group-hover:opacity-100 sm:flex">
                <Play className="h-4 w-4" fill="currentColor" />
              </span>
            </span>
          </span>
        </span>
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 font-mono text-[8px] uppercase tracking-[0.13em] text-faint">
          <span className="truncate">{collection.archiveNote}</span>
        </div>
        <div className="flex items-center gap-2">
          <ArchiveButton
            size="sm"
            variant="outline"
            onClick={() => playCollection(collection.id)}
            aria-label={`Play ${collection.title}`}
          >
            <Play className="h-3 w-3" fill="currentColor" />
            <span className="hidden sm:inline">Play collection</span>
            <span className="sm:hidden">Play</span>
          </ArchiveButton>
          <button
            type="button"
            onClick={() => shuffleCollection(collection.id)}
            aria-label={`Shuffle ${collection.title}`}
            className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-highlight hover:text-paper"
          >
            <Shuffle className="h-3.5 w-3.5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={() => onOpen(collection)}
            className="flex h-8 items-center gap-1.5 px-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper"
          >
            <span className="hidden sm:inline">Open</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
