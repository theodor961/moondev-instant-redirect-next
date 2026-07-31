export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Moondev Redirect
      </h1>
      <p className="mt-3 max-w-md text-center text-zinc-600">
        Pure redirection engine. Visit{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-800">
          /[slug]
        </code>{" "}
        to resolve a configured short link.
      </p>
    </main>
  );
}
