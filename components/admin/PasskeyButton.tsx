"use client";

import { startAuthentication } from "@simplewebauthn/browser";
import { useState } from "react";

export function PasskeyButton({
  label,
  pendingLabel,
  onSuccess,
}: {
  label: string;
  pendingLabel: string;
  onSuccess?: () => Promise<void> | void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);

    try {
      const optionsResponse = await fetch("/api/admin/passkey/login-options", {
        credentials: "include",
      });

      if (!optionsResponse.ok) {
        const payload = (await optionsResponse.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Passkey sign-in failed.");
        return;
      }

      const options = await optionsResponse.json();
      const authResponse = await startAuthentication({ optionsJSON: options });

      const verifyResponse = await fetch("/api/auth/passkey/verify-authentication", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: authResponse }),
      });

      if (!verifyResponse.ok) {
        const payload = (await verifyResponse.json().catch(() => null)) as { message?: string } | null;
        setError(payload?.message ?? "Passkey sign-in failed.");
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
