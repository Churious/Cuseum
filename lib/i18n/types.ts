/**
 * Locale types for Cuseum.
 *
 * The interface language is a *preference*, not part of any URL: exhibit data,
 * room ids, type ids, and the IndexedDB schema never change with it.
 */

export type Locale = "ko" | "en";

/** Widens every string in a dictionary to `string` so translations can differ. */
export type Widened<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T extends object
      ? { -readonly [K in keyof T]: Widened<T[K]> }
      : T;
