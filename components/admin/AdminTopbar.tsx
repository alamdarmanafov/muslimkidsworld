"use client";

import { useEffect, useState } from "react";
import { getSupabaseAdminClient } from "../../lib/supabaseAdmin";

export function AdminTopbar({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getSupabaseAdminClient()
      .auth.getSession()
      .then(({ data }) => setEmail(data.session?.user.email ?? null));
  }, []);

  async function logout() {
    await getSupabaseAdminClient().auth.signOut();
    window.location.href = "/admin";
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border bg-white px-8 py-4">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-inkMuted">
          🔍 <span>Axtarış...</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-lg">
                🧑
              </div>
              <div className="text-left text-sm leading-tight">
                <p className="font-semibold text-ink">Admin</p>
                <p className="max-w-[160px] truncate text-xs text-inkMuted">{email ?? ""}</p>
              </div>
              <span className="text-inkMuted">▾</span>
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-12 z-10 w-40 rounded-xl border border-border bg-white py-2 shadow-lg">
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-surface"
                >
                  Çıxış
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 pb-4 pt-6">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-inkMuted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
    </div>
  );
}
