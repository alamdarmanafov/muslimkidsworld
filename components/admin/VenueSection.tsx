"use client";

import { useState } from "react";
import type { Venue } from "../../lib/adminMock";
import { AdminTopbar } from "./AdminTopbar";
import { Modal } from "./Modal";
import { StatusBadge } from "./StatusBadge";

export function VenueSection({
  title,
  subtitle,
  initialVenues,
  category,
}: {
  title: string;
  subtitle: string;
  initialVenues: Venue[];
  category: string;
}) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  function addVenue() {
    if (!name.trim()) return;
    setVenues((list) => [
      { id: `${Date.now()}`, name, category, city: city || "Bakı", activeCoupons: 0, status: "Gözləmədə" },
      ...list,
    ]);
    setName("");
    setCity("");
    setOpen(false);
  }

  return (
    <>
      <AdminTopbar
        title={title}
        subtitle={subtitle}
        action={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primaryDark"
          >
            + Yeni tərəfdaş
          </button>
        }
      />
      <div className="px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="px-5 py-4 font-medium">Tərəfdaş</th>
                  <th className="px-5 py-4 font-medium">Kateqoriya</th>
                  <th className="px-5 py-4 font-medium">Şəhər</th>
                  <th className="px-5 py-4 font-medium">Aktiv kuponlar</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((v) => (
                  <tr key={v.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 font-semibold text-ink">{v.name}</td>
                    <td className="px-5 py-4 text-inkMuted">{v.category}</td>
                    <td className="px-5 py-4 text-inkMuted">{v.city}</td>
                    <td className="px-5 py-4 text-ink">{v.activeCoupons}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={v.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal title="Yeni tərəfdaş əlavə et" open={open} onClose={() => setOpen(false)}>
        <label className="mb-1 block text-xs font-medium text-inkMuted">Ad</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Məkanın adı"
          className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <label className="mb-1 block text-xs font-medium text-inkMuted">Şəhər</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Bakı"
          className="mb-6 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            İmtina
          </button>
          <button
            onClick={addVenue}
            disabled={!name.trim()}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Əlavə et
          </button>
        </div>
      </Modal>
    </>
  );
}
