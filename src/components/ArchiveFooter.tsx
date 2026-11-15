export function ArchiveFooter() {
  return (
    <footer className="mt-16 border-t border-line pt-5 md:mt-24">
      <div className="flex flex-col gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>End of index / 15 recordings</span>
        <span>Digital archive / 001 · Archival copy</span>
      </div>
      <p className="mt-3 max-w-xl text-[10px] leading-relaxed text-faint/70">
        An archive of a song, and everything it became. An independent, non-commercial fan
        project — not affiliated with Radiohead or their labels.
      </p>
    </footer>
  );
}
