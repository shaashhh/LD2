"use client";

import { Volume2, VolumeX } from "lucide-react";
import type { CSSProperties } from "react";
import { usePlayer } from "@/context/PlayerContext";

export function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayer();
  const audible = !isMuted && volume > 0;
  const displayed = isMuted ? 0 : volume;

  return (
    <div className="group flex items-center gap-2">
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        aria-pressed={isMuted}
        className="flex h-8 w-7 items-center justify-center text-muted transition-colors hover:text-paper"
      >
        {audible ? (
          <Volume2 className="h-[17px] w-[17px]" strokeWidth={1.5} />
        ) : (
          <VolumeX className="h-[17px] w-[17px]" strokeWidth={1.5} />
        )}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={displayed}
        onChange={(event) => setVolume(Number(event.target.value))}
        aria-label="Volume"
        className="archive-range w-14 transition-[width] duration-300 ease-out group-hover:w-20 lg:w-16 lg:group-hover:w-24"
        style={{ "--range-progress": `${displayed * 100}%` } as CSSProperties}
      />
    </div>
  );
}
