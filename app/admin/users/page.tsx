"use client";

import { useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { Modal } from "../../../components/admin/Modal";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { Icon } from "../../../components/icons";
import { parents as initialParents, type Parent } from "../../../lib/adminMock";

export default function AdminUsers() {
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [viewing, setViewing] = useState<Parent | null>(null);

  function toggleSuspend(id: string) {
    setParents((list) =>
      list.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Dayandırılıb" ? "Aktiv" : "Dayandırılıb" }
          : p,
      ),
    );
  }

  function remove(id: string) {
    if (!confirm("Bu valideyn hesabını silmək istədiyinizə əminsiniz?")) return;
    setParents((list) => list.filter((p) => p.id !== id));
  }

  return (
    <>
      <AdminTopbar
        title="İstifadəçilər"
        subtitle="Valideyn hesablarını axtarın və idarə edin."
      />

      <div className="px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="px-5 py-4 font-medium">Valideyn</th>
                  <th className="px-5 py-4 font-medium">Ölkə</th>
                  <th className="px-5 py-4 font-medium">Plan</th>
                  <th className="px-5 py-4 font-medium">Uşaqlar</th>
                  <th className="px-5 py-4 font-medium">Cihazlar</th>
                  <th className="px-5 py-4 font-medium">Qeydiyyat</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {parents.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-inkMuted">{p.email}</p>
                    </td>
                    <td className="px-5 py-4 text-ink">{p.country}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                        {p.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink">{p.children}</td>
                    <td className="px-5 py-4 text-ink">{p.devices}</td>
                    <td className="px-5 py-4 text-inkMuted">{p.joined}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={p.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-inkMuted">
                        <button aria-label="Bax" onClick={() => setViewing(p)} className="hover:text-primary">
                          <Icon name="eye" style={{ width: 18, height: 18 }} />
                        </button>
                        <button
                          aria-label="Dayandır"
                          onClick={() => toggleSuspend(p.id)}
                          className="hover:text-amber-600"
                        >
                          <Icon name="ban" style={{ width: 18, height: 18 }} />
                        </button>
                        <button aria-label="Sil" onClick={() => remove(p.id)} className="hover:text-red-600">
                          <Icon name="trash" style={{ width: 18, height: 18 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {parents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-inkMuted">
                      Heç bir istifadəçi tapılmadı.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal title="Valideyn məlumatı" open={!!viewing} onClose={() => setViewing(null)}>
        {viewing ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-inkMuted">Ad</span>
              <span className="font-medium text-ink">{viewing.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">E-poçt</span>
              <span className="font-medium text-ink">{viewing.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Ölkə</span>
              <span className="font-medium text-ink">{viewing.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Plan</span>
              <span className="font-medium text-ink">{viewing.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Uşaqlar</span>
              <span className="font-medium text-ink">{viewing.children}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Cihazlar</span>
              <span className="font-medium text-ink">{viewing.devices}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Qeydiyyat tarixi</span>
              <span className="font-medium text-ink">{viewing.joined}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Status</span>
              <StatusBadge label={viewing.status} />
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
