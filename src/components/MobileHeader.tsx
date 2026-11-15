"use client";

import { ListMusic, Menu } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface MobileHeaderProps {
  onOpenNav: () => void;
  onHome: () => void;
}

export function MobileHeader({ onOpenNav, onHome }: MobileHeaderProps) {
  const { queue, currentIndex, setQueueOpen } = usePlayer();
  const upcoming = Math.max(0, queue.length - currentIndex - 1);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-ink px-2.5 md:hidden">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open archive navigation"
        className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-paper"
      >
        <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={onHome}
        className="flex min-w-0 items-center gap-2"
        aria-label="The Let Down Archive — home"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-line font-mono text-[8px] text-highlight">
          LD
        </span>
        <span className="truncate font-display text-[12px] uppercase tracking-[0.14em] text-paper">
          The Let Down Archive
        </span>
      </button>

      <button
        type="button"
        onClick={() => setQueueOpen(true)}
        aria-label="Open playback queue"
        className="relative flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-paper"
      >
        <ListMusic className="h-[18px] w-[18px]" strokeWidth={1.5} />
        {upcoming > 0 ? (
          <span className="absolute right-1.5 top-2 flex h-3.5 min-w-3.5 items-center justify-center bg-burgundy px-0.5 font-mono text-[8px] tabular-nums text-paper">
            {upcoming}
          </span>
        ) : null}
      </button>
    </header>
  );
}
