import { CuratorPage } from "@/components/admin/CuratorPage";
import { CuratorWorkspace } from "@/components/admin/CuratorWorkspace";
import { requireCuratorPage } from "@/lib/auth/admin-page";
import { getServerTranslations } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireCuratorPage();
  const { t } = await getServerTranslations();

  return (
    <CuratorPage
      wide
      title={t.auth.curator.title}
      subtitle={t.auth.curator.signedIn}
    >
      <CuratorWorkspace />
    </CuratorPage>
  );
}
