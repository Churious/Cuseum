import type { Metadata } from "next";
import { MuseumGalleryView } from "@/components/gallery/MuseumGalleryView";
import { getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return {
    title: t.roomsIndex.title,
    description: t.roomsIndex.intro,
  };
}

export default function RoomsPage() {
  return <MuseumGalleryView initialStop="lobby" />;
}
