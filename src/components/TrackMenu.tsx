"use client";

import { Check, CornerDownRight, ListPlus, MoreHorizontal, Play, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Artwork } from "@/components/Artwork";
import { usePlayer } from "@/context/PlayerContext";
import { getCollection } from "@/data/tracks";
import { cn } from "@/lib/cn";
import type { Track } from "@/types/music";

interface TrackMenuProps {
  track: Track;
}

export function TrackMenu({ track }: TrackMenuProps) {
  const {
    queue,
    selection,
    playTrack,
    playNext,
    addToQueue,
    removeFromQueue,
    toggleSelection,
  } = usePlayer();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const queueIndex = queue.findIndex((item) => item.id === track.id);
  const isSelected = selection.includes(track.id);
  const collection = getCollection(track.collectionId);

  const openMenu = () => {
    const isMobile = window.innerWidth < 768;
    setMobile(isMobile);

    if (!isMobile && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const width = 236;
      const height = 258;
      const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.right - width));
      const below = window.innerHeight - rect.bottom;
      const top =
        below > height + 16
          ? rect.bottom + 8
          : Math.max(12, rect.top - height - 8);
      setCoords({ top, left });
    }

    setOpen(true);
  };

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const run = (action: () => void) => {
    action();
    close();
  };

  const menuItems = (
    <>
      <MenuItem
        icon={<Play className="h-3.5 w-3.5" />}
        label="Play now"
        onClick={() => run(() => playTrack(track))}
      />
      <MenuItem
        icon={<CornerDownRight className="h-3.5 w-3.5" />}
        label="Play next"
        onClick={() => run(() => playNext(track))}
      />
      <MenuItem
        icon={<ListPlus className="h-3.5 w-3.5" />}
        label="Add to queue"
        onClick={() => run(() => addToQueue(track))}
      />
      {queueIndex >= 0 ? (
        <MenuItem
          icon={<Trash2 className="h-3.5 w-3.5" />}
          label="Remove from queue"
          onClick={() => run(() => removeFromQueue(queueIndex))}
        />
      ) : null}
      <div className="my-1 h-px bg-line/70" />
      <MenuItem
        icon={<Check className={cn("h-3.5 w-3.5", isSelected && "text-burgundy-bright")} />}
        label={isSelected ? "Remove from selection" : "Select for custom queue"}
        onClick={() => run(() => toggleSelection(track.id))}
      />
    </>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        aria-label={`More actions for ${track.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 shrink-0 items-center justify-center justify-self-end text-faint opacity-60 transition-all duration-300 hover:text-paper md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      >
        <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open && mobile ? (
                <>
                  <motion.button
                    type="button"
                    aria-label="Close actions"
                    className="fixed inset-0 z-[130] bg-black/65"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Actions for ${track.title}`}
                    className="fixed inset-x-0 bottom-0 z-[131] border-t border-line bg-ink-2 pb-[calc(1rem+env(safe-area-inset-bottom))]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mx-auto max-w-lg px-5 pt-4">
                      <div className="flex items-start gap-3 border-b border-line pb-4">
                        <Artwork
                          src={track.artwork}
                          alt=""
                          sizes="48px"
                          className="h-12 w-12 shrink-0 border border-line/60"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] text-paper">{track.title}</p>
                          <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                            {collection.title} · {track.identifier}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={close}
                          aria-label="Close"
                          className="flex h-8 w-8 items-center justify-center text-faint hover:text-paper"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="py-2">{menuItems}</div>
                      <button
                        type="button"
                        onClick={close}
                        className="mt-2 h-11 w-full border border-line font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-paper"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </>
              ) : null}

              {open && !mobile && coords ? (
                <>
                  <button
                    type="button"
                    aria-label="Close actions"
                    className="fixed inset-0 z-[130] cursor-default bg-transparent"
                    onClick={close}
                  />
                  <motion.div
                    role="menu"
                    aria-label={`Actions for ${track.title}`}
                    className="fixed z-[131] w-[236px] border border-line bg-[#1b1a18] py-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)]"
                    style={{ top: coords.top, left: coords.left }}
                    initial={{ opacity: 0, y: 4, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.985 }}
                    transition={{ duration: 0.16 }}
                  >
                    <div className="border-b border-line/70 px-3.5 pb-2.5 pt-1.5">
                      <p className="truncate text-[12px] text-paper">{track.title}</p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                        {track.identifier}
                      </p>
                    </div>
                    {menuItems}
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-3.5 py-2 text-left text-[12px] text-muted transition-colors hover:bg-paper/[0.05] hover:text-paper"
    >
      <span className="flex w-4 justify-center text-faint">{icon}</span>
      {label}
    </button>
  );
}
