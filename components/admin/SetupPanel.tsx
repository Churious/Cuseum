"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuthMethod } from "@/lib/auth/config";
import { completeCuratorSetup } from "./completeSetup";
import { GitHubButton } from "./GitHubButton";
import { RegisterPasskeyButton } from "./RegisterPasskeyButton";
import { SetupPasswordForm } from "./SetupPasswordForm";

function MethodChoice({
  label,
  hint,
  recommended,
  onSelect,
}: {
  label: string;
  hint?: string;
  recommended?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full border px-4 py-3 text-left text-sm transition-colors duration-300 ${
        recommended
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper-raised text-ink hover:border-line-strong"
      }`}
    >
      <span className="block">{label}</span>
      {hint ? (
        <span
          className={`mt-1 block text-xs ${recommended ? "text-paper/75" : "text-ink-muted"}`}
        >
          {hint}
        </span>
      ) : null}
    </button>
  );
}

export function SetupPanel({
  methods,
  copy,
}: {
  methods: readonly AuthMethod[];
  copy: {
    chooseMethod: string;
    changeMethod: string;
    passkey: { label: string; pending: string };
    github: { label: string; pending: string };
    password: {
      email: string;
      password: string;
      submit: string;
      pending: string;
    };
    methods: {
      passkey: string;
      github: string;
      password: string;
    };
    hints: {
      passkey: string;
      github: string;
      password: string;
    };
    recommended: string;
  };
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<AuthMethod | null>(
    methods.length === 1 ? methods[0]! : null,
  );

  async function finishPasskeyOrGitHubSetup() {
    await completeCuratorSetup();
    router.push("/admin");
    router.refresh();
  }

  if (methods.length > 1 && !selected) {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-ink-muted">{copy.chooseMethod}</p>
        {methods.includes("passkey") ? (
          <MethodChoice
            label={`${copy.methods.passkey} (${copy.recommended})`}
            hint={copy.hints.passkey}
            recommended
            onSelect={() => setSelected("passkey")}
          />
        ) : null}
        {methods.includes("github") ? (
          <MethodChoice
            label={copy.methods.github}
            hint={copy.hints.github}
            onSelect={() => setSelected("github")}
          />
        ) : null}
        {methods.includes("password") ? (
          <MethodChoice
            label={copy.methods.password}
            hint={copy.hints.password}
            onSelect={() => setSelected("password")}
          />
        ) : null}
      </div>
    );
  }

  const method = selected ?? methods[0]!;

  return (
    <div className="grid gap-4">
      {methods.length > 1 ? (
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="label-caps w-fit text-[0.62rem] text-ink-muted hover:text-ink"
        >
          {copy.changeMethod}
        </button>
      ) : null}

      {method === "passkey" ? (
        <RegisterPasskeyButton
          label={copy.passkey.label}
          pendingLabel={copy.passkey.pending}
          onSuccess={finishPasskeyOrGitHubSetup}
        />
      ) : null}

      {method === "github" ? (
        <GitHubButton
          label={copy.github.label}
          pendingLabel={copy.github.pending}
          callbackURL="/admin/setup"
        />
      ) : null}

      {method === "password" ? (
        <SetupPasswordForm
          emailLabel={copy.password.email}
          passwordLabel={copy.password.password}
          submitLabel={copy.password.submit}
          pendingLabel={copy.password.pending}
        />
      ) : null}
    </div>
  );
}
