"use client";

import { useEffect } from "react";
import { initMuseum } from "@/lib/museumStore";

/**
 * Opens the browser-side collection once, quietly.
 * Renders nothing — it only makes sure the museum is unlocked before a screen
 * asks for exhibits.
 */
export function MuseumRuntime() {
  useEffect(() => {
    void initMuseum();
  }, []);

  return null;
}
