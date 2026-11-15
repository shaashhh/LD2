"use client";

import { Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePlayer } from "@/context/PlayerContext";

export function SelectionBar() {
  const { selection, playSelection, clearSelection } = usePlayer();

  return (
    <AnimatePresence>
      {selection.length > 0 ? (
        <motion.div
          className="overflow-hidden border-t border-burgundy/60 bg-[#181414]"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-2 px-4 py-2.5 md:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-5 min-w-5 items-center justify-center bg-burgundy px-1 font-mono text-[9px] tabular-nums text-paper">
                {String(selection.length).padStart(2, "0")}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/85">
                Selected
              </span>
              <span className="hidden font-mono text-[8px] uppercase tracking-[0.12em] text-faint sm:inline">
                Selection order preserved
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={playSelection}
                className="flex h-8 items-center gap-1.5 bg-paper px-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-[#d6cec0]"
              >
                <Play className="h-3 w-3" fill="currentColor" />
                Play selected
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="flex h-8 items-center gap-1 px-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
