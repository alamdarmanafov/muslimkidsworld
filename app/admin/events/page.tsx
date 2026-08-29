import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { IconBadge } from "../../../components/IconBadge";
import { events } from "../../../lib/adminMock";

export default function AdminEvents() {
  return (
    <>
      <AdminTopbar
        title="Tədbirlər"
        subtitle="Ramazan, Eid və mövsümi tədbirləri yaradın."
        action={
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md">
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
    </>
  );
}
