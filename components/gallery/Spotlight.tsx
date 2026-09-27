"use client";

/** Soft cone of light above an exhibit slot. */
export function Spotlight({ className }: { className?: string }) {
  return (
    <div
      className={`room-spotlight ${className ?? ""}`}
      aria-hidden
    />
  );
}
