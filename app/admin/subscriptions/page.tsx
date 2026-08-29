import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { IconBadge } from "../../../components/IconBadge";
import { subscriptionPlans, subscriptionStatusStats } from "../../../lib/adminMock";

export default function AdminSubscriptions() {
  return (
    <>
      <AdminTopbar
        title="Abunəliklər"
        subtitle="Single Child və Family planlarını idarə edin."
      />

      <div className="px-8 pb-10">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {subscriptionStatusStats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
            >
              <IconBadge icon={s.icon} tone={s.tone} size={44} />
              <div>
                <p className="text-xl font-extrabold text-ink">{s.value}</p>
                <p className="text-sm text-inkMuted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-4 mt-10 text-lg font-bold text-ink">Planlar</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {subscriptionPlans.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-ink">{p.name}</h3>
                <span className="text-sm font-semibold text-primary">{p.price}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-inkMuted">Abunəçilər</span>
                <span className="font-semibold text-ink">{p.subscribers.toLocaleString()}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-inkMuted">Aylıq gəlir</span>
                <span className="font-semibold text-ink">{p.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
