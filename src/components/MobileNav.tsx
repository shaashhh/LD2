"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ArchiveNav, ArchiveStats } from "@/components/ArchiveNav";
import { useLockBodyScroll } from "@/hooks/useMediaQuery";
import type { Section } from "@/types/music";

interface MobileNavProps {
  open: boolean;
  section: Section;
  onClose: () => void;
  onNavigate: (section: Section) => void;
  onOpenQueue: () => void;
}

export function MobileNav({
  open,
  section,
  onClose,
  onNavigate,
  onOpenQueue,
}: MobileNavProps) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="fixed inset-0 z-[115] bg-black/70 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Archive navigation"
            className="fixed bottom-0 left-0 top-0 z-[116] flex w-[86%] max-w-[340px] flex-col border-r border-line bg-ink-2 md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-5">
              <div>
                <p className="font-display text-[22px] leading-none text-paper">
                  The Let Down <em className="text-highlight">Archive</em>
                </p>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                  Digital Archive / 001
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="flex h-10 w-10 items-center justify-center text-muted hover:text-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5">
              <ArchiveNav
                compact
                section={section}
                onNavigate={(next) => {
                  onNavigate(next);
                  onClose();
                }}
                onOpenQueue={onOpenQueue}
              />
            </div>

            <div className="border-t border-line px-5 py-5">
              <ArchiveStats />
              <p className="mt-4 text-[9px] leading-relaxed text-faint/80">
                An independent, non-commercial fan archive. All recordings remain the property
                of their respective rights holders.
              </p>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
