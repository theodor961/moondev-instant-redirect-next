"use client";

import { Poppins } from "next/font/google";
import { useEffect, useSyncExternalStore } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type EmbedShellProps = {
  src: string;
  title?: string;
};

function subscribe() {
  return () => {};
}

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function PoweredByBar() {
  return (
    <footer
      className={`${poppins.className} pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center border-t border-black/5 bg-white/70 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md`}
    >
      <p className="pointer-events-auto text-xs tracking-wide text-black/60">
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
  );
}

/**
 * Overlay bar + scrollable destination.
 *
 * Mobile: cross-origin iframes often cannot scroll internally. Use a tall
 * iframe inside a touch-scroll wrapper so the *wrapper* scrolls, while the
 * Moondev bar stays overlaid (pointer-events-none).
 *
 * Desktop: full-viewport iframe with normal internal scrolling.
 */
export function EmbedShell({ src, title }: EmbedShellProps) {
  const mobile = useSyncExternalStore(subscribe, isMobile, () => true);
  const iframeTitle = title ?? "Embedded content";

  useEffect(() => {
    if (!title) return;
    document.title = title;
  }, [title]);

  if (mobile) {
    return (
      <div className="relative h-dvh w-full bg-white">
        <div
          className="h-full w-full overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <iframe
            src={src}
            title={iframeTitle}
            className="block border-0 bg-white"
            allow="accelerometer; autoplay; camera; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; payment; picture-in-picture; usb"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: "1px",
              minWidth: "100%",
              height: "5000px",
              display: "block",
            }}
          />
        </div>
        <PoweredByBar />
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full bg-white">
      <iframe
        src={src}
        title={iframeTitle}
        className="absolute inset-0 h-full w-full border-0 bg-white"
        allow="accelerometer; autoplay; camera; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; payment; picture-in-picture; usb"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <PoweredByBar />
    </div>
  );
}
