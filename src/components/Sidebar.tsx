"use client";

import { ArchiveNav, ArchiveStats } from "@/components/ArchiveNav";
import { usePlayer } from "@/context/PlayerContext";
import type { Section } from "@/types/music";

interface SidebarProps {
  section: Section;
  onNavigate: (section: Section) => void;
}

export function Sidebar({ section, onNavigate }: SidebarProps) {
  const { setQueueOpen, isQueueOpen } = usePlayer();

  return (
    <aside
      className="fixed bottom-[var(--player-h)] left-0 top-0 z-30 hidden w-[var(--sidebar-w)] flex-col border-r border-line bg-[#141312] md:flex"
      aria-label="Archive sidebar"
    >
      <div className="border-b border-line/60 px-6 pb-6 pt-7">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="group flex items-start gap-3 text-left"
        >
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-line font-mono text-[9px] tracking-[0.06em] text-highlight transition-colors group-hover:border-highlight">
            LD
          </span>
          <span className="font-display text-[21px] leading-[0.92] tracking-[0.01em] text-paper">
            The Let Down
            <br />
            <em className="text-highlight">Archive</em>
          </span>
        </button>
        <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.2em] text-faint">
          Digital Archive / 001
        </p>
        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-faint/80">
          Recording index / 15 entries
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-5">
        <ArchiveNav
          section={section}
          onNavigate={onNavigate}
          onOpenQueue={() => setQueueOpen(!isQueueOpen)}
        />
      </div>

      <div className="border-t border-line px-6 py-5">
        <ArchiveStats />
        <p className="mt-4 text-[9px] leading-relaxed text-faint/80">
          An independent, non-commercial fan archive. All recordings remain the property of
          their respective rights holders.
        </p>
      </div>
    </aside>
  );
}
