import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type EmbedShellProps = {
  src: string;
};

export function EmbedShell({ src }: EmbedShellProps) {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-white">
      <iframe
        src={src}
        title="Embedded content"
        className="absolute inset-0 h-full w-full border-0 bg-white"
        allow="accelerometer; autoplay; camera; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; payment; picture-in-picture; usb"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <footer
        className={`${poppins.className} absolute inset-x-0 bottom-0 z-10 flex items-center justify-center border-t border-black/5 bg-white/70 px-4 py-2.5 backdrop-blur-md`}
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
