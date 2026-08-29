import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { BarRow } from "../../../components/admin/BarRow";
import { IconBadge, type IconTone } from "../../../components/IconBadge";
import type { IconName } from "../../../components/icons";
import {
  engagementStats,
  learningStats,
  mostPopular,
  retention,
  subscriptionFunnel,
} from "../../../lib/adminMock";

type Stat = { icon: IconName; tone: IconTone; label: string; value: string };

function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <IconBadge icon={s.icon} tone={s.tone} size={44} />
          <div>
            <p className="text-xl font-extrabold text-ink">{s.value}</p>
            <p className="text-sm text-inkMuted">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminStatistics() {
  return (
    <>
      <AdminTopbar
        title="Statistika"
        subtitle="Engagement, learning, retention və subscription analitikası."
      />

      <div className="space-y-10 px-8 pb-10">
        <div>
          <h2 className="mb-4 text-lg font-bold text-ink">Engagement</h2>
          <StatRow stats={engagementStats} />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold text-ink">Learning</h2>
          <StatRow stats={learningStats} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-ink">Retention</h2>
            {retention.map((r) => (
              <BarRow key={r.label} label={r.label} value={r.value} />
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-ink">Subscription</h2>
            {subscriptionFunnel.map((r) => (
              <BarRow key={r.label} label={r.label} value={r.value} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold text-ink">Ən populyar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mostPopular.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <IconBadge icon={m.icon} tone={m.tone} size={40} />
                <p className="mt-3 text-sm font-semibold text-ink">{m.label}</p>
                <p className="mt-1 text-xs text-inkMuted">{m.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
