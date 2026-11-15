"use client";

import { ListMusic } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { COLLECTIONS, TOTAL_RECORDINGS, TOTAL_RUNTIME_SECONDS } from "@/data/tracks";
import { cn } from "@/lib/cn";
import { formatRuntime } from "@/lib/format";
import type { Section } from "@/types/music";

interface ArchiveNavProps {
  section: Section;
  onNavigate: (section: Section) => void;
  onOpenQueue: () => void;
  compact?: boolean;
}

export function ArchiveNav({
  section,
  onNavigate,
  onOpenQueue,
  compact = false,
}: ArchiveNavProps) {
  const { queue, currentIndex, isQueueOpen, selection } = usePlayer();
  const upcoming = Math.max(0, queue.length - currentIndex - 1);

  const itemClass = cn(
    "relative flex w-full items-center gap-3 px-3 text-left transition-colors duration-300",
    compact ? "min-h-12 text-[13px]" : "min-h-11 text-[12px]",
  );

  return (
    <nav aria-label="Archive sections" className="px-3">
      <p className="px-3 pb-2 font-mono text-[8px] uppercase tracking-[0.22em] text-faint">
        Index
      </p>

      <button
        type="button"
        onClick={() => onNavigate("home")}
        aria-current={section === "home" ? "page" : undefined}
        className={cn(
          itemClass,
          section === "home"
            ? "bg-paper/[0.04] text-paper"
            : "text-muted hover:bg-paper/[0.02] hover:text-paper",
        )}
      >
        {section === "home" ? (
          <span className="absolute bottom-1.5 left-0 top-1.5 w-[2px] bg-burgundy-bright" />
        ) : null}
        <span className="w-5 font-mono text-[9px] text-faint">—</span>
        <span className="flex-1">The Archive</span>
      </button>

      <div className="mx-3 my-4 h-px bg-line/70" />
      <p className="px-3 pb-2 font-mono text-[8px] uppercase tracking-[0.22em] text-faint">
        Collections
      </p>

      {COLLECTIONS.map((collection) => {
        const active = section === collection.id;
        return (
          <button
            key={collection.id}
            type="button"
            onClick={() => onNavigate(collection.id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              itemClass,
              active
                ? "bg-paper/[0.04] text-paper"
                : "text-muted hover:bg-paper/[0.02] hover:text-paper",
            )}
          >
            {active ? (
              <span className="absolute bottom-1.5 left-0 top-1.5 w-[2px] bg-burgundy-bright" />
            ) : null}
            <span className="w-5 font-mono text-[9px] text-faint">{collection.index}</span>
            <span className="flex-1 truncate">{collection.title}</span>
            <span className="font-mono text-[8px] tabular-nums text-faint">
              {String(collection.recordingCount).padStart(2, "0")}
            </span>
          </button>
        );
      })}

      <div className="mx-3 my-4 h-px bg-line/70" />

      <button
        type="button"
        onClick={onOpenQueue}
        aria-expanded={isQueueOpen}
        className={cn(
          itemClass,
          isQueueOpen
            ? "bg-paper/[0.04] text-paper"
            : "text-muted hover:bg-paper/[0.02] hover:text-paper",
        )}
      >
        {isQueueOpen ? (
          <span className="absolute bottom-1.5 left-0 top-1.5 w-[2px] bg-burgundy-bright" />
        ) : null}
        <span className="flex w-5 justify-center text-faint">
          <ListMusic className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
        <span className="flex-1">Your Queue</span>
        {upcoming > 0 ? (
          <span className="font-mono text-[8px] tabular-nums text-faint">
            {String(upcoming).padStart(2, "0")}
          </span>
        ) : null}
      </button>

      {selection.length > 0 ? (
        <p className="px-3 pt-4 font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-faint">
          {String(selection.length).padStart(2, "0")} selected for a custom queue
        </p>
      ) : null}
    </nav>
  );
}

export function ArchiveStats() {
  const { selection } = usePlayer();

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.12em]">
        <span className="text-faint">Recordings</span>
        <span className="text-paper/85">{TOTAL_RECORDINGS}</span>
      </div>
      <div className="flex items-baseline justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.12em]">
        <span className="text-faint">Total runtime</span>
        <span className="text-paper/85">{formatRuntime(TOTAL_RUNTIME_SECONDS)}</span>
      </div>
      {selection.length > 0 ? (
        <div className="flex items-baseline justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.12em]">
          <span className="text-faint">Selected</span>
          <span className="text-burgundy-bright">
            {String(selection.length).padStart(2, "0")}
          </span>
        </div>
      ) : null}
      <div className="h-px bg-line/70" />
      <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.16em] text-faint">
        Digital listening archive
        <br />
        Archival copy / No. 001
      </p>
    </div>
  );
}
