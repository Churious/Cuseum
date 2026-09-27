"use client";

import {
  CollectionPrompt,
  LobbyHero,
  RoomsHeading,
} from "@/components/lobby/LobbyText";
import { LobbyScene25D } from "@/components/lobby/LobbyScene25D";
import { RoomIndex } from "@/components/lobby/RoomIndex";
import { TakeMeSomewhere } from "@/components/lobby/TakeMeSomewhere";
import { CollectionPlaque } from "@/components/lobby/CollectionPlaque";

/** Lobby with CSS-driven split: 2D on mobile / reduced motion, 2.5D on desktop. */
export function LobbyExperience() {
  return (
    <>
      <div className="md:motion-safe:hidden">
        <LobbyHero />

        <section aria-labelledby="rooms-heading" className="pt-4">
          <RoomsHeading />
          <div className="mt-6">
            <RoomIndex />
          </div>
        </section>

        <section className="mt-24 flex flex-col gap-16 md:mt-32 md:flex-row md:items-end md:justify-between">
          <TakeMeSomewhere />
          <div className="md:text-right">
            <CollectionPlaque />
            <CollectionPrompt />
          </div>
        </section>
      </div>

      <div className="hidden md:motion-safe:block">
        <LobbyScene25D />
      </div>
    </>
  );
}
