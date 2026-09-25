"use client";

import type { ReactNode } from "react";

export type LookupStatus = "idle" | "loading" | "done" | "failed";

/** A labelled row: small caps term on the left, the field on the right. */
export function FormRow({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 border-t border-line pt-7 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12">
      <label htmlFor={htmlFor} className="label-caps md:pt-1">
        {label}
      </label>
      <div className="min-w-0">
        {children}
        {hint ? (
          <p className="mt-3 max-w-[52ch] text-xs leading-relaxed text-ink-muted">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

export interface Choice<T extends string> {
  value: T;
  label: string;
  hint: string;
}

/** A quiet row of words instead of dropdowns, pills, or coloured tags. */
export function ChoiceRow<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly Choice<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <div role="group" aria-label={legend}>
      <div className="flex flex-wrap gap-x-7 gap-y-3">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`label-caps border-b pb-1 text-[0.68rem] tracking-[0.16em] transition-colors duration-300 ${
                isSelected
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {selected ? (
        <p className="mt-4 max-w-[46ch] text-xs italic leading-relaxed text-ink-muted">
          {selected.hint}
        </p>
      ) : null}
    </div>
  );
}

/** What the museum is saying while it reads a page. */
export function LookupNote({
  status,
  message,
  onRetry,
}: {
  status: LookupStatus;
  message: string;
  onRetry?: () => void;
}) {
  if (status === "idle" && !message) {
    return null;
  }

  return (
    <p
      role="status"
      aria-live="polite"
      className="mt-3 flex flex-wrap items-baseline gap-x-4 text-xs italic text-ink-muted"
    >
      <span>{message}</span>
      {onRetry && status === "failed" ? (
        <button type="button" onClick={onRetry} className="label-caps link-quiet">
          Try again
        </button>
      ) : null}
    </p>
  );
}
