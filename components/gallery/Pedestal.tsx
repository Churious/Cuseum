"use client";

import type { ReactNode } from "react";

/** Low museum plinth with floor shadow — for object exhibits. */
export function Pedestal({
  children,
  glass = false,
}: {
  children: ReactNode;
  glass?: boolean;
}) {
  return (
    <div className={`room-pedestal ${glass ? "room-pedestal--glass" : ""}`}>
      <div className="room-pedestal__top">{children}</div>
      <div className="room-pedestal__stem" aria-hidden />
      <div className="room-pedestal__shadow" aria-hidden />
    </div>
  );
}
