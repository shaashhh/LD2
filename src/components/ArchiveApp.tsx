"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useState } from "react";
import { ArchiveLanding } from "@/components/ArchiveLanding";
import { ArchiveLayout } from "@/components/ArchiveLayout";
import { isCollectionId } from "@/data/tracks";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/lib/storage";
import type { Section } from "@/types/music";

function isSection(value: string): value is Section {
  return value === "home" || isCollectionId(value);
}

export function ArchiveApp() {
  const [entered, setEntered] = useState(false);
  const [section, setSection] = useState<Section>("home");

  const handleEnter = () => {
    const hash = window.location.hash.replace(/^#/, "");
    const stored = readStorage<string>(STORAGE_KEYS.lastSection, "home");
    const hasVisited = readStorage<boolean>(STORAGE_KEYS.visited, false);

    const next = isSection(hash)
      ? hash
      : hasVisited && isSection(stored)
        ? stored
        : "home";

    setSection(next);
    writeStorage(STORAGE_KEYS.visited, true);
    writeStorage(STORAGE_KEYS.lastSection, next);
    setEntered(true);
  };

  const navigate = (next: Section) => {
    setSection(next);
    writeStorage(STORAGE_KEYS.lastSection, next);

    if (typeof window !== "undefined") {
      const base = `${window.location.pathname}${window.location.search}`;
      const url = next === "home" ? base : `${base}#${next}`;
      window.history.replaceState(null, "", url);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {!entered && <ArchiveLanding key="landing" onEnter={handleEnter} />}
      </AnimatePresence>

      {entered && <ArchiveLayout section={section} onNavigate={navigate} />}

      <div className="vignette-overlay" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
    </MotionConfig>
  );
}
