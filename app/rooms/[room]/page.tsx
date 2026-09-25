import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomWall } from "@/components/room/RoomWall";
import { getServerTranslations } from "@/lib/i18n/server";
import { isRoomId } from "@/lib/rooms";

interface RoomPageProps {
  params: Promise<{ room: string }>;
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { room } = await params;
  const { t } = await getServerTranslations();

  if (!isRoomId(room)) {
    return { title: t.notFound.eyebrow };
  }
  return { title: t.rooms.names[room], description: t.rooms.taglines[room] };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { room } = await params;

  if (!isRoomId(room)) {
    notFound();
  }

  return <RoomWall room={room} />;
}
