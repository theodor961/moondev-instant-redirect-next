"use client";

import { Poppins } from "next/font/google";
import { useEffect } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type EmbedShellProps = {
  src: string;
  title?: string;
};

export function EmbedShell({ src, title }: EmbedShellProps) {
  const iframeTitle = title ?? "Embedded content";

  useEffect(() => {
    if (title) document.title = title;

    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyBg: body.style.backgroundColor,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.backgroundColor = "#fff";

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.backgroundColor = prev.bodyBg;
    };
  }, [title]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <iframe
        src={src}
        title={iframeTitle}
        className="min-h-0 w-full flex-1 border-0 bg-white"
        allow="accelerometer; autoplay; camera; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; payment; picture-in-picture; usb"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <footer
        className={`${poppins.className} flex shrink-0 items-center justify-center border-t border-black/5 bg-white/70 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md`}
      >
        <p className="text-xs tracking-wide text-black/60">
          Powered by{" "}
          <a
            href="https://moondev.solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-black underline-offset-2 hover:underline"
          >
            Moondev
          </a>
        </p>
      </footer>
    </div>
  );
}
