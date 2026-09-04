"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../components/admin/AdminTopbar";
import { IconBadge } from "../../components/IconBadge";
import { getSupabaseAdminClient } from "../../lib/supabaseAdmin";

type Stat = { icon: "users" | "smile" | "crown" | "flame" | "dollar" | "trendingUp"; tone: "purple" | "blue" | "gold" | "orange" | "green" | "teal"; label: string; value: string };

function formatUsd(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState<Stat[]>([]);
  const [revenueStats, setRevenueStats] = useState<Stat[]>([]);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();

    async function load() {
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      const [
        { count: parentsCount },
        { count: childrenCount },
        { count: activeSubsCount },
        { count: activeTodayCount },
        { data: activeSubs },
        { data: plans },
        { count: newSubsCount },
      ] = await Promise.all([
        supabase.from("parents").select("*", { count: "exact", head: true }),
        supabase.from("children").select("*", { count: "exact", head: true }),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase
          .from("child_progress")
          .select("*", { count: "exact", head: true })
          .gte("last_activity_at", todayStart.toISOString()),
        supabase.from("subscriptions").select("plan_id").eq("status", "active"),
        supabase.from("subscription_plans").select("id, price_cents"),
        supabase
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      const priceByPlan = new Map((plans ?? []).map((p) => [p.id, p.price_cents]));
      const mrrCents = (activeSubs ?? []).reduce(
        (sum, row) => sum + (priceByPlan.get(row.plan_id) ?? 0),
        0,
      );

      setOverviewStats([
        { icon: "users", tone: "purple", label: "Valideynlər", value: (parentsCount ?? 0).toLocaleString() },
        { icon: "smile", tone: "blue", label: "Uşaqlar", value: (childrenCount ?? 0).toLocaleString() },
        { icon: "crown", tone: "gold", label: "Premium", value: (activeSubsCount ?? 0).toLocaleString() },
        { icon: "flame", tone: "orange", label: "Bu gün aktiv", value: (activeTodayCount ?? 0).toLocaleString() },
      ]);
      setRevenueStats([
        { icon: "dollar", tone: "green", label: "MRR", value: formatUsd(mrrCents) },
        { icon: "dollar", tone: "green", label: "ARR", value: formatUsd(mrrCents * 12) },
        { icon: "trendingUp", tone: "teal", label: "Yeni abunəliklər (30 gün)", value: (newSubsCount ?? 0).toLocaleString() },
      ]);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <AdminTopbar title="Ümumi baxış" subtitle="Muslim Kids World platformasının vəziyyəti." />

      <div className="px-8 pb-10">
        {loading ? (
          <p className="text-sm text-inkMuted">Yüklənir...</p>
        ) : (
          <>
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
            <p className="mb-4 -mt-2 text-xs text-inkMuted">
              Yalnız aktiv abunəliklərin real planlarından hesablanıb — churn/renewal hadisə
              tarixçəsi hələ saxlanılmadığından burada göstərilmir.
            </p>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
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
          </>
        )}
      </div>
    </>
  );
}
