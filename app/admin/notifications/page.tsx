"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { getSupabaseAdminClient } from "../../../lib/supabaseAdmin";

type BroadcastRow = {
  id: string;
  title: string;
  audience: string;
  sentAt: string;
  sentCount: number;
};

const audiences = [
  { value: "all_parents", label: "Bütün valideynlər" },
  { value: "premium_parents", label: "Premium valideynlər" },
] as const;

const audienceLabel: Record<string, string> = {
  all_parents: "Bütün valideynlər",
  premium_parents: "Premium valideynlər",
};

export default function AdminNotifications() {
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState<BroadcastRow[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<(typeof audiences)[number]["value"]>("all_parents");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const supabase = getSupabaseAdminClient();
    const { data } = await supabase
      .from("admin_broadcasts")
      .select("id, title, audience, sent_count, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    setSent(
      (data ?? []).map((n) => ({
        id: n.id,
        title: n.title,
        audience: audienceLabel[n.audience] ?? n.audience,
        sentAt: new Date(n.created_at).toLocaleString("az-AZ"),
        sentCount: n.sent_count,
      })),
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function send() {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setError("");
    const supabase = getSupabaseAdminClient();
    const { data, error: invokeError } = await supabase.functions.invoke("admin-broadcast-notification", {
      body: { title: title.trim(), body: body.trim(), audience },
    });
    setSending(false);
    if (invokeError || !data?.ok) {
      setError(invokeError?.message ?? "Göndərilmədi.");
      return;
    }
    setTitle("");
    setBody("");
    load();
  }

  return (
    <>
      <AdminTopbar title="Bildirişlər" subtitle="Real Expo push bildirişləri göndərin — tarixçə real göndərişlərdən ibarətdir." />

      <div className="px-8 pb-10">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-inkMuted">
                    <th className="px-5 py-4 font-medium">Başlıq</th>
                    <th className="px-5 py-4 font-medium">Auditoriya</th>
                    <th className="px-5 py-4 font-medium">Vaxt</th>
                    <th className="px-5 py-4 font-medium">Çatdırılıb</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-inkMuted">
                        Yüklənir...
                      </td>
                    </tr>
                  ) : sent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-inkMuted">
                        Hələ heç bir bildiriş göndərilməyib.
                      </td>
                    </tr>
                  ) : (
                    sent.map((n) => (
                      <tr key={n.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-4 font-medium text-ink">{n.title}</td>
                        <td className="px-5 py-4 text-inkMuted">{n.audience}</td>
                        <td className="px-5 py-4 text-inkMuted">{n.sentAt}</td>
                        <td className="px-5 py-4">
                          <StatusBadge label={`${n.sentCount} cihaz`} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-ink">Yeni bildiriş göndər</h2>

            <label className="mb-1 block text-xs font-medium text-inkMuted">Başlıq</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New Daily Challenge! 🔥"
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-medium text-inkMuted">Mətn</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-medium text-inkMuted">Hədəf</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as typeof audience)}
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {audiences.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>

            {error ? <p className="mb-3 text-xs font-medium text-red-600">{error}</p> : null}

            <button
              onClick={send}
              disabled={!title.trim() || !body.trim() || sending}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Göndərilir..." : "Göndər"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
