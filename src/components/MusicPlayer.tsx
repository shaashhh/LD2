"use client";

import {
  Check,
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
import { useState } from "react";
import { Equalizer } from "@/components/Equalizer";
import { ProgressBar } from "@/components/ProgressBar";
import { VolumeControl } from "@/components/VolumeControl";
import { usePlayer } from "@/context/PlayerContext";
import { getCollection } from "@/data/tracks";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import type { CollectionId } from "@/types/music";

interface MusicPlayerProps {
  onNavigate: (section: CollectionId) => void;
}

export function MusicPlayer({ onNavigate }: MusicPlayerProps) {
  const {
    queue,
    currentIndex,
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    error,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    toggleShuffle,
    cycleRepeat,
    seek,
    isQueueOpen,
    setQueueOpen,
    setNowPlayingOpen,
  } = usePlayer();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const upcomingCount = Math.max(0, queue.length - currentIndex - 1);
  const collectionTitle = currentTrack
    ? getCollection(currentTrack.collectionId).title
    : "The Archive";
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  const handleOpenTrack = () => {
    if (!currentTrack) return;
    if (isMobile) setNowPlayingOpen(true);
    else onNavigate(currentTrack.collectionId);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 h-[var(--player-h)] border-t border-line bg-[#141312] pb-[env(safe-area-inset-bottom)]">
      {/* Mobile hairline progress */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-line/50 md:hidden" aria-hidden="true">
        <div
          className="h-full bg-burgundy-bright transition-[width] duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Mobile bar */}
      <div className="mx-auto flex h-full max-w-[1800px] items-center gap-2 px-3 md:hidden">
        <button
          type="button"
          onClick={handleOpenTrack}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          aria-label={currentTrack ? `Open now playing: ${currentTrack.title}` : "Nothing playing"}
        >
          <span className="relative h-10 w-10 shrink-0 overflow-hidden border border-line/60 bg-ink-3">
            {currentTrack ? (
              <Image
                src={currentTrack.artwork}
                alt=""
                fill
                sizes="40px"
                className="object-cover saturate-[0.8]"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-xs text-faint">
                LD
              </span>
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12px] leading-tight text-paper">
              {currentTrack?.title ?? "Nothing playing"}
            </span>
            <span className="mt-0.5 block truncate font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
              {error ? "UNAVAILABLE" : collectionTitle}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-ink-3 text-paper transition-colors hover:border-highlight"
        >
          {isLoading ? (
            <span className="spin-slow h-4 w-4 rounded-full border border-highlight/25 border-t-highlight" />
          ) : isPlaying ? (
            <Pause className="h-[18px] w-[18px]" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-[18px] w-[18px]" fill="currentColor" />
          )}
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next recording"
          className="flex h-10 w-9 shrink-0 items-center justify-center text-muted transition-colors hover:text-paper"
        >
          <SkipForward className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Desktop bar */}
      <div className="mx-auto hidden h-full max-w-[1800px] grid-cols-[minmax(0,0.92fr)_minmax(0,1.6fr)_minmax(0,0.92fr)] items-center gap-6 px-5 md:grid lg:px-7">
        <button
          type="button"
          onClick={handleOpenTrack}
          className="group flex min-w-0 items-center gap-3 text-left"
          aria-label={currentTrack ? `Open ${collectionTitle}` : "Nothing playing"}
        >
          <span className="relative h-14 w-14 shrink-0 overflow-hidden border border-line/60 bg-ink-3">
            <AnimatePresence initial={false}>
              {currentTrack ? (
                <motion.span
                  key={currentTrack.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65 }}
                >
                  <Image
                    src={currentTrack.artwork}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover saturate-[0.8]"
                  />
                </motion.span>
              ) : (
                <span className="flex h-full w-full items-center justify-center font-display text-sm text-faint">
                  LD
                </span>
              )}
            </AnimatePresence>
            {isPlaying && currentTrack ? (
              <span className="absolute bottom-1 left-1">
                <Equalizer active />
              </span>
            ) : null}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] leading-tight text-paper">
              {currentTrack?.title ?? "Nothing playing"}
            </span>
            <span
              className={cn(
                "mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.14em]",
                error ? "text-burgundy-bright" : "text-faint",
              )}
            >
              {error ? "UNAVAILABLE / CHECK ARCHIVE" : collectionTitle}
            </span>
          </span>
        </button>

        <div className="flex min-w-0 flex-col justify-center gap-1">
          <div className="flex items-center justify-center gap-2 lg:gap-3">
            <ControlButton
              label={shuffle ? "Shuffle on" : "Shuffle off"}
              active={shuffle}
              onClick={toggleShuffle}
            >
              <Shuffle className="h-4 w-4" strokeWidth={1.6} />
            </ControlButton>
            <ControlButton label="Previous recording" onClick={previous}>
              <SkipBack className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </ControlButton>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="relative mx-1 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink-3 text-paper transition-colors duration-300 hover:border-highlight hover:bg-[#2a2825]"
            >
              {isLoading ? (
                <span className="spin-slow h-[18px] w-[18px] rounded-full border border-highlight/25 border-t-highlight" />
              ) : isPlaying ? (
                <Pause className="h-[18px] w-[18px]" fill="currentColor" />
              ) : (
                <Play className="ml-0.5 h-[18px] w-[18px]" fill="currentColor" />
              )}
            </button>

            <ControlButton label="Next recording" onClick={next}>
              <SkipForward className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </ControlButton>
            <ControlButton
              label={
                repeat === "one"
                  ? "Repeat one recording"
                  : repeat === "all"
                    ? "Repeat all recordings"
                    : "Repeat off"
              }
              active={repeat !== "off"}
              onClick={cycleRepeat}
            >
              {repeat === "one" ? (
                <Repeat1 className="h-4 w-4" strokeWidth={1.6} />
              ) : (
                <Repeat className="h-4 w-4" strokeWidth={1.6} />
              )}
            </ControlButton>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-right font-mono text-[10px] tabular-nums text-faint">
              {formatDuration(currentTime)}
            </span>
            <ProgressBar
              trackId={currentTrack?.id ?? null}
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
              className="flex-1"
            />
            <span className="w-10 shrink-0 font-mono text-[10px] tabular-nums text-faint">
              {currentTrack ? formatDuration(duration) : "--:--"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 lg:gap-3">
          <SpeedMenu />
          <VolumeControl />
          <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setQueueOpen(!isQueueOpen)}
            aria-label="Open playback queue"
            aria-expanded={isQueueOpen}
            className={cn(
              "flex h-9 items-center gap-1.5 px-1.5 text-muted transition-colors hover:text-paper",
              isQueueOpen && "text-paper",
            )}
          >
            <ListMusic className="h-[18px] w-[18px]" strokeWidth={1.5} />
            <span className="w-3 font-mono text-[10px] tabular-nums">{upcomingCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
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
        "relative flex h-8 w-8 items-center justify-center text-muted transition-colors duration-300 hover:text-paper",
        active && "text-paper",
      )}
    >
      {children}
      {active ? (
        <span className="absolute -bottom-[3px] left-1/2 h-[2px] w-3 -translate-x-1/2 bg-burgundy-bright" />
      ) : null}
    </button>
  );
}

function SpeedMenu() {
  const { playbackRate, setPlaybackRate } = usePlayer();
  const [open, setOpen] = useState(false);
  const rates = [0.75, 1, 1.25, 1.5];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Playback speed"
        aria-expanded={open}
        className="flex h-8 items-center px-1.5 font-mono text-[10px] text-muted transition-colors hover:text-paper"
      >
        {playbackRate}×
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <button
              type="button"
              aria-label="Close speed menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
              tabIndex={-1}
            />
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full right-0 z-50 mb-3 w-28 border border-line bg-ink-2 py-1 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.9)]"
            >
              <p className="px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                Speed
              </p>
              {rates.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    setPlaybackRate(rate);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-1.5 font-mono text-[11px] transition-colors hover:bg-paper/[0.05]",
                    playbackRate === rate ? "text-paper" : "text-muted",
                  )}
                >
                  {rate}×
                  {playbackRate === rate ? (
                    <Check className="h-3 w-3 text-burgundy-bright" />
                  ) : null}
                </button>
              ))}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
