"use client";

import { Poppins } from "next/font/google";
import { useEffect, useState, useSyncExternalStore } from "react";

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
 * Direct cross-origin iframe (no HTML proxy — avoids CORS breakage).
 *
 * Mobile: outer wrapper scrolls; iframe height is a modest multiple of the
 * viewport so touch-scroll works on iOS without a huge empty 5000px frame.
 * Desktop: viewport iframe with normal internal scrolling.
 */
export function EmbedShell({ src, title }: EmbedShellProps) {
  const mobile = useSyncExternalStore(subscribe, isMobile, () => true);
  const iframeTitle = title ?? "Embedded content";
  const [mobileFramePx, setMobileFramePx] = useState(0);

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

  useEffect(() => {
    if (!mobile) return;

    const update = () => {
      // ~2 viewports: enough for typical event pages + iOS wrapper scroll,
      // without the huge empty gap from a 5000px frame.
      setMobileFramePx(Math.round(window.innerHeight * 2));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [mobile]);

  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div
          className="absolute inset-0 overflow-y-auto overscroll-contain"
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
              display: "block",
              height: mobileFramePx ? `${mobileFramePx}px` : "200vh",
            }}
          />
        </div>
        <PoweredByBar />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
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
