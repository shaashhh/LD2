import Image from "next/image";
import { cn } from "@/lib/cn";

interface ArtworkProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** Slow scale-up when an ancestor with the `group` class is hovered. */
  hoverScale?: boolean;
  /** Extra grading applied on top of the baked-in archival treatment. */
  grade?: "default" | "soft";
}

export function Artwork({
  src,
  alt,
  className,
  sizes,
  priority = false,
  hoverScale = false,
  grade = "default",
}: ArtworkProps) {
  return (
    <div className={cn("relative overflow-hidden bg-ink-3", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover",
            grade === "soft" ? "saturate-[0.72] contrast-[0.96]" : "saturate-[0.8]",
            hoverScale &&
              "transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]",
          )}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-xl text-faint">LD</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 film-grain opacity-[0.12] mix-blend-overlay" />
    </div>
  );
}
