import type { Metadata } from "next";
import { RoomsIntro } from "@/components/rooms/RoomsIntro";
import { RoomIndex } from "@/components/lobby/RoomIndex";
import { getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return {
    title: t.roomsIndex.title,
    description: t.roomsIndex.intro,
  };
}

export default function RoomsPage() {
  return (
    <div>
      <RoomsIntro />

      <div className="mt-14 md:mt-20">
        <RoomIndex />
      </div>
    </div>
  );
}
