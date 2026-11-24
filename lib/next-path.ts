/** Only same-site paths are allowed as a post-sign-in destination (no open redirects). */
export function safeNextPath(raw: string | null | undefined, fallback = "/"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}

export function loginHref(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}
