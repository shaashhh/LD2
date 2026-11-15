"use client";

import { AlertCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePlayer } from "@/context/PlayerContext";
import { hasExternalAudioBase } from "@/lib/audioSources";

export function PlaybackNotice() {
  const { error, dismissError } = usePlayer();

  return (
    <AnimatePresence>
      {error ? (
        <motion.div
          className="overflow-hidden border-t border-burgundy/60 bg-[#1a1415]"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
        >
          <div className="mx-auto flex max-w-[1800px] items-start gap-3 px-4 py-2.5 md:px-6">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-burgundy-bright"
              strokeWidth={1.5}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] leading-snug text-paper/90">{error.message}</p>
              <p className="mt-0.5 truncate font-mono text-[9px] tracking-[0.04em] text-faint">
                {error.folder}
                {error.filename}
                {hasExternalAudioBase() ? " · or on your configured audio host" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={dismissError}
              aria-label="Dismiss playback notice"
              className="flex h-7 w-7 shrink-0 items-center justify-center text-faint transition-colors hover:text-paper"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
