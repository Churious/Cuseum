import Link from "next/link";
import { ArtworkImage } from "./Artwork";
import { formatExhibitDate, hostnameOf, snippet } from "@/lib/format";
import { useLocale, useTranslations } from "@/lib/i18n/useLocale";
import type { Exhibit } from "@/lib/types";

/**
 * How an exhibit is presented on a room wall. The five display styles are
 * variations on one design language: same artwork treatment, same label,
 * same restrained reveal on hover or keyboard focus.
 */
export function ExhibitPiece({ exhibit }: { exhibit: Exhibit }) {
  switch (exhibit.displayStyle) {
    case "frame":
      return <FramePiece exhibit={exhibit} />;
    case "poster":
      return <PosterPiece exhibit={exhibit} />;
    case "object":
      return <ObjectPiece exhibit={exhibit} />;
    case "screen":
      return <ScreenPiece exhibit={exhibit} />;
    case "document":
      return <DocumentPiece exhibit={exhibit} />;
    default:
      return <FramePiece exhibit={exhibit} />;
  }
}

function PieceLink({
  exhibit,
  children,
}: {
  exhibit: Exhibit;
  children: React.ReactNode;
}) {
  return (
    <Link href={`/exhibit/${exhibit.id}`} className="group block">
      {children}
      <PieceLabel exhibit={exhibit} />
    </Link>
  );
}

/** Images: matted, framed, hung. */
function FramePiece({ exhibit }: { exhibit: Exhibit }) {
  return (
    <PieceLink exhibit={exhibit}>
      <div className="bg-paper-raised p-3 ring-1 ring-line transition-shadow duration-700 group-hover:shadow-mount sm:p-4">
        <div className="ring-1 ring-line/70">
          <ArtworkImage exhibit={exhibit} className="aspect-[4/3] w-full" />
        </div>
      </div>
    </PieceLink>
  );
}

/** Music: a sleeve standing on a low shelf. */
function PosterPiece({ exhibit }: { exhibit: Exhibit }) {
  return (
    <PieceLink exhibit={exhibit}>
      <div className="bg-paper-raised p-2 ring-1 ring-line shadow-sheet transition-transform duration-700 group-hover:-translate-y-1">
        <ArtworkImage exhibit={exhibit} className="aspect-square w-full" />
      </div>
      <div className="mt-3 h-px w-full bg-line" aria-hidden />
    </PieceLink>
  );
}

/** Web: a small digital display with a thin bezel. */
function ScreenPiece({ exhibit }: { exhibit: Exhibit }) {
  const t = useTranslations();
  const source = hostnameOf(exhibit.url);

  return (
    <PieceLink exhibit={exhibit}>
      <div className="ring-1 ring-line transition-colors duration-700 group-hover:ring-line-strong">
        <div className="flex items-center gap-2 border-b border-line bg-paper-raised px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-line-strong" aria-hidden />
          <span className="label-caps truncate text-[0.6rem] tracking-[0.16em]">
            {source || t.exhibit.noSource}
          </span>
        </div>
        <div className="bg-paper-raised p-3">
          <ArtworkImage exhibit={exhibit} className="aspect-[16/10] w-full" />
        </div>
      </div>
    </PieceLink>
  );
}

/** Objects: sitting on a plinth, with the shadow to prove it. */
function ObjectPiece({ exhibit }: { exhibit: Exhibit }) {
  return (
    <PieceLink exhibit={exhibit}>
      <div className="flex flex-col items-center">
        <div className="flex h-[220px] w-full items-end justify-center sm:h-[260px]">
          <ArtworkImage
            exhibit={exhibit}
            fit="contain"
            className="max-h-[220px] w-auto max-w-full sm:max-h-[260px]"
          />
        </div>
        <div className="mt-3 h-2 w-3/5 rounded-[50%] bg-ink/10 blur-[6px]" aria-hidden />
        <div className="mt-1 h-px w-full bg-line" aria-hidden />
      </div>
    </PieceLink>
  );
}

/** Archive: a sheet laid out slightly askew. */
function DocumentPiece({ exhibit }: { exhibit: Exhibit }) {
  return (
    <PieceLink exhibit={exhibit}>
      <div className="rotate-[-0.5deg] bg-paper-raised p-5 ring-1 ring-line shadow-sheet transition-transform duration-700 group-hover:rotate-0">
        <ArtworkImage exhibit={exhibit} className="aspect-[3/4] w-full" />
      </div>
    </PieceLink>
  );
}

function PieceLabel({ exhibit }: { exhibit: Exhibit }) {
  const { t, locale } = useLocale();
  const detail = snippet(exhibit.description || exhibit.personalNote, 150);

  return (
    <div className="mt-4">
      <h3 className="font-display text-[1.35rem] leading-snug text-ink">
        {exhibit.title}
      </h3>
      <p className="label-caps mt-1.5 text-[0.65rem] tracking-[0.16em]">
        {t.exhibitTypes.labels[exhibit.type]} ·{" "}
        {formatExhibitDate(exhibit.createdAt, locale)}
      </p>
      {detail ? (
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-ink-soft opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
              {detail}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
