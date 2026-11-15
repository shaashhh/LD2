"use client";

import {
  ChevronDown,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { ProgressBar } from "@/components/ProgressBar";
import { usePlayer } from "@/context/PlayerContext";
import { getCollection } from "@/data/tracks";
import { useLockBodyScroll, useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";

const RATES = [0.75, 1, 1.25, 1.5];

export function NowPlaying() {
  const {
    isNowPlayingOpen,
    setNowPlayingOpen,
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    shuffle,
    repeat,
    playbackRate,
    queue,
    currentIndex,
    togglePlay,
    next,
    previous,
    toggleShuffle,
    cycleRepeat,
    seek,
    setQueueOpen,
    setPlaybackRate,
  } = usePlayer();

  const isMobile = useMediaQuery("(max-width: 767px)");
  useLockBodyScroll(isNowPlayingOpen && isMobile);

  const collection = currentTrack ? getCollection(currentTrack.collectionId) : null;
  const upcoming = Math.max(0, queue.length - currentIndex - 1);

  const cycleRate = () => {
    const index = RATES.indexOf(playbackRate);
    setPlaybackRate(RATES[(index + 1) % RATES.length]);
  };

  return (
    <AnimatePresence>
      {isNowPlayingOpen ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Now playing"
          className="fixed inset-0 z-[120] flex flex-col bg-[#0f0f0e] md:hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(113,59,67,0.14),transparent_58%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 film-grain opacity-[0.05]"
            aria-hidden="true"
          />

          <div className="relative flex min-h-0 flex-1 flex-col px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3">
            <header className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setNowPlayingOpen(false)}
                aria-label="Close now playing"
                className="-ml-2 flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-paper"
              >
                <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <div className="text-center">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-faint">
                  Now playing
                </p>
                <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.16em] text-faint/70">
                  Side A / Archival copy
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQueueOpen(true)}
                aria-label="Open playback queue"
                className="relative -mr-2 flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-paper"
              >
                <ListMusic className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {upcoming > 0 ? (
                  <span className="absolute right-1 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center bg-burgundy px-0.5 font-mono text-[8px] text-paper">
                    {upcoming}
                  </span>
                ) : null}
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-4">
              <div className="mx-auto w-full max-w-[360px]">
                <div className="mx-auto w-[min(78vw,42svh,340px)]">
                  <div className="relative aspect-square border border-line/80 bg-ink-2 p-2">
                    <div className="relative h-full w-full overflow-hidden">
                      {currentTrack ? (
                        <Image
                          src={currentTrack.artwork}
                          alt={`Artwork for ${currentTrack.title}`}
                          fill
                          priority
                          sizes="(max-width: 767px) 82vw, 340px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-display text-3xl text-faint">
                          LD
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-night/25 via-transparent to-transparent" />
                      <div className="absolute inset-0 film-grain opacity-[0.12] mix-blend-overlay" />
                    </div>
                    <span className="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-highlight/50" />
                    <span className="absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-highlight/50" />
                    <span className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-highlight/50" />
                    <span className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-highlight/50" />
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <h2 className="font-display text-[30px] leading-[1.05] text-paper">
                    {currentTrack?.title ?? "Nothing playing"}
                  </h2>
                  <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
                    {collection?.title ?? "The Archive"}
                  </p>
                </div>

                <div className="mt-5">
                  <ProgressBar
                    compact
                    trackId={currentTrack?.id ?? null}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={seek}
                  />
                  <div className="mt-1 flex items-center justify-between font-mono text-[9px] tabular-nums text-faint">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{currentTrack ? formatDuration(duration) : "--:--"}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6">
                  <MobileControl
                    label={shuffle ? "Shuffle on" : "Shuffle off"}
                    active={shuffle}
                    onClick={toggleShuffle}
                  >
                    <Shuffle className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </MobileControl>
                  <button
                    type="button"
                    onClick={previous}
                    aria-label="Previous recording"
                    className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-paper"
                  >
                    <SkipBack className="h-[22px] w-[22px]" strokeWidth={1.4} />
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-line bg-ink-3 text-paper transition-colors hover:border-highlight"
                  >
                    {isLoading ? (
                      <span className="spin-slow h-6 w-6 rounded-full border border-highlight/25 border-t-highlight" />
                    ) : isPlaying ? (
                      <Pause className="h-6 w-6" fill="currentColor" />
                    ) : (
                      <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next recording"
                    className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-paper"
                  >
                    <SkipForward className="h-[22px] w-[22px]" strokeWidth={1.4} />
                  </button>
                  <MobileControl
                    label={
                      repeat === "one"
                        ? "Repeat one"
                        : repeat === "all"
                          ? "Repeat all"
                          : "Repeat off"
                    }
                    active={repeat !== "off"}
                    onClick={cycleRepeat}
                  >
                    {repeat === "one" ? (
                      <Repeat1 className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    ) : (
                      <Repeat className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    )}
                  </MobileControl>
                </div>

                <div className="mt-5 flex items-center justify-center gap-7">
                  <button
                    type="button"
                    onClick={cycleRate}
                    aria-label="Change playback speed"
                    className="font-mono text-[10px] tabular-nums text-muted transition-colors hover:text-paper"
                  >
                    {playbackRate}×
                  </button>
                  <button
                    type="button"
                    onClick={() => setQueueOpen(true)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper"
                  >
                    <ListMusic className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Queue {String(upcoming).padStart(2, "0")}
                  </button>
                </div>

                <p className="mt-5 text-center font-mono text-[7px] uppercase tracking-[0.16em] text-faint/70">
                  {currentTrack ? `${currentTrack.identifier} · Archival copy` : "LDA / 001"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MobileControl({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "relative flex h-10 w-9 items-center justify-center transition-colors",
        active ? "text-paper" : "text-muted hover:text-paper",
      )}
    >
      {children}
      {active ? (
        <span className="absolute -bottom-0.5 left-1/2 h-[2px] w-3 -translate-x-1/2 bg-burgundy-bright" />
      ) : null}
    </button>
  );
}
