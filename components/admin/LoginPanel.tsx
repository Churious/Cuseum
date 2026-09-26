"use client";

import { useRouter } from "next/navigation";
import type { AuthMethod } from "@/lib/auth/config";
import { GitHubButton } from "./GitHubButton";
import { PasskeyButton } from "./PasskeyButton";
import { PasswordForm } from "./PasswordForm";

function MethodDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
      <span className="label-caps text-[0.62rem] text-ink-muted">{label}</span>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
    </div>
  );
}

export function LoginPanel({
  methods,
  copy,
}: {
  methods: readonly AuthMethod[];
  copy: {
    passkey: { label: string; pending: string };
    github: { label: string; pending: string };
    password: {
      email: string;
      password: string;
      submit: string;
      pending: string;
    };
    or: string;
  };
}) {
  const router = useRouter();

  async function afterSignIn() {
    router.push("/admin");
    router.refresh();
  }

  const showPasskey = methods.includes("passkey");
  const showGitHub = methods.includes("github");
  const showPassword = methods.includes("password");
  const showDivider = [showPasskey, showGitHub, showPassword].filter(Boolean).length > 1;

  return (
    <div className="grid gap-4">
      {showPasskey ? (
        <PasskeyButton
          label={copy.passkey.label}
          pendingLabel={copy.passkey.pending}
          onSuccess={afterSignIn}
        />
      ) : null}

      {showPasskey && (showGitHub || showPassword) && showDivider ? (
        <MethodDivider label={copy.or} />
      ) : null}

      {showGitHub ? (
        <GitHubButton
          label={copy.github.label}
          pendingLabel={copy.github.pending}
          callbackURL="/admin"
        />
      ) : null}

      {showGitHub && showPassword && showDivider ? <MethodDivider label={copy.or} /> : null}

      {showPassword ? (
        <PasswordForm
          emailLabel={copy.password.email}
          passwordLabel={copy.password.password}
          submitLabel={copy.password.submit}
          pendingLabel={copy.password.pending}
          onSuccess={afterSignIn}
        />
      ) : null}
    </div>
  );
}
