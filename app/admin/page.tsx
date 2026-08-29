import { AdminTopbar } from "../../components/admin/AdminTopbar";
import { IconBadge } from "../../components/IconBadge";
import { overviewStats, revenueStats } from "../../lib/adminMock";

export default function AdminOverview() {
  return (
    <>
      <AdminTopbar title="Ümumi baxış" subtitle="Muslim Kids World platformasının vəziyyəti." />

      <div className="px-8 pb-10">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {overviewStats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
            >
              <IconBadge icon={s.icon} tone={s.tone} size={48} />
              <div>
                <p className="text-xl font-extrabold text-ink">{s.value}</p>
                <p className="text-sm text-inkMuted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-4 mt-10 text-lg font-bold text-ink">Gəlir</h2>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
          {revenueStats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-5 text-center shadow-sm"
            >
              <IconBadge icon={s.icon} tone={s.tone} size={40} />
              <p className="text-lg font-extrabold text-ink">{s.value}</p>
              <p className="text-xs text-inkMuted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
