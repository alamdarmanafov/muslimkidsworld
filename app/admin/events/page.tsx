"use client";

import { useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { Modal } from "../../../components/admin/Modal";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { IconBadge } from "../../../components/IconBadge";
import { events as initialEvents, type AdminEvent } from "../../../lib/adminMock";

export default function AdminEvents() {
  const [events, setEvents] = useState<AdminEvent[]>(initialEvents);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [missions, setMissions] = useState("10");

  function addEvent() {
    if (!name.trim() || !start || !end) return;
    setEvents((list) => [
      { id: `${Date.now()}`, name, start, end, status: "Planlaşdırılıb", missions: Number(missions) || 0 },
      ...list,
    ]);
    setName("");
    setStart("");
    setEnd("");
    setMissions("10");
    setOpen(false);
  }

  return (
    <>
      <AdminTopbar
        title="Tədbirlər"
        subtitle="Ramazan, Eid və mövsümi tədbirləri yaradın."
        action={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primaryDark"
          >
            + Yeni tədbir
          </button>
        }
      />
      <div className="px-8 pb-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {events.map((e) => (
            <div key={e.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <IconBadge icon="calendar" tone="purple" size={44} />
                  <div>
                    <h3 className="font-bold text-ink">{e.name}</h3>
                    <p className="text-xs text-inkMuted">
                      {e.start} – {e.end}
                    </p>
                  </div>
                </div>
                <StatusBadge label={e.status} />
              </div>
              <p className="mt-4 text-sm text-inkMuted">🎯 {e.missions} gündəlik missiya</p>
            </div>
          ))}
        </div>
      </div>

      <Modal title="Yeni tədbir yarat" open={open} onClose={() => setOpen(false)}>
        <label className="mb-1 block text-xs font-medium text-inkMuted">Ad</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ramadan Event"
          className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-inkMuted">Başlanğıc</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-inkMuted">Bitiş</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <label className="mb-1 block text-xs font-medium text-inkMuted">Gündəlik missiya sayı</label>
        <input
          value={missions}
          onChange={(e) => setMissions(e.target.value)}
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
            onClick={addEvent}
            disabled={!name.trim() || !start || !end}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Yarat
          </button>
        </div>
      </Modal>
    </>
  );
}
