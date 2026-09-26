import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AuthClientProvider } from "@/components/admin/AuthClientProvider";
import { SetupPanel } from "@/components/admin/SetupPanel";
import { SetupSessionCompleter } from "@/components/admin/SetupSessionCompleter";
import { enabledAuthMethods } from "@/lib/auth/config";
import { isCurator } from "@/lib/auth/curator";
import { auth } from "@/lib/auth/server";
import { isCuratorSetupAllowed, verifySetupCookieValue } from "@/lib/auth/setup";
import { getServerTranslations } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  const { t } = await getServerTranslations();

  if (!isCuratorSetupAllowed()) {
    redirect("/admin/login");
  }

  const jar = await cookies();
  const setupAuthorized = verifySetupCookieValue(jar.get("cuseum.setup")?.value);

  if (!setupAuthorized) {
    return (
      <AdminShell title={t.auth.setup.title} subtitle={t.auth.setup.secretRequired}>
        <p className="text-center text-sm text-ink-muted">{t.auth.setup.secretHint}</p>
      </AdminShell>
    );
  }

  const session = await auth.api.getSession({
    headers: new Headers({ cookie: jar.toString() }),
  });

  if (session?.user && isCurator(session.user)) {
    redirect("/admin");
  }

  const awaitingGitHubCompletion =
    session?.user !== undefined &&
    enabledAuthMethods.includes("github") &&
    !isCurator(session.user);

  return (
    <AuthClientProvider methods={enabledAuthMethods}>
      <AdminShell title={t.auth.setup.title} subtitle={t.auth.setup.subtitle}>
        {awaitingGitHubCompletion ? (
          <SetupSessionCompleter
            active
            pendingLabel={t.auth.setup.completing}
          />
        ) : (
          <SetupPanel methods={enabledAuthMethods} copy={t.auth.setup} />
        )}
      </AdminShell>
    </AuthClientProvider>
  );
}
