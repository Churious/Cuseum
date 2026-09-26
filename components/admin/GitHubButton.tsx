"use client";

import { useState } from "react";
import { useAuthClient } from "./AuthClientProvider";

export function GitHubButton({
  label,
  pendingLabel,
  callbackURL,
}: {
  label: string;
  pendingLabel: string;
  callbackURL: string;
}) {
  const authClient = useAuthClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "GitHub sign-in failed.");
      setPending(false);
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full border border-line bg-paper-raised px-4 py-3 text-sm text-ink transition-colors duration-300 hover:border-line-strong disabled:opacity-50"
      >
        {pending ? pendingLabel : label}
      </button>
      {error ? <p className="text-xs text-clay">{error}</p> : null}
    </div>
  );
}
