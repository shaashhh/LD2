"use client";

import { ArrowRight, Play, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArchiveButton } from "@/components/ArchiveButton";
import { CollectionCard } from "@/components/CollectionCard";
import { usePlayer } from "@/context/PlayerContext";
import {
  COLLECTIONS,
  getCollection,
  getCollectionTracks,
  TOTAL_RECORDINGS,
  TOTAL_RUNTIME_SECONDS,
} from "@/data/tracks";
import { formatDuration, formatRuntime } from "@/lib/format";
import type { Collection, Section } from "@/types/music";

interface CollectionOverviewProps {
  onNavigate: (section: Section) => void;
}

const OPERATING_NOTES = [
  { keys: "Space", action: "Play / pause" },
  { keys: "← / →", action: "Seek five seconds" },
  { keys: "⌘/Ctrl + ← →", action: "Previous / next" },
  { keys: "M · S · R", action: "Mute · shuffle · repeat" },
];

export function CollectionOverview({ onNavigate }: CollectionOverviewProps) {
  const { playAll, shuffleAll, playCollection, currentTrack } = usePlayer();
  const featured = COLLECTIONS.filter((collection) => collection.id !== "tape");
  const tape = getCollection("tape");
  const tapeTrack = getCollectionTracks("tape")[0];

  const openCollection = (collection: Collection) => onNavigate(collection.id);

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.2em] text-faint sm:text-[9px]">
          <span>Digital archive / 001</span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <span>Recording index</span>
        </div>

        <div className="mt-8 grid gap-9 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-end">
          <div>
            <h1 className="font-display text-[clamp(2.7rem,5.6vw,5.4rem)] leading-[0.92] tracking-[-0.02em]">
              Fifteen recordings.
              <br />
              <span className="italic text-highlight">One song.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-muted sm:text-[14px]">
              A digital archive of the performances, demos, alternate versions and
              interpretations of Radiohead&rsquo;s <span className="text-paper/90">Let Down</span>.
              Listen in order, or hold all fifteen together.
            </p>
          </div>

          <div className="border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <dl className="grid grid-cols-2 gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.14em]">
              <dt className="text-faint">Recordings</dt>
              <dd className="text-right text-paper/85">{TOTAL_RECORDINGS}</dd>
              <dt className="text-faint">Runtime</dt>
              <dd className="text-right text-paper/85">
                {formatRuntime(TOTAL_RUNTIME_SECONDS)}
              </dd>
              <dt className="text-faint">Collections</dt>
              <dd className="text-right text-paper/85">03</dd>
              <dt className="text-faint">Archive</dt>
              <dd className="text-right text-paper/85">001</dd>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <ArchiveButton variant="primary" onClick={playAll}>
                <Play className="h-3.5 w-3.5" fill="currentColor" />
                Play the archive
              </ArchiveButton>
              <ArchiveButton variant="outline" onClick={shuffleAll}>
                <Shuffle className="h-3.5 w-3.5" strokeWidth={1.6} />
                Shuffle
              </ArchiveButton>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="mt-14 space-y-14 md:mt-20 md:space-y-20">
        {featured.map((collection, index) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onOpen={openCollection}
            index={index}
          />
        ))}

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="group border border-line bg-ink-2/50"
          aria-labelledby="tape-object-title"
        >
          <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
            <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-12">
              <div>
                <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                  <span className="text-highlight">Collection 03</span>
                  <span className="h-px w-5 bg-line" aria-hidden="true" />
                  <span>Archive object</span>
                </div>
                <h2
                  id="tape-object-title"
                  className="mt-6 font-display text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[0.94]"
                >
                  Let Down,
                  <br />
                  <span className="italic text-highlight">The Tape</span>
                </h2>
                <p className="mt-5 max-w-md text-[13px] leading-relaxed text-muted sm:text-[14px]">
                  {tape.description}
                </p>
                <dl className="mt-8 grid max-w-xs grid-cols-2 gap-y-2 font-mono text-[9px] uppercase tracking-[0.14em]">
                  <dt className="text-faint">Recording</dt>
                  <dd className="text-right text-paper/85">01</dd>
                  <dt className="text-faint">Runtime</dt>
                  <dd className="text-right text-paper/85">
                    {formatDuration(tape.runtimeSeconds)}
                  </dd>
                  <dt className="text-faint">Format</dt>
                  <dd className="text-right text-paper/85">Continuous</dd>
                </dl>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <ArchiveButton variant="primary" onClick={() => playCollection("tape")}>
                  <Play className="h-3.5 w-3.5" fill="currentColor" />
                  Play the tape
                </ArchiveButton>
                <ArchiveButton variant="outline" onClick={() => onNavigate("tape")}>
                  Open object
                  <ArrowRight className="h-3.5 w-3.5" />
                </ArchiveButton>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("tape")}
              aria-label="Open Let Down, The Tape"
              className="relative flex min-h-[330px] items-center justify-center overflow-hidden border-t border-line bg-[#0d0d0c] p-8 sm:p-10 lg:min-h-[520px] lg:border-l lg:border-t-0 lg:p-14"
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(113,59,67,0.12),transparent_60%)]" />
              <span className="relative block w-full max-w-[400px] border border-line/80 bg-ink-2 p-2.5 shadow-[0_30px_80px_-40px_rgba(0,0,0,1)] transition-transform duration-700 group-hover:scale-[1.015]">
                <span className="relative block aspect-square overflow-hidden">
                  <Image
                    src={tapeTrack.artwork}
                    alt="A worn cassette tape with a faded blank label"
                    fill
                    sizes="(min-width: 1024px) 400px, 70vw"
                    className="object-cover transition-transform duration-[1600ms] group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 film-grain opacity-[0.14] mix-blend-overlay" />
                </span>
                <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-highlight/50" />
                <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-highlight/50" />
                <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-highlight/50" />
                <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-highlight/50" />
              </span>
              <span className="absolute left-5 top-5 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
                Side A / Archival copy
              </span>
              <span className="absolute bottom-5 right-5 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
                {formatDuration(tape.runtimeSeconds)}
              </span>
            </button>
          </div>
        </motion.section>
      </div>

      <motion.section
        className="mt-16 border-t border-line pt-5 md:mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        aria-label="Keyboard controls"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
            Operating notes / keyboard
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-faint/70">
            {currentTrack ? `Loaded: ${currentTrack.title}` : "No recording loaded"}
          </span>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          {OPERATING_NOTES.map((note) => (
            <div key={note.keys}>
              <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/80">
                {note.keys}
              </dt>
              <dd className="mt-1 text-[10px] leading-snug text-faint">{note.action}</dd>
            </div>
          ))}
        </dl>
      </motion.section>
    </div>
  );
}
