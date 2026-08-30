"use client";

import { useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { supportTickets as initialTickets, type SupportTicket } from "../../../lib/adminMock";

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);

  function setStatus(id: string, status: SupportTicket["status"]) {
    setTickets((list) => list.map((t) => (t.id === id ? { ...t, status, updatedAt: "İndi" } : t)));
  }

  return (
    <>
      <AdminTopbar
        title="Dəstək"
        subtitle="İstifadəçi dəstək müraciətlərini idarə edin."
      />

      <div className="px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="px-5 py-4 font-medium">Mövzu</th>
                  <th className="px-5 py-4 font-medium">İstifadəçi</th>
                  <th className="px-5 py-4 font-medium">Prioritet</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Yenilənmə</th>
                  <th className="px-5 py-4 font-medium">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 font-medium text-ink">{t.subject}</td>
                    <td className="px-5 py-4 text-inkMuted">{t.user}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={t.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge label={t.status} />
                    </td>
                    <td className="px-5 py-4 text-inkMuted">{t.updatedAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {t.status !== "Cavablandırılıb" ? (
                          <button
                            onClick={() => setStatus(t.id, "Cavablandırılıb")}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface"
                          >
                            Cavabla
                          </button>
                        ) : null}
                        {t.status !== "Bağlanıb" ? (
                          <button
                            onClick={() => setStatus(t.id, "Bağlanıb")}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface"
                          >
                            Bağla
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatus(t.id, "Açıq")}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface"
                          >
                            Yenidən aç
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
