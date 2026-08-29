import Link from "next/link";
import { IconBadge } from "../components/IconBadge";
import { Nav } from "../components/Nav";

const loveFeatures = [
  {
    emoji: "🧠",
    tone: "purple" as const,
    title: "Daily 10 Quiz",
    body: "Fun quizzes every day to learn and earn XP.",
  },
  {
    emoji: "📗",
    tone: "teal" as const,
    title: "Islamic Lessons",
    body: "Beautiful lessons on Quran, Prophets, Duas and more.",
  },
  {
    emoji: "🎮",
    tone: "orange" as const,
    title: "Exciting Games",
    body: "Play fun games and unlock amazing rewards.",
  },
  {
    emoji: "🌳",
    tone: "green" as const,
    title: "Good Deeds",
    body: "Do good deeds and watch your tree grow!",
  },
  {
    emoji: "🎁",
    tone: "pink" as const,
    title: "Rewards & World",
    body: "Collect rewards and build your own world!",
  },
];

const stats = [
  { emoji: "👨‍👩‍👧", tone: "purple" as const, value: "100K+", label: "Happy Families" },
  { emoji: "🌍", tone: "teal" as const, value: "50+", label: "Countries" },
  { emoji: "⭐", tone: "gold" as const, value: "10K+", label: "Lessons & Quizzes" },
  { emoji: "❤️", tone: "pink" as const, value: "4.8", label: "Parent Rating" },
];

const trustBadges = ["▶ Google Play", "🍎 App Store", "🛡 kidSAFE", "★ Trustpilot", "🔒 Certified Child Safe"];

export default function Home() {
  return (
    <main>
      <Nav />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
            ⭐ Learn. Play. Grow. With Islamic Values.
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] text-ink sm:text-6xl">
            A Fun World
            <br />
            of Islamic Learning
            <br />
            for <span className="text-primary">Kids</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-inkMuted">
            Muslim Kids World makes learning about Islam exciting and
            meaningful through games, quizzes, stories, and daily challenges.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#download"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-primaryDark"
            >
              📱 Download for iOS
            </a>
            <a
              href="#download"
              className="flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 font-semibold text-ink shadow-sm transition hover:border-primary"
            >
              ▶ Download for Android
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-inkMuted">
            🛡️ Parent approved.{" "}
            <a href="#parents" className="font-medium text-primary underline">
              Kid safe.
            </a>
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="flex h-80 w-full max-w-md items-center justify-center rounded-[40px] bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-100 text-8xl shadow-inner sm:h-96">
            🕌
          </div>
          <div className="absolute left-0 top-6 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <p className="text-xs font-semibold text-inkMuted">🔥 Daily Challenge</p>
            <p className="text-sm font-bold text-ink">7 Day Streak</p>
          </div>
          <div className="absolute right-0 top-16 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <p className="text-xs font-semibold text-inkMuted">⏰ Learning Time</p>
            <p className="text-sm font-bold text-ink">42 min</p>
          </div>
          <div className="absolute bottom-10 left-2 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <p className="text-xs font-semibold text-inkMuted">⭐ Total XP</p>
            <p className="text-sm font-bold text-ink">850</p>
          </div>
          <div className="absolute bottom-0 right-2 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <p className="text-xs font-semibold text-inkMuted">👑 Level</p>
            <p className="text-sm font-bold text-ink">12</p>
          </div>
        </div>
      </section>

      {/* What Kids Will Love */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-2xl font-extrabold text-ink sm:text-3xl">
          ✦ What <span className="text-primary">Kids</span> Will Love ✦
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {loveFeatures.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto">
                <IconBadge emoji={f.emoji} tone={f.tone} size={56} shape="circle" />
              </div>
              <h3 className="mt-4 font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-inkMuted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Parents + stats */}
      <section id="parents" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_2fr]">
          <div className="flex items-center gap-4 rounded-2xl bg-violet-50 p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              👨‍👦
            </div>
            <div>
              <h3 className="font-extrabold text-ink">For Parents</h3>
              <p className="mt-1 text-sm text-inkMuted">
                Track progress, set goals and support your child&apos;s
                learning journey.
              </p>
              <a href="#parents" className="mt-2 inline-block text-sm font-semibold text-primary">
                Learn more →
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-2xl font-extrabold text-ink">{s.value}</span>
                <span className="text-xs text-inkMuted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section id="download" className="border-t border-border bg-white py-10">
        <p className="text-center text-sm text-inkMuted">
          Trusted by parents and loved by kids
        </p>
        <div className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-sm font-medium text-inkMuted">
          {trustBadges.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-inkMuted">
        <p>
          © {new Date().getFullYear()} Muslim Kids World. All rights
          reserved. ·{" "}
          <Link href="/admin" className="underline">
            Admin
          </Link>
        </p>
      </footer>
    </main>
  );
}
