"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { GalleryStop } from "@/lib/gallery/stops";

export interface GalleryContextValue {
  stop: GalleryStop;
  positionLabel: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({
  value,
  children,
}: {
  value: GalleryContextValue;
  children: ReactNode;
}) {
  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

export function useGalleryContext(): GalleryContextValue {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGalleryContext must be used within GalleryProvider.");
  }
  return context;
}

export function useGalleryContextOptional(): GalleryContextValue | null {
  return useContext(GalleryContext);
}
