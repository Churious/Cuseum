"use client";

import { useState } from "react";
import { useAuthClient } from "./AuthClientProvider";

export function PasskeyButton({
  label,
  pendingLabel,
  onSuccess,
}: {
  label: string;
  pendingLabel: string;
  onSuccess?: () => Promise<void> | void;
}) {
  const authClient = useAuthClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);

    try {
      const result = await authClient.signIn.passkey();
      if (result.error) {
        setError(result.error.message ?? "Passkey sign-in failed.");
        return;
      }
      await onSuccess?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Passkey sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full border border-ink bg-ink px-4 py-3 text-sm text-paper transition-opacity duration-300 hover:opacity-90 disabled:opacity-50"
      >
        {pending ? pendingLabel : label}
      </button>
      {error ? <p className="text-xs text-clay">{error}</p> : null}
    </div>
  );
}
