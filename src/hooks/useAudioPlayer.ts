"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { getAudioLocation, getAudioSrc } from "@/lib/audioSources";
import type { PlaybackError, Track } from "@/types/music";

interface UseAudioPlayerOptions {
  audioRef: RefObject<HTMLAudioElement | null>;
  volume: number;
  muted: boolean;
  playbackRate: number;
  onEnded: () => void;
}

interface PlayOptions {
  /** Reload the source even if this recording is already loaded. */
  force?: boolean;
}

const LOAD_TIMEOUT_MS = 15_000;

function buildError(track: Track, message?: string): PlaybackError {
  const location = getAudioLocation(track);
  const separator = location.lastIndexOf("/");
  return {
    trackId: track.id,
    title: track.title,
    filename: location.slice(separator + 1),
    folder: location.slice(0, separator + 1),
    message: message ?? "This recording isn't in the archive yet.",
  };
}

/**
 * Owns exactly one HTMLAudioElement. Queue logic lives in PlayerContext; this
 * hook only translates intents into audio-element calls and exposes its state.
 */
export function useAudioPlayer({
  audioRef,
  volume,
  muted,
  playbackRate,
  onEnded,
}: UseAudioPlayerOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<PlaybackError | null>(null);

  const currentTrackRef = useRef<Track | null>(null);
  const loadedTrackIdRef = useRef<string | null>(null);
  const loadTokenRef = useRef(0);
  const loadingTimerRef = useRef<number | null>(null);
  const suppressErrorsRef = useRef(false);
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const clearLoadingTimer = useCallback(() => {
    if (loadingTimerRef.current !== null) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  }, []);

  const fail = useCallback((track: Track, message?: string) => {
    if (suppressErrorsRef.current) return;
    clearLoadingTimer();
    setIsLoading(false);
    setIsPlaying(false);
    setError(buildError(track, message));
  }, [clearLoadingTimer]);

  // Bind element events once. The element itself lives for the whole session.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
    };
    const handleCanPlay = () => {
      clearLoadingTimer();
      setIsLoading(false);
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
    };
    const handlePlaying = () => {
      clearLoadingTimer();
      setIsLoading(false);
      setIsPlaying(true);
      setError(null);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => {
      if (!audio.paused) setIsLoading(true);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
      onEndedRef.current();
    };
    const handleError = () => {
      if (suppressErrorsRef.current || !audio.currentSrc) return;
      const track = currentTrackRef.current;
      if (!track) return;
      const code = audio.error?.code;
      const message =
        code === 3
          ? "This recording could not be decoded. The file may be damaged."
          : undefined;
      fail(track, message);
    };
    const handleEmptied = () => {
      setCurrentTime(0);
      setDuration(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDuration);
    audio.addEventListener("loadedmetadata", handleDuration);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("emptied", handleEmptied);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDuration);
      audio.removeEventListener("loadedmetadata", handleDuration);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("emptied", handleEmptied);
    };
  }, [audioRef, clearLoadingTimer, fail]);

  // Volume and mute are owned by PlayerContext, applied here.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.muted = muted;
  }, [audioRef, volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [audioRef, playbackRate]);

  useEffect(() => () => clearLoadingTimer(), [clearLoadingTimer]);

  const play = useCallback(
    (track: Track, options?: PlayOptions) => {
      const audio = audioRef.current;
      if (!audio) return;

      const sameSource = loadedTrackIdRef.current === track.id && Boolean(audio.currentSrc);
      const shouldReload = !sameSource || Boolean(options?.force);

      currentTrackRef.current = track;
      setError(null);
      setIsLoading(true);
      clearLoadingTimer();

      if (shouldReload) {
        loadTokenRef.current += 1;
        loadedTrackIdRef.current = track.id;
        suppressErrorsRef.current = false;
        audio.src = getAudioSrc(track);
        setCurrentTime(0);
        setDuration(track.durationSeconds);
        audio.load();
      }

      const token = loadTokenRef.current;
      const playAttempt = audio.play();

      if (playAttempt) {
        playAttempt.catch((reason: unknown) => {
          if (token !== loadTokenRef.current) return;
          const name = reason instanceof DOMException ? reason.name : "";
          if (name === "AbortError") return;
          if (name === "NotAllowedError") {
            setIsLoading(false);
            setIsPlaying(false);
            setError({
              trackId: track.id,
              title: track.title,
              filename: track.audioFile,
              folder: `public/audio/${track.audioFolder}/`,
              message: "Your browser blocked playback. Press play once more to start the recording.",
            });
            return;
          }
          fail(track);
        });
      }

      if (shouldReload) {
        loadingTimerRef.current = window.setTimeout(() => {
          if (token !== loadTokenRef.current) return;
          if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA && !audio.error) {
            fail(
              track,
              "The recording is taking too long to load. Check that the file exists, then try again.",
            );
          }
        }, LOAD_TIMEOUT_MS);
      }
    },
    [audioRef, clearLoadingTimer, fail],
  );

  const resume = useCallback(() => {
    const audio = audioRef.current;
    const track = currentTrackRef.current;
    if (!audio || !track || !audio.currentSrc) return;
    setError(null);
    const attempt = audio.play();
    attempt?.catch((reason: unknown) => {
      const name = reason instanceof DOMException ? reason.name : "";
      if (name === "AbortError") return;
      fail(track);
    });
  }, [audioRef, fail]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, [audioRef]);

  const seek = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio || !audio.currentSrc) return;
      const limit = Number.isFinite(audio.duration) ? audio.duration : seconds;
      const next = Math.min(Math.max(0, seconds), Math.max(0, limit));
      try {
        audio.currentTime = next;
        setCurrentTime(next);
      } catch {
        // The element may not be seekable yet; the next gesture will retry.
      }
    },
    [audioRef],
  );

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
    } catch {
      // Ignore a not-yet-seekable element.
    }
    setCurrentTime(0);
    const attempt = audio.play();
    attempt?.catch((reason: unknown) => {
      const track = currentTrackRef.current;
      if (!track) return;
      const name = reason instanceof DOMException ? reason.name : "";
      if (name !== "AbortError") fail(track);
    });
  }, [audioRef, fail]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    suppressErrorsRef.current = true;
    clearLoadingTimer();
    loadTokenRef.current += 1;
    loadedTrackIdRef.current = null;
    currentTrackRef.current = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    window.setTimeout(() => {
      suppressErrorsRef.current = false;
    }, 50);
  }, [audioRef, clearLoadingTimer]);

  const clearError = useCallback(() => setError(null), []);

  return {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    error,
    play,
    resume,
    pause,
    seek,
    restart,
    stop,
    clearError,
  };
}
