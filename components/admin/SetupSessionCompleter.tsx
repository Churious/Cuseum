"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { completeCuratorSetup } from "./completeSetup";

export function SetupSessionCompleter({
  active,
  pendingLabel,
}: {
  active: boolean;
  pendingLabel: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        await completeCuratorSetup();
        if (!cancelled) {
          router.push("/admin");
          router.refresh();
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Could not complete Curator setup.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, router]);

  if (error) {
    return <p className="text-xs text-clay">{error}</p>;
  }

  if (active) {
    return <p className="text-xs text-ink-muted">{pendingLabel}</p>;
  }

  return null;
}
