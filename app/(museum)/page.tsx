import type { Metadata } from "next";
import { MuseumGalleryView } from "@/components/gallery/MuseumGalleryView";
import { getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return { title: t.brand.tagline };
}

export default function LobbyPage() {
  return <MuseumGalleryView initialStop="lobby" />;
}
