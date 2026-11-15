"use client";

import { useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag === "BUTTON" || tag === "A") return true;
  if (target.isContentEditable) return true;
  if (target.getAttribute("role") === "slider") return true;
  return false;
}

/**
 * Space · play/pause
 * ← / → · seek 5s
 * Cmd/Ctrl + ← / → · previous/next
 * M · mute · S · shuffle · R · repeat
 */
export function useKeyboardShortcuts(): void {
  const {
    togglePlay,
    seekBy,
    next,
    previous,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isTypingTarget(event.target)) return;
      if (event.altKey) return;

      const modifier = event.metaKey || event.ctrlKey;

      switch (event.code) {
        case "Space":
          if (modifier) return;
          event.preventDefault();
          if (!event.repeat) togglePlay();
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (modifier) previous();
          else seekBy(-5);
          break;
        case "ArrowRight":
          event.preventDefault();
          if (modifier) next();
          else seekBy(5);
          break;
        case "KeyM":
          if (modifier) return;
          if (!event.repeat) toggleMute();
          break;
        case "KeyS":
          if (modifier) return;
          if (!event.repeat) toggleShuffle();
          break;
        case "KeyR":
          if (modifier) return;
          if (!event.repeat) cycleRepeat();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cycleRepeat, next, previous, seekBy, toggleMute, togglePlay, toggleShuffle]);
}
