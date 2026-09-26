import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AuthClientProvider } from "@/components/admin/AuthClientProvider";
import { LoginPanel } from "@/components/admin/LoginPanel";
import { enabledAuthMethods } from "@/lib/auth/config";
import { curatorExists, isCurator } from "@/lib/auth/curator";
import { getSession } from "@/lib/auth/session";
import { getServerTranslations } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const { t } = await getServerTranslations();
  const session = await getSession();

  if (!curatorExists()) {
    redirect("/admin/setup");
  }

  if (session?.user && isCurator(session.user)) {
    redirect("/admin");
  }

  return (
    <AuthClientProvider methods={enabledAuthMethods}>
      <AdminShell title={t.auth.curator.title}>
        <LoginPanel methods={enabledAuthMethods} copy={t.auth.login} />
      </AdminShell>
    </AuthClientProvider>
  );
}
