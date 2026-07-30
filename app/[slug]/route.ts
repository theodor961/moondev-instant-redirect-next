import {
  buildRedirectUrl,
  getRedirectTarget,
  UNKNOWN_SLUG_FALLBACK_URL,
} from "@/config/redirects";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * GET /[slug] — HTTP redirect for short-link / QR URLs.
 * No HTML is rendered; 302 keeps destinations non-cached for accurate routing.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const target = getRedirectTarget(slug);

  if (!target) {
    return NextResponse.redirect(UNKNOWN_SLUG_FALLBACK_URL, 302);
  }

  return NextResponse.redirect(buildRedirectUrl(target), 302);
}
