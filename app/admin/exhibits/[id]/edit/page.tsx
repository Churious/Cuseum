import { CuratorPage } from "@/components/admin/CuratorPage";
import { ExhibitEditor } from "@/components/exhibit/ExhibitEditor";
import { requireCuratorPage } from "@/lib/auth/admin-page";
import { getServerTranslations } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminEditExhibitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCuratorPage();
  const { t } = await getServerTranslations();
  const { id } = await params;

  return (
    <CuratorPage
      wide
      title={t.editExhibit.title}
      subtitle={t.editExhibit.intro}
      backHref="/admin"
      backLabel={t.auth.admin.backToDashboard}
    >
      <ExhibitEditor
        id={id}
        paths={{
          collection: "/admin",
          cancel: `/exhibit/${id}`,
          afterWithdraw: "/admin",
        }}
      />
    </CuratorPage>
  );
}
