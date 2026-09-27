"use client";

import { useEffect, useState } from "react";

const DESKTOP_MUSEUM_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/** True on desktop (≥768px) when the visitor has not requested reduced motion. */
export function useDesktopMuseum(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MUSEUM_QUERY);
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return enabled;
}

export { DESKTOP_MUSEUM_QUERY };
