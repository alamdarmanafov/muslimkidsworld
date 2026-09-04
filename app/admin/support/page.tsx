"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { getSupabaseAdminClient } from "../../../lib/supabaseAdmin";

type MessageRow = {
  id: string;
  parentEmail: string;
  subject: string | null;
  message: string;
  status: "open" | "answered" | "closed";
  adminReply: string;
  createdAt: string;
};

type ReportRow = {
  id: string;
  kind: "crash" | "user_report";
  source: string;
  message: string;
  stack: string | null;
  screenshotPath: string | null;
  platform: string | null;
  appVersion: string | null;
  createdAt: string;
};

const tabs = ["Mesajlar", "Xəta hesabatları"] as const;
const statusLabel: Record<MessageRow["status"], string> = {
  open: "Açıq",
  answered: "Cavablandırılıb",
  closed: "Bağlanıb",
};

export default function AdminSupport() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Mesajlar");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function load() {
    const supabase = getSupabaseAdminClient();
    const [{ data: messageRows }, { data: parentRows }, { data: reportRows }] = await Promise.all([
      supabase
        .from("contact_messages")
        .select("id, parent_id, subject, message, status, admin_reply, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.from("parents").select("id, email"),
      supabase
        .from("error_reports")
        .select("id, kind, source, message, stack, screenshot_path, platform, app_version, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    const emailByParent = new Map((parentRows ?? []).map((p) => [p.id, p.email]));
    setMessages(
      (messageRows ?? []).map((m) => ({
        id: m.id,
        parentEmail: emailByParent.get(m.parent_id) || "—",
        subject: m.subject,
        message: m.message,
        status: m.status,
        adminReply: m.admin_reply || "",
        createdAt: new Date(m.created_at).toLocaleString("az-AZ"),
      })),
    );
    setReports(
      (reportRows ?? []).map((r) => ({
        id: r.id,
        kind: r.kind,
        source: r.source,
        message: r.message,
        stack: r.stack,
        screenshotPath: r.screenshot_path,
        platform: r.platform,
        appVersion: r.app_version,
        createdAt: new Date(r.created_at).toLocaleString("az-AZ"),
      })),
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveReply(id: string) {
    const reply = (drafts[id] ?? "").trim();
    const supabase = getSupabaseAdminClient();
    await supabase
      .from("contact_messages")
      .update({
        admin_reply: reply || null,
        status: reply ? "answered" : "open",
        replied_at: reply ? new Date().toISOString() : null,
      })
      .eq("id", id);
    load();
  }

  async function setStatus(id: string, status: MessageRow["status"]) {
    const supabase = getSupabaseAdminClient();
    await supabase.from("contact_messages").update({ status }).eq("id", id);
    load();
  }

  async function viewScreenshot(path: string) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.storage.from("bug-screenshots").createSignedUrl(path, 3600);
    if (error || !data) {
      alert("Şəkil açılmadı: " + (error?.message ?? ""));
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  return (
    <>
      <AdminTopbar title="Dəstək" subtitle="Valideyn mesajları və xəta hesabatları." />

      <div className="px-8 pb-10">
        <div className="mb-6 flex gap-6 border-b border-border text-sm font-medium text-inkMuted">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 transition ${
                tab === t ? "border-primary text-primary" : "border-transparent hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-inkMuted">Yüklənir...</p>
        ) : tab === "Mesajlar" ? (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-sm text-inkMuted">Heç bir mesaj yoxdur.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-3">
                    <StatusBadge label={statusLabel[m.status]} />
                    <span className="text-xs text-inkMuted">
                      {m.createdAt} · {m.parentEmail}
                    </span>
                  </div>
                  {m.subject ? <p className="font-semibold text-ink">{m.subject}</p> : null}
                  <p className="mt-1 text-sm text-ink">{m.message}</p>

                  <label className="mb-1 mt-4 block text-xs font-medium text-inkMuted">Cavabımız</label>
                  <textarea
                    value={drafts[m.id] ?? m.adminReply}
                    onChange={(e) => setDrafts((d) => ({ ...d, [m.id]: e.target.value }))}
                    rows={2}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => saveReply(m.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface"
                    >
                      Cavabı saxla
                    </button>
                    {m.status !== "closed" ? (
                      <button
                        onClick={() => setStatus(m.id, "closed")}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface"
                      >
                        Bağla
                      </button>
                    ) : (
                      <button
                        onClick={() => setStatus(m.id, "open")}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface"
                      >
                        Yenidən aç
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-sm text-inkMuted">Heç bir xəta hesabatı yoxdur.</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge label={r.source} />
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {r.kind === "user_report" ? "🐛 İstifadəçi hesabatı" : "⚠️ Crash"}
                    </span>
                    <span className="text-xs text-inkMuted">
                      {r.createdAt} · {r.platform ?? "—"} {r.appVersion ? `· v${r.appVersion}` : ""}
                    </span>
                  </div>
                  <p className="text-sm text-ink">{r.message}</p>
                  {r.screenshotPath ? (
                    <button
                      onClick={() => viewScreenshot(r.screenshotPath!)}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      🖼 Ekran şəklinə bax
                    </button>
                  ) : null}
                  {r.stack ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-medium text-inkMuted">
                        Stack trace
                      </summary>
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-surface p-3 text-xs text-inkMuted">
                        {r.stack}
                      </pre>
                    </details>
                  ) : null}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
