import { CuratorPage } from "@/components/admin/CuratorPage";
import { ExhibitForm } from "@/components/exhibit/ExhibitForm";
import { requireCuratorPage } from "@/lib/auth/admin-page";
import { getServerTranslations } from "@/lib/i18n/server";
import { isRoomId } from "@/lib/rooms";
import type { RoomId } from "@/lib/types";

export const dynamic = "force-dynamic";

interface AdminNewExhibitPageProps {
  searchParams: Promise<{ room?: string }>;
}

export default async function AdminNewExhibitPage({ searchParams }: AdminNewExhibitPageProps) {
  await requireCuratorPage();
  const { t } = await getServerTranslations();
  const { room } = await searchParams;
  const initialRoom: RoomId | undefined = room && isRoomId(room) ? room : undefined;

  return (
    <CuratorPage
      wide
      title={t.newExhibit.title}
      subtitle={t.newExhibit.intro}
      backHref="/admin"
      backLabel={t.auth.admin.backToDashboard}
    >
      <ExhibitForm
        mode="create"
        initialRoom={initialRoom}
        paths={{
          cancel: "/admin",
          afterSave: (exhibit) => `/exhibit/${exhibit.id}`,
        }}
      />
    </CuratorPage>
  );
}
