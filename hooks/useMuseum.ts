"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  getMuseumState,
  getServerMuseumState,
  initMuseum,
  selectExhibitsByRoom,
  selectMuseumStats,
  subscribeToMuseum,
  type MuseumErrorCode,
  type MuseumState,
  type MuseumStats,
} from "@/lib/museumStore";
import type { Exhibit, RoomId } from "@/lib/types";

/** Reads the museum and opens the database on first mount. */
export function useMuseum(): MuseumState {
  const state = useSyncExternalStore(
    subscribeToMuseum,
    getMuseumState,
    getServerMuseumState,
  );

  useEffect(() => {
    void initMuseum();
  }, []);

  return state;
}

export function useExhibit(id: string | undefined): {
  exhibit: Exhibit | undefined;
  ready: boolean;
  error: MuseumErrorCode | null;
} {
  const { exhibits, ready, error } = useMuseum();
  const exhibit = useMemo(
    () => (id ? exhibits.find((candidate) => candidate.id === id) : undefined),
    [exhibits, id],
  );
  return { exhibit, ready, error };
}

export function useRoomExhibits(room: RoomId): {
  exhibits: Exhibit[];
  ready: boolean;
} {
  const { exhibits, ready } = useMuseum();
  const roomExhibits = useMemo(
    () => selectExhibitsByRoom(exhibits, room),
    [exhibits, room],
  );
  return { exhibits: roomExhibits, ready };
}

export function useMuseumStats(): MuseumStats & { ready: boolean } {
  const { exhibits, ready } = useMuseum();
  const stats = useMemo(() => selectMuseumStats(exhibits), [exhibits]);
  return { ...stats, ready };
}
