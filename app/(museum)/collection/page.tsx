import type { Metadata } from "next";
import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { getServerTranslations } from "@/lib/i18n/server";
import { isRoomId } from "@/lib/rooms";
import type { RoomId } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return { title: t.collection.eyebrow, description: t.collection.intro };
}

interface CollectionPageProps {
  searchParams: Promise<{ room?: string }>;
}

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const { room } = await searchParams;
  const initialRoom: RoomId | undefined = room && isRoomId(room) ? room : undefined;

  return <CollectionBrowser initialRoom={initialRoom} />;
}
