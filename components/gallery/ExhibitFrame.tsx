"use client";

import Link from "next/link";
import { ArtworkImage } from "@/components/exhibit/Artwork";
import { hostnameOf } from "@/lib/format";
import { useTranslations } from "@/lib/i18n/useLocale";
import type { DisplayStyle, Exhibit } from "@/lib/types";
import { CaptionPlate } from "./CaptionPlate";
import { EmptyExhibitionState } from "./EmptyExhibitionState";
import { Pedestal } from "./Pedestal";
import { Spotlight } from "./Spotlight";

export function ExhibitFrame({
  exhibit,
  presentation,
  rotate,
}: {
  exhibit?: Exhibit;
  presentation: DisplayStyle;
  rotate?: string;
}) {
  const style = rotate ? { transform: `rotate(${rotate})` } : undefined;

  if (!exhibit) {
    return (
      <figure className="room-exhibit" style={style}>
        <Spotlight />
        <EmptyExhibitionState presentation={presentation} />
      </figure>
    );
  }

  const resolved = exhibit.displayStyle || presentation;

  return (
    <figure className="room-exhibit" style={style}>
      <Spotlight />
      <Link
        href={`/exhibit/${exhibit.id}`}
        className={`room-exhibit__link room-exhibit__link--${resolved} group`}
      >
        <FrameSurface exhibit={exhibit} presentation={resolved} />
        <CaptionPlate exhibit={exhibit} compact />
      </Link>
    </figure>
  );
}

function FrameSurface({
  exhibit,
  presentation,
}: {
  exhibit: Exhibit;
  presentation: DisplayStyle;
}) {
  const t = useTranslations();
  const source = hostnameOf(exhibit.url);

  switch (presentation) {
    case "poster":
      return (
        <div className="room-frame room-frame--poster">
          <div className="room-frame__poster-body">
            <ArtworkImage exhibit={exhibit} className="aspect-square w-full" />
          </div>
          <div className="room-frame__shelf" aria-hidden />
        </div>
      );
    case "screen":
      return (
        <div className="room-frame room-frame--screen">
          <div className="room-frame__bezel">
            <div className="room-frame__screen-bar">
              <span className="room-frame__led" aria-hidden />
              <span className="room-frame__url">{source || t.exhibit.noSource}</span>
            </div>
            <ArtworkImage exhibit={exhibit} className="aspect-[16/10] w-full" />
          </div>
        </div>
      );
    case "object":
      return (
        <Pedestal glass>
          <ArtworkImage
            exhibit={exhibit}
            fit="contain"
            className="max-h-[120px] w-auto max-w-full sm:max-h-[140px]"
          />
        </Pedestal>
      );
    case "document":
      return (
        <div className="room-frame room-frame--document">
          <ArtworkImage exhibit={exhibit} className="aspect-[3/4] w-full" />
        </div>
      );
    case "frame":
    default:
      return (
        <div className="room-frame room-frame--painting">
          <div className="room-frame__outer">
            <div className="room-frame__mat">
              <ArtworkImage exhibit={exhibit} className="aspect-[4/3] w-full" />
            </div>
          </div>
        </div>
      );
  }
}
