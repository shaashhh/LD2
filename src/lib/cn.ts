/** Tiny class-name joiner — avoids pulling in another dependency. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
