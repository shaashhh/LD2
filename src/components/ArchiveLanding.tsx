"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { LANDING_ARTWORK } from "@/data/tracks";

interface ArchiveLandingProps {
  onEnter: () => void;
}

const DUST = [
  { left: "12%", top: "68%", size: 2, duration: 28, delay: 3 },
  { left: "24%", top: "42%", size: 1, duration: 34, delay: 8 },
  { left: "41%", top: "74%", size: 2, duration: 26, delay: 12 },
  { left: "58%", top: "32%", size: 1, duration: 38, delay: 5 },
  { left: "71%", top: "58%", size: 2, duration: 30, delay: 16 },
  { left: "84%", top: "46%", size: 1, duration: 24, delay: 9 },
  { left: "91%", top: "72%", size: 2, duration: 32, delay: 20 },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function ArchiveLanding({ onEnter }: ArchiveLandingProps) {
  const reduceMotion = useReducedMotion();

  const duration = (value: number) => (reduceMotion ? 0.01 : value);
  const delay = (value: number) => (reduceMotion ? 0 : value);

  return (
    <motion.section
      className="fixed inset-0 z-[80] overflow-y-auto overflow-x-hidden bg-night text-paper"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: duration(0.8), ease: [0.4, 0, 0.2, 1] },
      }}
    >
      {/* Deep burgundy breath behind the composition */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_18%,rgba(113,59,67,0.13),transparent_56%)]"
        aria-hidden="true"
      />

      {/* Mobile: the artwork becomes the room */}
      <motion.div
        className="absolute inset-0 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration(1.5), delay: delay(0.2), ease: "easeOut" }}
      >
        <Image
          src={LANDING_ARTWORK}
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, 1px"
          className="object-cover object-[55%_42%] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/75 to-night/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-transparent to-transparent" />
      </motion.div>

      {/* Opening darkness */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[5] bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: duration(1.2), ease: "easeOut" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1560px] flex-col px-6 pt-5 sm:px-10 sm:pt-6 lg:px-16">
        <motion.header
          className="flex items-center justify-between gap-4 border-b border-line/60 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration(0.9), delay: delay(1.2) }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center border border-line font-mono text-[10px] tracking-[0.08em] text-highlight">
              LD
            </span>
            <span className="label-mono text-faint">DIGITAL ARCHIVE / 001</span>
          </div>
          <span className="label-mono hidden text-faint sm:block">RADIOHEAD · LET DOWN</span>
          <span className="label-mono hidden text-faint sm:block">EST. 1995–1997</span>
        </motion.header>

        <div className="grid flex-1 items-center gap-10 py-10 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.82fr)] md:py-8 lg:gap-20">
          <div className="order-2 max-w-[700px] md:order-1">
            <motion.div
              className="mb-6 flex items-center gap-3 label-mono text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration(0.8), delay: delay(0.9) }}
            >
              <span className="h-px w-8 bg-line" />
              RECORDING INDEX / 15 ENTRIES
            </motion.div>

            <h1 className="font-display uppercase text-[clamp(3rem,6.2vw,6.2rem)] leading-[0.88] tracking-[-0.025em]">
              <motion.span
                className="block whitespace-nowrap"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration(1.1), delay: delay(1.0), ease: EASE }}
              >
                The Let Down
              </motion.span>
              <motion.span
                className="mt-1 block italic text-highlight"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration(1.1), delay: delay(1.18), ease: EASE }}
              >
                Archive
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration(0.9), delay: delay(1.5), ease: EASE }}
            >
              <p className="mt-7 label-mono text-paper/90">15 RECORDINGS. ONE SONG.</p>
              <p className="mt-4 max-w-md font-display text-[clamp(1.35rem,2.2vw,1.8rem)] italic leading-snug text-muted">
                An archive of a song, and everything it became.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration(0.8), delay: delay(1.9) }}
            >
              <button
                type="button"
                onClick={onEnter}
                className="group relative inline-flex items-center gap-3 pb-3 text-[11px] uppercase tracking-[0.3em] text-paper transition-colors hover:text-paper"
              >
                <span className="h-1 w-1 bg-burgundy-bright transition-transform duration-500 group-hover:scale-150" />
                Enter the archive
                <ArrowRight className="h-4 w-4 text-muted transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-paper" />
                <span className="absolute bottom-0 left-0 h-px w-full bg-line" />
                <span className="absolute bottom-0 left-0 h-px w-0 bg-highlight transition-all duration-700 group-hover:w-full" />
              </button>
              <span className="label-mono text-faint">NO ACCOUNT / NO ALGORITHM</span>
            </motion.div>
          </div>

          <div className="order-1 hidden md:flex md:justify-end">
            <motion.figure
              className="w-full max-w-[460px]"
              initial={{ opacity: 0, scale: 1.035, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: duration(1.7), delay: delay(0.4), ease: EASE }}
            >
              <div className="relative mx-auto aspect-[2/3] h-[min(62vh,620px)] max-w-full border border-line/80 bg-ink-2 p-2.5 shadow-[0_50px_140px_-55px_rgba(0,0,0,1)]">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={LANDING_ARTWORK}
                    alt="A lone figure walking away down a rain-soaked street at dusk"
                    fill
                    priority
                    sizes="(min-width: 768px) 38vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/45 via-transparent to-transparent" />
                  <div className="absolute inset-0 film-grain opacity-20 mix-blend-overlay" />
                </div>
                <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-highlight/50" />
                <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-highlight/50" />
                <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-highlight/50" />
                <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-highlight/50" />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4 label-mono text-faint">
                <span>FIG. 001 — THE STREET, UNKNOWN</span>
                <span className="shrink-0">ARCHIVAL PRINT</span>
              </figcaption>
            </motion.figure>
          </div>
        </div>

        <motion.footer
          className="border-t border-line/60 py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration(0.9), delay: delay(2.2) }}
        >
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:items-center">
            <span className="label-mono text-faint">DIGITAL ARCHIVE / 001</span>
            <span className="label-mono text-faint sm:text-center">
              RADIOHEAD · 15 RECORDINGS
            </span>
            <span className="label-mono text-faint sm:text-right">
              ARCHIVAL COPY / NO. 001
            </span>
          </div>
          <p className="mt-3 max-w-xl text-[10px] leading-relaxed text-faint/80">
            An independent, non-commercial fan archive. All recordings remain the property of
            their respective rights holders.
          </p>
        </motion.footer>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {DUST.map((particle, index) => (
          <span
            key={index}
            className="dust"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}
