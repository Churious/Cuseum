"use client";

import { useState, type FormEvent } from "react";
import { useAuthClient } from "./AuthClientProvider";

export function PasswordForm({
  emailLabel,
  passwordLabel,
  submitLabel,
  pendingLabel,
  onSuccess,
}: {
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
  pendingLabel: string;
  onSuccess?: () => Promise<void> | void;
}) {
  const authClient = useAuthClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Sign-in failed.");
        return;
      }
      await onSuccess?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="label-caps text-ink-muted">{emailLabel}</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="border border-line bg-paper-raised px-3 py-2 text-sm"
        />
      </label>
      <label className="grid gap-2">
        <span className="label-caps text-ink-muted">{passwordLabel}</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="border border-line bg-paper-raised px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full border border-ink bg-ink px-4 py-3 text-sm text-paper transition-opacity duration-300 hover:opacity-90 disabled:opacity-50"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
      {error ? <p className="text-xs text-clay">{error}</p> : null}
    </form>
  );
}
