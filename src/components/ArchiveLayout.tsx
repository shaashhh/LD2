"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArchiveFooter } from "@/components/ArchiveFooter";
import { CollectionOverview } from "@/components/CollectionOverview";
import { CollectionPage } from "@/components/CollectionPage";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { MusicPlayer } from "@/components/MusicPlayer";
import { NoticeToast } from "@/components/NoticeToast";
import { NowPlaying } from "@/components/NowPlaying";
import { PlaybackNotice } from "@/components/PlaybackNotice";
import { QueuePanel } from "@/components/QueuePanel";
import { SelectionBar } from "@/components/SelectionBar";
import { Sidebar } from "@/components/Sidebar";
import { TapeCollection } from "@/components/TapeCollection";
import { usePlayer } from "@/context/PlayerContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { Section } from "@/types/music";

interface ArchiveLayoutProps {
  section: Section;
  onNavigate: (section: Section) => void;
}

export function ArchiveLayout({ section, onNavigate }: ArchiveLayoutProps) {
  const { setQueueOpen, setNowPlayingOpen } = usePlayer();
  const [navOpen, setNavOpen] = useState(false);

  useKeyboardShortcuts();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [section]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setNavOpen(false);
      setQueueOpen(false);
      setNowPlayingOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setNowPlayingOpen, setQueueOpen]);

  return (
    <div className="min-h-[100svh] bg-ink">
      <Sidebar section={section} onNavigate={onNavigate} />
      <MobileHeader onOpenNav={() => setNavOpen(true)} onHome={() => onNavigate("home")} />
      <MobileNav
        open={navOpen}
        section={section}
        onClose={() => setNavOpen(false)}
        onNavigate={onNavigate}
        onOpenQueue={() => {
          setNavOpen(false);
          setQueueOpen(true);
        }}
      />

      <main className="pb-[var(--player-h)] md:pl-[var(--sidebar-w)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 pb-10 pt-20 sm:px-8 md:px-10 md:pt-10 lg:px-14 lg:pt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {section === "home" ? <CollectionOverview onNavigate={onNavigate} /> : null}
              {section === "performances" || section === "variations" ? (
                <CollectionPage collectionId={section} onNavigate={onNavigate} />
              ) : null}
              {section === "tape" ? <TapeCollection onNavigate={onNavigate} /> : null}
              <ArchiveFooter />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-[var(--player-h)] z-[45]">
        <div className="pointer-events-auto">
          <PlaybackNotice />
        </div>
        <div className="pointer-events-auto">
          <SelectionBar />
        </div>
      </div>

      <MusicPlayer onNavigate={onNavigate} />
      <QueuePanel />
      <NowPlaying />
      <NoticeToast />
    </div>
  );
}
