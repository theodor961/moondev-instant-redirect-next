import {
  buildRedirectUrl,
  getRedirectTarget,
  UNKNOWN_SLUG_FALLBACK_URL,
} from "@/config/redirects";
import { EmbedShell } from "@/components/EmbedShell";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const target = getRedirectTarget(slug);
  if (target?.title) {
    return { title: target.title };
  }
  return { title: "Moondev Redirect" };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const target = getRedirectTarget(slug);

  if (!target) {
    redirect(UNKNOWN_SLUG_FALLBACK_URL);
  }

  const destinationUrl = buildRedirectUrl(target);

  if (target.embed) {
    return <EmbedShell src={destinationUrl} title={target.title} />;
  }

  redirect(destinationUrl);
}
