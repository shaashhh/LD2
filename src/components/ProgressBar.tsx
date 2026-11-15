"use client";

import { useMemo, useRef, useState } from "react";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/cn";
import { getWaveform } from "@/lib/waveform";

interface ProgressBarProps {
  trackId: string | null;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  compact?: boolean;
  className?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ProgressBar({
  trackId,
  currentTime,
  duration,
  onSeek,
  compact = false,
  className,
}: ProgressBarProps) {
  const barCount = compact ? 58 : 88;
  const bars = useMemo(
    () => getWaveform(trackId ?? "the-let-down-archive", barCount),
    [trackId, barCount],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [hoverState, setHoverState] = useState<{
    trackId: string | null;
    x: number;
    time: number;
  } | null>(null);

  const progress = duration > 0 ? clamp(currentTime / duration, 0, 1) : 0;
  const hover = hoverState && hoverState.trackId === trackId ? hoverState : null;

  const ratioFromClientX = (clientX: number): number => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  };

  const updateHover = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = ratioFromClientX(clientX);
    setHoverState({
      trackId,
      x: clamp(clientX - rect.left, 18, rect.width - 18),
      time: ratio * duration,
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    const ratio = ratioFromClientX(event.clientX);
    onSeek(ratio * duration);
    updateHover(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    updateHover(event.clientX);
    if (draggingRef.current) {
      const ratio = ratioFromClientX(event.clientX);
      onSeek(ratio * duration);
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    let next: number | null = null;
    if (event.key === "ArrowLeft") next = currentTime - 5;
    if (event.key === "ArrowRight") next = currentTime + 5;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = duration;
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    onSeek(clamp(next, 0, duration));
  };

  return (
    <div className={cn("group/progress relative w-full select-none", className)}>
      {hover && duration > 0 ? (
        <div
          className="pointer-events-none absolute -top-8 z-10 -translate-x-1/2 border border-line bg-ink-2 px-2 py-1 font-mono text-[10px] tabular-nums text-paper shadow-lg"
          style={{ left: hover.x }}
          aria-hidden="true"
        >
          {formatDuration(hover.time)}
        </div>
      ) : null}

      <div
        ref={containerRef}
        role="slider"
        tabIndex={duration > 0 ? 0 : -1}
        aria-label="Seek through the recording"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={formatDuration(currentTime)}
        aria-disabled={duration <= 0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          if (!draggingRef.current) setHoverState(null);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex w-full touch-none items-center gap-[2px] outline-none",
          compact ? "h-10" : "h-7",
          duration > 0 ? "cursor-pointer" : "cursor-default",
        )}
      >
        {bars.map((height, index) => {
          const played = (index + 0.5) / bars.length <= progress;
          return (
            <span
              key={index}
              className={cn(
                "min-w-px flex-1 transition-colors duration-300",
                played
                  ? "bg-burgundy-bright"
                  : "bg-line group-hover/progress:bg-[#4b4640]",
              )}
              style={{ height: `${Math.max(8, Math.round(height * 100))}%` }}
            />
          );
        })}

        {hover && duration > 0 ? (
          <span
            className="pointer-events-none absolute inset-y-0 w-px bg-highlight/40"
            style={{ left: hover.x }}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}
