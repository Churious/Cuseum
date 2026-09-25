import type { Metadata } from "next";
import { ExhibitForm } from "@/components/exhibit/ExhibitForm";
import { getServerTranslations } from "@/lib/i18n/server";
import { isRoomId } from "@/lib/rooms";
import type { RoomId } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return { title: t.newExhibit.eyebrow, description: t.newExhibit.intro };
}

interface NewExhibitPageProps {
  searchParams: Promise<{ room?: string }>;
}

export default async function NewExhibitPage({ searchParams }: NewExhibitPageProps) {
  const { room } = await searchParams;
  const initialRoom: RoomId | undefined =
    room && isRoomId(room) ? room : undefined;

  return <ExhibitForm mode="create" initialRoom={initialRoom} />;
}
