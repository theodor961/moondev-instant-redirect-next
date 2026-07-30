import {
  buildRedirectUrl,
  getRedirectTarget,
  UNKNOWN_SLUG_FALLBACK_URL,
} from "@/config/redirects";
import { EmbedShell } from "@/components/EmbedShell";
import { redirect } from "next/navigation";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const target = getRedirectTarget(slug);

  if (!target) {
    redirect(UNKNOWN_SLUG_FALLBACK_URL);
  }

  const destinationUrl = buildRedirectUrl(target);

  if (target.embed) {
    return <EmbedShell src={destinationUrl} />;
  }

  redirect(destinationUrl);
}
