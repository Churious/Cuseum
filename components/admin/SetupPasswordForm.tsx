"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SetupPasswordForm({
  emailLabel,
  passwordLabel,
  submitLabel,
  pendingLabel,
}: {
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
  pendingLabel: string;
}) {
  const router = useRouter();
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
      const response = await fetch("/api/admin/setup/password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Could not create Curator account.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create Curator account.");
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
          autoComplete="new-password"
          minLength={12}
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
