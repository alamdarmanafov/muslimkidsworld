"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "../../lib/adminNav";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-slate-300">
      <Link href="/admin" className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-blue-500 text-lg">
          🌙
        </div>
        <span className="text-sm font-extrabold leading-tight text-white">
          Muslim
          <br />
          Kids World
        </span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {adminNav.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-primary text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.emoji}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-4 text-white">
        <p className="text-lg">👑</p>
        <p className="mt-1 text-sm font-bold">Premium versiya</p>
        <p className="mt-1 text-xs text-white/80">
          Bütün imkanlardan istifadə edin
        </p>
        <button className="mt-3 w-full rounded-lg bg-white py-2 text-sm font-semibold text-primaryDark">
          Yüksəlt
        </button>
      </div>
    </aside>
  );
}
