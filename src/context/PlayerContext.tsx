"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TRACKS, getCollectionTracks, getTrack } from "@/data/tracks";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { shuffleArray, shuffleUpcoming } from "@/lib/shuffle";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/lib/storage";
import type { CollectionId, PlaybackError, RepeatMode, Track } from "@/types/music";

const ALLOWED_RATES = [0.75, 1, 1.25, 1.5] as const;

interface PlayerContextValue {
  queue: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  error: PlaybackError | null;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  shuffle: boolean;
  repeat: RepeatMode;
  selection: string[];
  isQueueOpen: boolean;
  isNowPlayingOpen: boolean;
  notice: string | null;

  togglePlay: () => void;
  playAll: () => void;
  playCollection: (id: CollectionId) => void;
  shuffleAll: () => void;
  shuffleCollection: (id: CollectionId) => void;
  playTrack: (track: Track) => void;
  playFromQueue: (index: number) => void;
  playSelection: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  seekBy: (delta: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  playNext: (track: Track) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  reorderUpcoming: (orderedIds: string[]) => void;
  clearQueue: () => void;
  toggleSelection: (trackId: string) => void;
  clearSelection: () => void;
  setQueueOpen: (open: boolean) => void;
  setNowPlayingOpen: (open: boolean) => void;
  dismissError: () => void;
  dismissNotice: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

function uniqueTracks(tracks: Track[]): Track[] {
  return Array.from(new Map(tracks.map((track) => [track.id, track])).values());
}

interface InitialPreferences {
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  playbackRate: number;
}

function readInitialPreferences(): InitialPreferences {
  if (typeof window === "undefined") {
    return { volume: 0.8, muted: false, shuffle: false, repeat: "off", playbackRate: 1 };
  }

  const storedVolume = readStorage<number>(STORAGE_KEYS.volume, 0.8);
  const storedMuted = readStorage<boolean>(STORAGE_KEYS.muted, false);
  const storedShuffle = readStorage<boolean>(STORAGE_KEYS.shuffle, false);
  const storedRepeat = readStorage<string>(STORAGE_KEYS.repeat, "off");
  const storedSpeed = readStorage<number>(STORAGE_KEYS.speed, 1);

  const repeat: RepeatMode =
    storedRepeat === "all" || storedRepeat === "one" ? storedRepeat : "off";

  return {
    volume: Math.min(1, Math.max(0, Number(storedVolume) || 0)),
    muted: Boolean(storedMuted),
    shuffle: Boolean(storedShuffle),
    repeat,
    playbackRate: ALLOWED_RATES.find((value) => value === storedSpeed) ?? 1,
  };
}

interface InitialQueue {
  queue: Track[];
  index: number;
}

function readInitialQueue(): InitialQueue {
  if (typeof window === "undefined") return { queue: [], index: -1 };

  const savedQueue = readStorage<{ ids?: string[]; index?: number }>(STORAGE_KEYS.queue, {});
  const restored = uniqueTracks(
    (savedQueue.ids ?? [])
      .map((id) => getTrack(id))
      .filter((track): track is Track => Boolean(track)),
  );

  if (restored.length) {
    const savedIndex =
      typeof savedQueue.index === "number" && Number.isFinite(savedQueue.index)
        ? savedQueue.index
        : 0;
    return {
      queue: restored,
      index: Math.min(Math.max(0, savedIndex), restored.length - 1),
    };
  }

  const lastTrackId = readStorage<string | null>(STORAGE_KEYS.lastTrackId, null);
  const lastTrack = lastTrackId ? getTrack(lastTrackId) : undefined;
  return lastTrack ? { queue: [lastTrack], index: 0 } : { queue: [], index: -1 };
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [initialPreferences] = useState(readInitialPreferences);
  const [initialQueue] = useState(readInitialQueue);

  const [queue, setQueueState] = useState<Track[]>(initialQueue.queue);
  const [currentIndex, setCurrentIndexState] = useState(initialQueue.index);
  const [volume, setVolumeState] = useState(initialPreferences.volume);
  const [isMuted, setIsMuted] = useState(initialPreferences.muted);
  const [playbackRate, setPlaybackRateState] = useState(initialPreferences.playbackRate);
  const [shuffle, setShuffleState] = useState(initialPreferences.shuffle);
  const [repeat, setRepeatState] = useState<RepeatMode>(initialPreferences.repeat);
  const [selection, setSelection] = useState<string[]>([]);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const queueRef = useRef<Track[]>(initialQueue.queue);
  const indexRef = useRef(initialQueue.index);
  const repeatRef = useRef<RepeatMode>(initialPreferences.repeat);
  const shuffleRef = useRef(initialPreferences.shuffle);
  const shuffleSnapshotRef = useRef<Track[] | null>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const endedHandlerRef = useRef<() => void>(() => {});

  const {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    error,
    play: playAudio,
    pause: pauseAudio,
    seek: seekAudio,
    restart: restartAudio,
    stop: stopAudio,
    clearError,
  } = useAudioPlayer({
    audioRef,
    volume,
    muted: isMuted,
    playbackRate,
    onEnded: () => endedHandlerRef.current(),
  });

  const commitQueue = useCallback((nextQueue: Track[], nextIndex: number) => {
    queueRef.current = nextQueue;
    indexRef.current = nextIndex;
    setQueueState(nextQueue);
    setCurrentIndexState(nextIndex);
  }, []);

  const announce = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(null), 3200);
  }, []);

  const playIndex = useCallback(
    (index: number) => {
      const track = queueRef.current[index];
      if (!track) return;
      indexRef.current = index;
      setCurrentIndexState(index);
      playAudio(track);
    },
    [playAudio],
  );

  /** Replace the queue and begin. Shuffle keeps the chosen opening track first. */
  const startQueue = useCallback(
    (tracks: Track[], startIndex = 0) => {
      const unique = uniqueTracks(tracks);
      if (!unique.length) return;

      shuffleSnapshotRef.current = null;
      let nextQueue = unique;
      let nextIndex = Math.min(Math.max(0, startIndex), unique.length - 1);

      if (shuffleRef.current && unique.length > 1) {
        const first = unique[nextIndex];
        nextQueue = [first, ...shuffleArray(unique.filter((track) => track.id !== first.id))];
        nextIndex = 0;
      }

      commitQueue(nextQueue, nextIndex);
      playIndex(nextIndex);
    },
    [commitQueue, playIndex],
  );

  const playAll = useCallback(() => startQueue(TRACKS, 0), [startQueue]);

  const playCollection = useCallback(
    (id: CollectionId) => startQueue(getCollectionTracks(id), 0),
    [startQueue],
  );

  const startShuffled = useCallback(
    (tracks: Track[]) => {
      const unique = uniqueTracks(tracks);
      if (!unique.length) return;

      shuffleRef.current = true;
      setShuffleState(true);
      shuffleSnapshotRef.current = null;

      const current = queueRef.current[indexRef.current];
      const keepCurrent = current && unique.some((track) => track.id === current.id);
      const nextQueue = keepCurrent
        ? [current, ...shuffleArray(unique.filter((track) => track.id !== current.id))]
        : shuffleArray(unique);

      commitQueue(nextQueue, 0);
      playIndex(0);
    },
    [commitQueue, playIndex],
  );

  const shuffleAll = useCallback(() => startShuffled(TRACKS), [startShuffled]);

  const shuffleCollection = useCallback(
    (id: CollectionId) => startShuffled(getCollectionTracks(id)),
    [startShuffled],
  );

  const playTrack = useCallback(
    (track: Track) => {
      const collectionTracks = getCollectionTracks(track.collectionId);
      const index = collectionTracks.findIndex((item) => item.id === track.id);
      startQueue(collectionTracks, Math.max(0, index));
    },
    [startQueue],
  );

  const playFromQueue = useCallback(
    (index: number) => {
      if (index < 0 || index >= queueRef.current.length) return;
      playIndex(index);
    },
    [playIndex],
  );

  const playSelection = useCallback(() => {
    const selected = selection
      .map((id) => getTrack(id))
      .filter((track): track is Track => Boolean(track));
    startQueue(selected, 0);
  }, [selection, startQueue]);

  const next = useCallback(() => {
    const currentQueue = queueRef.current;
    const index = indexRef.current;
    if (!currentQueue.length) return;

    if (index < currentQueue.length - 1) {
      playIndex(index + 1);
      return;
    }
    if (repeatRef.current === "all") {
      playIndex(0);
      return;
    }
    // End of queue with repeat off: stop cleanly at the start of the last track.
    pauseAudio();
    seekAudio(0);
  }, [pauseAudio, playIndex, seekAudio]);

  const previous = useCallback(() => {
    const currentQueue = queueRef.current;
    const index = indexRef.current;
    if (!currentQueue.length) return;

    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      seekAudio(0);
      return;
    }
    if (index > 0) {
      playIndex(index - 1);
      return;
    }
    if (repeatRef.current === "all") {
      playIndex(currentQueue.length - 1);
      return;
    }
    seekAudio(0);
  }, [playIndex, seekAudio]);

  const handleEnded = useCallback(() => {
    if (repeatRef.current === "one") {
      restartAudio();
      return;
    }

    const currentQueue = queueRef.current;
    const index = indexRef.current;
    if (!currentQueue.length) return;

    if (index < currentQueue.length - 1) {
      playIndex(index + 1);
      return;
    }
    if (repeatRef.current === "all") {
      playIndex(0);
      return;
    }
    // Automatic playback stops cleanly when the queue ends.
    pauseAudio();
    seekAudio(0);
  }, [pauseAudio, playIndex, restartAudio, seekAudio]);

  useEffect(() => {
    endedHandlerRef.current = handleEnded;
  }, [handleEnded]);

  const togglePlay = useCallback(() => {
    const currentQueue = queueRef.current;
    const index = indexRef.current;

    if (!currentQueue.length || index < 0) {
      startQueue(TRACKS, 0);
      return;
    }

    const track = currentQueue[index];
    if (isPlaying) {
      pauseAudio();
      return;
    }
    playAudio(track, { force: error?.trackId === track.id });
  }, [error, isPlaying, pauseAudio, playAudio, startQueue]);

  const seek = useCallback(
    (seconds: number) => {
      if (indexRef.current >= 0) seekAudio(seconds);
    },
    [seekAudio],
  );

  const seekBy = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (!audio || !audio.currentSrc) return;
      seekAudio(audio.currentTime + delta);
    },
    [seekAudio],
  );

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    setVolumeState(clamped);
    if (clamped > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted((muted) => !muted), []);

  const setPlaybackRate = useCallback((rate: number) => {
    const allowed = ALLOWED_RATES.find((value) => value === rate);
    if (allowed) setPlaybackRateState(allowed);
  }, []);

  const toggleShuffle = useCallback(() => {
    const nextShuffle = !shuffleRef.current;
    shuffleRef.current = nextShuffle;
    setShuffleState(nextShuffle);

    if (nextShuffle) {
      if (queueRef.current.length > 1) {
        shuffleSnapshotRef.current = queueRef.current;
        const index = indexRef.current;
        if (index >= 0) {
          // Keep the current recording exactly where it is; shuffle only what follows.
          commitQueue(shuffleUpcoming(queueRef.current, index), index);
        } else {
          commitQueue(shuffleArray(queueRef.current), 0);
        }
      }
      return;
    }

    const snapshot = shuffleSnapshotRef.current;
    if (snapshot) {
      const current = queueRef.current[indexRef.current];
      const restoredIndex = current
        ? snapshot.findIndex((track) => track.id === current.id)
        : 0;
      commitQueue(snapshot, restoredIndex >= 0 ? restoredIndex : 0);
      shuffleSnapshotRef.current = null;
    }
  }, [commitQueue]);

  const cycleRepeat = useCallback(() => {
    const order: RepeatMode[] = ["off", "all", "one"];
    const nextMode = order[(order.indexOf(repeatRef.current) + 1) % order.length];
    repeatRef.current = nextMode;
    setRepeatState(nextMode);
  }, []);

  const playNext = useCallback(
    (track: Track) => {
      const currentQueue = [...queueRef.current];
      const index = indexRef.current;

      if (!currentQueue.length || index < 0) {
        shuffleSnapshotRef.current = null;
        commitQueue([track], 0);
        playIndex(0);
        announce("Playing next.");
        return;
      }

      const existing = currentQueue.findIndex((item) => item.id === track.id);
      if (existing === index) return;

      let insertAt = index + 1;
      if (existing !== -1) {
        currentQueue.splice(existing, 1);
        if (existing < index) insertAt = index;
      }
      currentQueue.splice(insertAt, 0, track);

      shuffleSnapshotRef.current = null;
      commitQueue(currentQueue, index);
      announce(`“${track.title}” will play next.`);
    },
    [announce, commitQueue, playIndex],
  );

  const addToQueue = useCallback(
    (track: Track) => {
      const currentQueue = queueRef.current;
      const index = indexRef.current;

      if (currentQueue.some((item) => item.id === track.id)) {
        announce("This recording is already in the queue.");
        return;
      }

      shuffleSnapshotRef.current = null;
      if (!currentQueue.length || index < 0) {
        commitQueue([...currentQueue, track], 0);
        announce("Added to the queue.");
        return;
      }

      commitQueue([...currentQueue, track], index);
      announce("Added to the queue.");
    },
    [announce, commitQueue],
  );

  const removeFromQueue = useCallback(
    (index: number) => {
      const currentQueue = queueRef.current;
      if (index < 0 || index >= currentQueue.length) return;

      shuffleSnapshotRef.current = null;
      const nextQueue = currentQueue.filter((_, itemIndex) => itemIndex !== index);

      if (index === indexRef.current) {
        stopAudio();
        const nextIndex = nextQueue.length ? Math.min(index, nextQueue.length - 1) : -1;
        commitQueue(nextQueue, nextIndex);
        announce("Recording removed from the queue.");
        return;
      }

      const nextIndex = index < indexRef.current ? indexRef.current - 1 : indexRef.current;
      commitQueue(nextQueue, nextIndex);
    },
    [announce, commitQueue, stopAudio],
  );

  const reorderUpcoming = useCallback(
    (orderedIds: string[]) => {
      const currentQueue = queueRef.current;
      const index = indexRef.current;
      if (index < 0 || index >= currentQueue.length) return;

      const prefix = currentQueue.slice(0, index + 1);
      const upcoming = new Map(
        currentQueue.slice(index + 1).map((track) => [track.id, track] as const),
      );
      const reordered = orderedIds
        .map((id) => upcoming.get(id))
        .filter((track): track is Track => Boolean(track));

      if (reordered.length !== currentQueue.length - index - 1) return;
      commitQueue([...prefix, ...reordered], index);
    },
    [commitQueue],
  );

  const clearQueue = useCallback(() => {
    shuffleSnapshotRef.current = null;
    stopAudio();
    commitQueue([], -1);
    announce("The queue is empty.");
  }, [announce, commitQueue, stopAudio]);

  const toggleSelection = useCallback((trackId: string) => {
    setSelection((previous) =>
      previous.includes(trackId)
        ? previous.filter((id) => id !== trackId)
        : [...previous, trackId],
    );
  }, []);

  const clearSelection = useCallback(() => setSelection([]), []);

  const setQueueOpen = useCallback((open: boolean) => {
    setIsQueueOpen(open);
    if (open) setIsNowPlayingOpen(false);
  }, []);

  const setNowPlayingOpen = useCallback((open: boolean) => {
    setIsNowPlayingOpen(open);
    if (open) setIsQueueOpen(false);
  }, []);

  const dismissError = useCallback(() => clearError(), [clearError]);
  const dismissNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.volume, volume);
  }, [volume]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.muted, isMuted);
  }, [isMuted]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.shuffle, shuffle);
  }, [shuffle]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.repeat, repeat);
  }, [repeat]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.speed, playbackRate);
  }, [playbackRate]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.queue, {
      ids: queue.map((track) => track.id),
      index: currentIndex,
    });
    writeStorage(STORAGE_KEYS.lastTrackId, queue[currentIndex]?.id ?? null);
  }, [queue, currentIndex]);

  // Pause decorative motion while the tab is hidden; audio keeps playing.
  useEffect(() => {
    const update = () => {
      document.documentElement.dataset.tabHidden = document.hidden ? "true" : "false";
    };
    document.addEventListener("visibilitychange", update);
    update();
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(
    () => () => {
      if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
    },
    [],
  );

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] ?? null : null;
  const effectiveDuration = duration > 0 ? duration : currentTrack?.durationSeconds ?? 0;

  const value = useMemo<PlayerContextValue>(
    () => ({
      queue,
      currentIndex,
      currentTrack,
      isPlaying,
      isLoading,
      currentTime,
      duration: effectiveDuration,
      error,
      volume,
      isMuted,
      playbackRate,
      shuffle,
      repeat,
      selection,
      isQueueOpen,
      isNowPlayingOpen,
      notice,
      togglePlay,
      playAll,
      playCollection,
      shuffleAll,
      shuffleCollection,
      playTrack,
      playFromQueue,
      playSelection,
      next,
      previous,
      seek,
      seekBy,
      setVolume,
      toggleMute,
      setPlaybackRate,
      toggleShuffle,
      cycleRepeat,
      playNext,
      addToQueue,
      removeFromQueue,
      reorderUpcoming,
      clearQueue,
      toggleSelection,
      clearSelection,
      setQueueOpen,
      setNowPlayingOpen,
      dismissError,
      dismissNotice,
    }),
    [
      queue,
      currentIndex,
      currentTrack,
      isPlaying,
      isLoading,
      currentTime,
      effectiveDuration,
      error,
      volume,
      isMuted,
      playbackRate,
      shuffle,
      repeat,
      selection,
      isQueueOpen,
      isNowPlayingOpen,
      notice,
      togglePlay,
      playAll,
      playCollection,
      shuffleAll,
      shuffleCollection,
      playTrack,
      playFromQueue,
      playSelection,
      next,
      previous,
      seek,
      seekBy,
      setVolume,
      toggleMute,
      setPlaybackRate,
      toggleShuffle,
      cycleRepeat,
      playNext,
      addToQueue,
      removeFromQueue,
      reorderUpcoming,
      clearQueue,
      toggleSelection,
      clearSelection,
      setQueueOpen,
      setNowPlayingOpen,
      dismissError,
      dismissNotice,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" playsInline className="hidden" />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider");
  return context;
}
