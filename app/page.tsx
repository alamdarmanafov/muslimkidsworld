const features = [
  {
    emoji: "🧠",
    title: "Daily 10",
    body: "Ten bite-sized questions a day — five with pictures, five with text — covering Islam Basics, Quran, Prophets, Salah, and more.",
  },
  {
    emoji: "🌍",
    title: "Muslim World",
    body: "A virtual world with a home, a mosque, a knowledge center, and a Good Deeds Garden that grows as your child does.",
  },
  {
    emoji: "❤️",
    title: "Good Deeds",
    body: "Kids log kindness — or parents assign a task — and watch a tree grow. Virtual rewards only, no real-money prizes.",
  },
  {
    emoji: "🔥",
    title: "Streaks & Rewards",
    body: "XP, streaks, and unlockables turn consistent learning into something kids actually look forward to.",
  },
];

const safety = [
  "No direct messaging or public chat",
  "No stranger interaction",
  "No advertising, ever",
  "No in-app payments for children",
  "Parent PIN / biometric gate on settings & subscriptions",
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: ["1 child", "Daily 10", "Basic lessons", "Limited rewards"],
    highlight: false,
  },
  {
    name: "Single Child",
    price: "$4.99",
    period: "/month",
    alt: "or $39.99/year",
    features: ["1 child", "Full lesson library", "All rewards & world items"],
    highlight: false,
  },
  {
    name: "Family",
    price: "$7.99",
    period: "/month",
    alt: "or $59.99/year",
    features: ["Up to 3 children", "Full lesson library", "All rewards & world items"],
    highlight: true,
  },
];

const languages = [
  ["🇬🇧", "English"],
  ["🇸🇦", "العربية"],
  ["🇹🇷", "Türkçe"],
  ["🇦🇿", "Azərbaycan"],
  ["🇮🇩", "Indonesia"],
  ["🇲🇾", "Melayu"],
  ["🇵🇰", "اردو"],
  ["🇧🇩", "বাংলা"],
  ["🇫🇷", "Français"],
  ["🇩🇪", "Deutsch"],
];

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span>🌙</span>
          <span>Muslim Kids World</span>
        </div>
        <a
          href="#plans"
          className="rounded-full border border-moon/40 px-4 py-2 text-sm font-medium text-moon transition hover:bg-moon hover:text-night"
        >
          See plans
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-12 text-center sm:pt-20">
        <span className="rounded-full bg-teal/20 px-4 py-1 text-sm font-medium text-teal">
          Coming soon · iOS & Android
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
          Learn <span className="text-moon">•</span> Play{" "}
          <span className="text-moon">•</span> Grow
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-sand/80">
          A safe, global Islamic learning world for kids — daily quizzes,
          good deeds, and a virtual Muslim World — with a parent dashboard
          that keeps every child&apos;s progress in view.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="cursor-not-allowed rounded-xl border border-sand/20 px-6 py-3 text-sm font-medium text-sand/50">
            📱 Download on the App Store
          </span>
          <span className="cursor-not-allowed rounded-xl border border-sand/20 px-6 py-3 text-sm font-medium text-sand/50">
            ▶️ Get it on Google Play
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">
          Everything a child needs, everything a parent trusts
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-sand/10 bg-white/5 p-6"
            >
              <div className="text-3xl">{f.emoji}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-sand/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For parents / safety */}
      <section className="bg-white/5 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Built for parents first</h2>
            <p className="mt-4 text-sand/70">
              Add each child with a one-time family code, track their
              accuracy and learning time in a weekly report, and approve
              every new device before it can sign in.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-sand/80">
              <li>👦👧 Manage up to 3 children on the Family plan</li>
              <li>📊 Weekly progress reports per child</li>
              <li>📱 Approve or reject new devices</li>
              <li>🔔 Notifications for streaks, completions, and rewards</li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Safety is non-negotiable</h2>
            <ul className="mt-6 space-y-3 text-sm text-sand/80">
              {safety.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="text-teal">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold">Simple family pricing</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-8 ${
                p.highlight
                  ? "border-moon bg-moon/10"
                  : "border-sand/10 bg-white/5"
              }`}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{p.price}</span>
                <span className="text-sand/60">{p.period}</span>
              </div>
              {p.alt && <p className="mt-1 text-xs text-sand/50">{p.alt}</p>}
              <ul className="mt-6 space-y-2 text-sm text-sand/80">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="mx-auto max-w-6xl px-6 pb-20 text-center">
        <h2 className="text-3xl font-bold">Built to be global from day one</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sand/70">
          Language follows your preference, then your device, then your
          country — never assumed, always changeable in Settings.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {languages.map(([flag, name]) => (
            <span
              key={name}
              className="rounded-full border border-sand/15 px-4 py-2 text-sm"
            >
              {flag} {name}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand/10 py-10 text-center text-sm text-sand/50">
        <p>© {new Date().getFullYear()} Muslim Kids World. All rights reserved.</p>
      </footer>
    </main>
  );
}
