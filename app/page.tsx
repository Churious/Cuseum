import type { Metadata } from "next";
import { CollectionPlaque } from "@/components/lobby/CollectionPlaque";
import {
  CollectionPrompt,
  LobbyHero,
  RoomsHeading,
} from "@/components/lobby/LobbyText";
import { RoomIndex } from "@/components/lobby/RoomIndex";
import { SampleDataControls } from "@/components/lobby/SampleDataControls";
import { TakeMeSomewhere } from "@/components/lobby/TakeMeSomewhere";
import { getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return { title: t.brand.tagline };
}

export default function LobbyPage() {
  return (
    <>
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

      <section className="mt-24 md:mt-32">
        <SampleDataControls />
      </section>
    </>
  );
}
