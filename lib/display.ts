/**
 * The visible marker for a business fact the client has not supplied yet, and
 * the helper that renders it.
 *
 * Deliberately in its own module with no imports: lib/site.ts pulls in the
 * zod-validated env, and a client component that only needed this string was
 * dragging the whole of zod into the browser bundle with it.
 */
export const TBD = '[TBD]';

/** Renders a value, or the visible [TBD] marker. Never invents data. */
export function display(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === '' ? TBD : String(value);
}
