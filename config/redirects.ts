/**
 * Redirect config — single source of truth for short-link / QR slugs.
 * Used by /[slug]. Add new slugs here; no DB required.
 *
 * Either:
 * - Same-origin with query params: path + optional query map
 * - External link: url only (no params appended)
 *
 * Set `embed: true` to open the destination in-site via iframe + Moondev footer
 * instead of an HTTP redirect. The short URL itself stays unchanged (e.g. /ec).
 */

type RedirectOptions = {
  /** When true, render destination in an iframe with a Moondev footer. */
  embed?: boolean;
  /** Optional browser tab / document title for this slug. */
  title?: string;
};

/** Same-origin redirect with optional query params. */
export type RedirectInternal = RedirectOptions & {
  /** Optional path (e.g. "/upload"). Defaults to "/". */
  path?: string;
  /** Optional query string params appended to the destination. */
  query?: Record<string, string>;
};

/** External redirect; destination used as-is. */
export type RedirectExternal = RedirectOptions & {
  url: string;
};

export type RedirectTarget = RedirectInternal | RedirectExternal;

function isExternalRedirect(t: RedirectTarget): t is RedirectExternal {
  return "url" in t && typeof (t as RedirectExternal).url === "string";
}

/**
 * One entry per slug.
 *
 * Examples:
 *   sticker: { path: "/upload", query: { utm_source: "qr", utm_content: "sticker" } }
 *   instagram: { url: "https://www.instagram.com/..." }
 *   wedding: { url: "https://...", embed: true, title: "Camil & Elissa's Wedding" }
 */
const REDIRECT_MAP: Record<string, RedirectTarget> = {
  ec: {
    url: "https://www.wedtrove.com/event/YFvb0XMLLu",
    embed: true,
    title: "Camil & Elissa's Wedding",
  },
};

/** Normalized slug (lowercase) → target. Lookup is case-insensitive. */
const SLUG_MAP = (() => {
  const m = new Map<string, RedirectTarget>();
  for (const [slug, target] of Object.entries(REDIRECT_MAP)) {
    m.set(slug.toLowerCase().trim(), target);
  }
  return m;
})();

/** Resolve redirect target for a slug. Returns undefined for unknown slugs. */
export function getRedirectTarget(slug: string): RedirectTarget | undefined {
  if (!slug || typeof slug !== "string") return undefined;
  return SLUG_MAP.get(slug.toLowerCase().trim());
}

/** Redirect base URL for same-origin destinations (no trailing slash). */
export const REDIRECT_BASE_URL = (
  process.env.REDIRECT_BASE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Fallback when slug is unknown (302, never 301 — avoid caching wrong dest). */
export const UNKNOWN_SLUG_FALLBACK_URL = `${REDIRECT_BASE_URL}/`;

/** Build final redirect URL from a resolved target. */
export function buildRedirectUrl(target: RedirectTarget): string {
  if (isExternalRedirect(target)) {
    return target.url.trim();
  }

  const path = target.path?.trim() || "/";
  const pathNormalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${REDIRECT_BASE_URL}${pathNormalized}`);

  if (target.query) {
    for (const [key, value] of Object.entries(target.query)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}
