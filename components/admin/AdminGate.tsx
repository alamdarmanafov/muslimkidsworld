"use client";

import { useEffect, useState } from "react";
import { ADMIN_CREDENTIALS, isAdminAuthed, setAdminAuthed } from "../../lib/adminAuth";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(isAdminAuthed());
    setReady(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setAdminAuthed(true);
      setAuthed(true);
      setError("");
    } else {
      setError("E-poçt və ya şifrə səhvdir.");
    }
  }

  if (!ready) return null;

  if (!authed) {
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
            placeholder="admin@muslimkidsworld.com"
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
            className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark"
          >
            Daxil ol
          </button>

          <p className="mt-4 text-center text-xs text-inkMuted">
            Demo: {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}
          </p>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
