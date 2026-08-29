"use client";

import { useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { lessons, questions, worldItems } from "../../../lib/adminMock";

const tabs = ["Suallar", "Dərslər", "Dünya elementləri"] as const;

export default function AdminContent() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Suallar");

  return (
    <>
      <AdminTopbar
        title="Məzmun idarəsi"
        subtitle="Sualları, dərsləri və dünya elementlərini idarə edin."
        action={
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md">
            + Yeni yarat
          </button>
        }
      />

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

        {tab === "Suallar" ? (
          <div className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-inkMuted">
                    <th className="px-5 py-4 font-medium">Sual</th>
                    <th className="px-5 py-4 font-medium">Kateqoriya</th>
                    <th className="px-5 py-4 font-medium">Yaş</th>
                    <th className="px-5 py-4 font-medium">Çətinlik</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 font-medium text-ink">{q.prompt}</td>
                      <td className="px-5 py-4 text-inkMuted">{q.category}</td>
                      <td className="px-5 py-4 text-inkMuted">{q.age}</td>
                      <td className="px-5 py-4 text-inkMuted">{q.difficulty}</td>
                      <td className="px-5 py-4">
                        <StatusBadge label={q.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "Dərslər" ? (
          <div className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-inkMuted">
                    <th className="px-5 py-4 font-medium">Başlıq</th>
                    <th className="px-5 py-4 font-medium">Yaş</th>
                    <th className="px-5 py-4 font-medium">Format</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((l) => (
                    <tr key={l.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 font-medium text-ink">{l.title}</td>
                      <td className="px-5 py-4 text-inkMuted">{l.age}</td>
                      <td className="px-5 py-4 text-inkMuted">{l.format}</td>
                      <td className="px-5 py-4">
                        <StatusBadge label={l.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "Dünya elementləri" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {worldItems.map((w) => (
              <div key={w.id} className="rounded-2xl border border-border bg-white p-5 text-center shadow-sm">
                <p className="text-xs font-medium text-inkMuted">{w.type}</p>
                <p className="mt-1 font-bold text-ink">{w.name}</p>
                <p className="mt-2 text-xs text-inkMuted">🔒 Səviyyə {w.unlockLevel}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
