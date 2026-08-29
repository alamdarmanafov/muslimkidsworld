import { Nav } from "./Nav";

export function ComingSoon({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <main>
      <Nav />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <span className="text-6xl">{emoji}</span>
        <h1 className="mt-6 text-3xl font-extrabold text-ink">{title}</h1>
        <p className="mt-3 text-inkMuted">{body}</p>
      </div>
    </main>
  );
}
