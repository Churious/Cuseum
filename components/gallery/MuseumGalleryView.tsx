"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMuseum } from "@/hooks/useMuseum";
import { useLocale } from "@/lib/i18n/useLocale";
import {
  GALLERY_STOPS,
  galleryStopFromIndex,
  galleryStopIndex,
  pathForGalleryStop,
  type GalleryStop,
} from "@/lib/gallery/stops";
import { themeForStop, themeToStyle } from "@/lib/gallery/room-themes";
import { GalleryProvider } from "./GalleryContext";
import { GalleryWall, GalleryWallWithError } from "./GalleryWall";
import { MuseumPlaqueHeader } from "./MuseumPlaqueHeader";
import { MuseumRoomShell } from "./MuseumRoomShell";

export function MuseumGalleryView({ initialStop }: { initialStop: GalleryStop }) {
  const router = useRouter();
  const pathname = usePathname();
  const { error } = useMuseum();
  const { t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(() => galleryStopIndex(initialStop));
  const [motion, setMotion] = useState<"left" | "right" | "none">("none");

  useEffect(() => {
    setActiveIndex(galleryStopIndex(initialStop));
  }, [initialStop]);

  const activeStop = galleryStopFromIndex(activeIndex);
  const positionLabel = t.gallery.position(activeIndex + 1, GALLERY_STOPS.length);
  const themeStyle = themeToStyle(themeForStop(activeStop));

  const navigateToIndex = useCallback(
    (nextIndex: number, direction: "left" | "right") => {
      const normalized =
        ((nextIndex % GALLERY_STOPS.length) + GALLERY_STOPS.length) % GALLERY_STOPS.length;
      const stop = galleryStopFromIndex(normalized);
      setMotion(direction);
      setActiveIndex(normalized);
      const target = pathForGalleryStop(stop);
      if (pathname !== target) {
        router.replace(target, { scroll: false });
      }
    },
    [pathname, router],
  );

  const onPrev = useCallback(() => {
    navigateToIndex(activeIndex - 1, "left");
  }, [activeIndex, navigateToIndex]);

  const onNext = useCallback(() => {
    navigateToIndex(activeIndex + 1, "right");
  }, [activeIndex, navigateToIndex]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNext, onPrev]);

  useEffect(() => {
    if (motion === "none") {
      return;
    }
    const timer = window.setTimeout(() => setMotion("none"), 620);
    return () => window.clearTimeout(timer);
  }, [motion, activeIndex]);

  const contextValue = useMemo(
    () => ({
      stop: activeStop,
      positionLabel,
      onPrev,
      onNext,
      canPrev: true,
      canNext: true,
    }),
    [activeStop, onNext, onPrev, positionLabel],
  );

  return (
    <GalleryProvider value={contextValue}>
      <div className="gallery-view" style={themeStyle}>
        <MuseumPlaqueHeader />

        <MuseumRoomShell>
          <div
            className={`gallery-carousel gallery-carousel--${motion}`}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {GALLERY_STOPS.map((stop) => (
              <div key={stop} className="gallery-carousel__pane" aria-hidden={stop !== activeStop}>
                {error ? (
                  stop === activeStop ? (
                    <GalleryWallWithError error={t.errors.storage} />
                  ) : null
                ) : (
                  <GalleryWall stop={stop} />
                )}
              </div>
            ))}
          </div>
        </MuseumRoomShell>
      </div>
    </GalleryProvider>
  );
}
