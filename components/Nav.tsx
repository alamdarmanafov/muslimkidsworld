import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "For Parents", href: "/#parents" },
  { label: "Partners", href: "/partners" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-blue-500 text-xl shadow-md">
          🌙
        </div>
        <span className="text-lg font-extrabold leading-tight text-ink">
          Muslim
          <br />
          <span className="text-primary">Kids</span> World
        </span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-medium text-ink lg:flex">
        {links.map((link, i) => (
          <Link
            key={link.label}
            href={link.href}
            className={
              i === 0
                ? "border-b-2 border-primary pb-1 text-primary"
                : "transition hover:text-primary"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="hidden items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-ink sm:flex">
          🌐 EN <span className="text-inkMuted">▾</span>
        </button>
        <Link
          href="/#download"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primaryDark"
        >
          ⬇ Download App
        </Link>
      </div>
    </header>
  );
}
