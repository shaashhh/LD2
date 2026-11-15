"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePlayer } from "@/context/PlayerContext";

export function NoticeToast() {
  const { notice, dismissNotice } = usePlayer();

  return (
    <AnimatePresence>
      {notice ? (
        <motion.div
          key={notice}
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(var(--player-h)+66px)] left-3 right-3 z-[75] border border-line border-l-2 border-l-burgundy-bright bg-ink-2/95 px-4 py-3 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.9)] sm:left-auto sm:right-5 sm:w-[330px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            onClick={dismissNotice}
            className="flex w-full items-start gap-2 text-left"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 bg-burgundy-bright" />
            <span className="text-[11px] leading-relaxed text-paper/85">{notice}</span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
