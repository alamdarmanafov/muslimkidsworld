"use client";

// components/admin/AdminGate.tsx
//
// Real Supabase auth, mirroring admin/index.html's flow exactly: sign
// in with the same email/password a parent account uses, then check
// parents.is_admin — an authenticated non-admin sees a clear "access
// denied" screen rather than the dashboard, and only public.is_admin()
// actually protects any data (see 0015_admin_panel.sql), this gate is
// just so a non-admin never sees the UI at all.
//
// Replaces the old lib/adminAuth.ts, which checked a hardcoded
// admin@muslimkidsworld.com / admin123 pair committed to source and
// stored nothing but a "1" flag in localStorage — anyone with the
// repo (or dev tools) had full admin access. That was a real security
// bug, not a placeholder worth keeping around.

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "../../lib/supabaseAdmin";

type GateState = "loading" | "signed-out" | "denied" | "allowed";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function checkSession(session: Session | null) {
    if (!session) {
      setState("signed-out");
      return;
    }
    const supabase = getSupabaseAdminClient();
    const { data: parent, error: parentError } = await supabase
      .from("parents")
      .select("is_admin")
      .eq("id", session.user.id)
      .maybeSingle();
    setState(!parentError && parent?.is_admin ? "allowed" : "denied");
  }

  useEffect(() => {
    const supabase = getSupabaseAdminClient();
    supabase.auth.getSession().then(({ data }) => checkSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession(session);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const supabase = getSupabaseAdminClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError("E-poçt və ya şifrə səhvdir.");
    }
  }

  async function signOut() {
    await getSupabaseAdminClient().auth.signOut();
  }

  if (state === "loading") return null;

  if (state === "signed-out") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-blue-500 text-2xl">
              🌙
            </div>
            <h1 className="mt-3 text-lg font-extrabold text-ink">Muslim Kids World</h1>
            <p className="text-sm text-inkMuted">Admin panelə giriş</p>
          </div>

          <label className="mb-1 block text-xs font-medium text-inkMuted">E-poçt</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            required
          />

          <label className="mb-1 block text-xs font-medium text-inkMuted">Şifrə</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mb-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            required
          />

          {error ? <p className="mb-3 text-xs font-medium text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark disabled:opacity-60"
          >
            {submitting ? "Yoxlanılır..." : "Daxil ol"}
          </button>

          <p className="mt-4 text-center text-xs text-inkMuted">
            Öz valideyn e-poçt/şifrənlə daxil ol — admin girişi{" "}
            <code className="rounded bg-surface px-1">public.parents.is_admin</code> ilə idarə
            olunur.
          </p>
        </form>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-extrabold text-ink">Giriş yoxdur</h1>
          <p className="mt-2 text-sm text-inkMuted">
            Bu hesabın admin girişi yoxdur. Öz hesabını admin etmək üçün Supabase SQL Editor-da:
            <br />
            <code className="mt-2 block rounded bg-surface px-2 py-1 text-xs">
              update public.parents set is_admin = true where email = &apos;...&apos;;
            </code>
          </p>
          <button
            onClick={signOut}
            className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark"
          >
            Çıxış
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
