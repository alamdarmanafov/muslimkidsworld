"use client";

import { useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { sentNotifications as initialNotifications, type SentNotification } from "../../../lib/adminMock";

const audiences = [
  "Bütün istifadəçilər",
  "Valideynlər",
  "Xüsusi yaş qrupu",
  "Xüsusi ölkə",
  "Premium istifadəçilər",
];

export default function AdminNotifications() {
  const [sent, setSent] = useState<SentNotification[]>(initialNotifications);
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState(audiences[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function send() {
    if (!title.trim()) return;
    const scheduled = date && time;
    setSent((list) => [
      {
        id: `${Date.now()}`,
        title,
        audience,
        sentAt: scheduled ? `${date} ${time}` : "İndi",
        status: scheduled ? "Planlaşdırılıb" : "Göndərilib",
      },
      ...list,
    ]);
    setTitle("");
    setAudience(audiences[0]);
    setDate("");
    setTime("");
  }

  return (
    <>
      <AdminTopbar
        title="Bildirişlər"
        subtitle="İstifadəçilərə hədəflənmiş bildirişlər göndərin."
      />

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
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sent.map((n) => (
                    <tr key={n.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 font-medium text-ink">{n.title}</td>
                      <td className="px-5 py-4 text-inkMuted">{n.audience}</td>
                      <td className="px-5 py-4 text-inkMuted">{n.sentAt}</td>
                      <td className="px-5 py-4">
                        <StatusBadge label={n.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-ink">Yeni bildiriş yarat</h2>

            <label className="mb-1 block text-xs font-medium text-inkMuted">Başlıq</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New Daily Challenge! 🔥"
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-medium text-inkMuted">Hədəf</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {audiences.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Tarix</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Vaxt</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              onClick={send}
              disabled={!title.trim()}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {date && time ? "Planlaşdır" : "Göndər"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
