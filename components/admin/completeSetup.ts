export async function completeCuratorSetup(): Promise<void> {
  const response = await fetch("/api/admin/setup/complete", { method: "POST" });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Could not complete Curator setup.");
  }
}
