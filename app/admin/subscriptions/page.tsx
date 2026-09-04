"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { IconBadge } from "../../../components/IconBadge";
import { getSupabaseAdminClient } from "../../../lib/supabaseAdmin";

type StatusStat = { icon: "check" | "ban" | "clock" | "trendingDown"; tone: "green" | "pink" | "gold" | "orange"; label: string; value: string };
type PlanRow = { id: string; name: string; price: string; subscribers: number; revenue: string };

export default function AdminSubscriptions() {
  const [loading, setLoading] = useState(true);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [plans, setPlans] = useState<PlanRow[]>([]);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();

    async function load() {
      const [{ data: planRows }, { data: subRows }] = await Promise.all([
        supabase
          .from("subscription_plans")
          .select("id, name, price_cents, currency, period")
          .order("sort_order"),
        supabase.from("subscriptions").select("plan_id, status"),
      ]);

      const counts = { active: 0, cancelled: 0, trial: 0, expired: 0 };
      const subsByPlan = new Map<string, number>();
      (subRows ?? []).forEach((s) => {
        if (s.status in counts) counts[s.status as keyof typeof counts] += 1;
        subsByPlan.set(s.plan_id, (subsByPlan.get(s.plan_id) ?? 0) + (s.status === "active" ? 1 : 0));
      });

      setStatusStats([
        { icon: "check", tone: "green", label: "Aktiv", value: counts.active.toLocaleString() },
        { icon: "ban", tone: "pink", label: "Ləğv edilib", value: counts.cancelled.toLocaleString() },
        { icon: "clock", tone: "gold", label: "Sınaq müddəti", value: counts.trial.toLocaleString() },
        { icon: "trendingDown", tone: "orange", label: "Bitib", value: counts.expired.toLocaleString() },
      ]);

      setPlans(
        (planRows ?? []).map((p) => {
          const subscribers = subsByPlan.get(p.id) ?? 0;
          const revenueCents = subscribers * p.price_cents;
          return {
            id: p.id,
            name: p.name,
            price: `$${(p.price_cents / 100).toFixed(2)}/${p.period === "month" ? "ay" : p.period}`,
            subscribers,
            revenue: `$${(revenueCents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
          };
        }),
      );

      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <AdminTopbar title="Abunəliklər" subtitle="Single Child və Family planlarını idarə edin." />

      <div className="px-8 pb-10">
        {loading ? (
          <p className="text-sm text-inkMuted">Yüklənir...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {statusStats.map((s) => (
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
              {plans.map((p) => (
                <div key={p.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-ink">{p.name}</h3>
                    <span className="text-sm font-semibold text-primary">{p.price}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-inkMuted">Abunəçilər (aktiv)</span>
                    <span className="font-semibold text-ink">{p.subscribers.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-inkMuted">Aylıq gəlir</span>
                    <span className="font-semibold text-ink">{p.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
