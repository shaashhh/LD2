"use client";

import { GripVertical, ListMusic, Play, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
} from "motion/react";
import { Artwork } from "@/components/Artwork";
import { Equalizer } from "@/components/Equalizer";
import { usePlayer } from "@/context/PlayerContext";
import { getCollection } from "@/data/tracks";
import { useLockBodyScroll, useMediaQuery } from "@/hooks/useMediaQuery";
import { formatDuration, formatIndex } from "@/lib/format";
import type { Track } from "@/types/music";

export function QueuePanel() {
  const {
    isQueueOpen,
    setQueueOpen,
    queue,
    currentIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playAll,
    playFromQueue,
    removeFromQueue,
    reorderUpcoming,
    clearQueue,
  } = usePlayer();

  const isMobile = useMediaQuery("(max-width: 767px)");
  useLockBodyScroll(isQueueOpen && isMobile);

  const upcomingTracks = queue.slice(currentIndex + 1);
  const currentCollection = currentTrack
    ? getCollection(currentTrack.collectionId).title
    : null;

  return (
    <AnimatePresence>
      {isQueueOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close playback queue"
            onClick={() => setQueueOpen(false)}
            className="fixed inset-0 z-[109] bg-black/65 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.aside
            role="dialog"
            aria-modal={isMobile ? true : undefined}
            aria-label="Playback queue"
            className="fixed bottom-[var(--player-h)] right-0 top-0 z-[110] flex w-full max-w-[420px] flex-col border-l border-line bg-ink-2 md:w-[380px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-5">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                  Playback queue / Side A
                </p>
                <h2 className="mt-1 font-display text-[30px] leading-none text-paper">
                  Your Queue
                </h2>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                  {String(queue.length).padStart(2, "0")} recordings /{" "}
                  {String(upcomingTracks.length).padStart(2, "0")} upcoming
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQueueOpen(false)}
                aria-label="Close queue"
                className="flex h-9 w-9 shrink-0 items-center justify-center text-muted transition-colors hover:text-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="border-b border-line px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-burgundy-bright">
                    Now playing
                  </span>
                  {currentTrack && isPlaying ? <Equalizer active /> : null}
                </div>

                {currentTrack ? (
                  <div className="mt-3 flex gap-3">
                    <Artwork
                      src={currentTrack.artwork}
                      alt=""
                      sizes="56px"
                      className="h-14 w-14 shrink-0 border border-line/60"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] leading-snug text-paper">
                        {currentTrack.title}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                        {currentCollection}
                      </p>
                      <p className="mt-1 font-mono text-[9px] tabular-nums text-faint">
                        {formatDuration(currentTime)} / {formatDuration(duration)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-[12px] leading-relaxed text-faint">
                    Nothing playing. Choose a recording to begin.
                  </p>
                )}
              </div>

              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                    Upcoming / {String(upcomingTracks.length).padStart(2, "0")}
                  </span>
                  {queue.length > 0 ? (
                    <button
                      type="button"
                      onClick={clearQueue}
                      className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint transition-colors hover:text-paper"
                    >
                      Clear queue
                    </button>
                  ) : null}
                </div>

                {upcomingTracks.length > 0 ? (
                  <Reorder.Group
                    axis="y"
                    values={upcomingTracks}
                    onReorder={(items) => reorderUpcoming(items.map((item) => item.id))}
                    className="mt-1"
                  >
                    {upcomingTracks.map((track, index) => (
                      <QueueRow
                        key={track.id}
                        track={track}
                        index={index}
                        absoluteIndex={currentIndex + 1 + index}
                        onPlay={playFromQueue}
                        onRemove={removeFromQueue}
                      />
                    ))}
                  </Reorder.Group>
                ) : (
                  <div className="py-10 text-center">
                    <ListMusic
                      className="mx-auto h-5 w-5 text-faint/70"
                      strokeWidth={1.3}
                    />
                    <p className="mt-4 font-display text-[22px] italic text-muted">
                      {currentTrack ? "Nothing else waiting." : "Nothing in the queue."}
                    </p>
                    <p className="mt-1 text-[11px] text-faint">
                      {currentTrack
                        ? "This is the last recording in the queue."
                        : "Choose a recording to begin."}
                    </p>
                    <button
                      type="button"
                      onClick={playAll}
                      className="mt-5 inline-flex h-9 items-center gap-2 border border-line px-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-highlight hover:text-paper"
                    >
                      <Play className="h-3 w-3" fill="currentColor" />
                      Play the complete archive
                    </button>
                  </div>
                )}
              </div>
            </div>

            <footer className="border-t border-line px-5 py-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                Drag the handle to reorder upcoming recordings
              </p>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function QueueRow({
  track,
  index,
  absoluteIndex,
  onPlay,
  onRemove,
}: {
  track: Track;
  index: number;
  absoluteIndex: number;
  onPlay: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  const controls = useDragControls();
  const collection = getCollection(track.collectionId);

  return (
    <Reorder.Item
      value={track}
      dragListener={false}
      dragControls={controls}
      className="group flex items-center gap-2 border-b border-line/60 bg-ink-2 py-2.5"
      whileDrag={{ backgroundColor: "#242321", zIndex: 2 }}
    >
      <span className="w-5 shrink-0 font-mono text-[9px] tabular-nums text-faint">
        {formatIndex(index + 1)}
      </span>

      <button
        type="button"
        onClick={() => onPlay(absoluteIndex)}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
      >
        <Artwork
          src={track.artwork}
          alt=""
          sizes="36px"
          className="h-9 w-9 shrink-0 border border-line/50"
        />
        <span className="min-w-0">
          <span className="block truncate text-[12px] leading-snug text-paper/85 transition-colors group-hover:text-paper">
            {track.title}
          </span>
          <span className="block truncate font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
            {collection.title}
          </span>
        </span>
      </button>

      <span className="hidden font-mono text-[9px] tabular-nums text-faint sm:block">
        {formatDuration(track.durationSeconds)}
      </span>

      <button
        type="button"
        onClick={() => onRemove(absoluteIndex)}
        aria-label={`Remove ${track.title} from queue`}
        className="flex h-7 w-6 items-center justify-center text-faint transition-colors hover:text-paper"
      >
        <X className="h-3 w-3" />
      </button>

      <button
        type="button"
        onPointerDown={(event) => controls.start(event)}
        aria-label={`Reorder ${track.title}`}
        className="flex h-7 w-5 cursor-grab touch-none items-center justify-center text-faint/70 transition-colors hover:text-paper active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
    </Reorder.Item>
  );
}
