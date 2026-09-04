"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { BarRow } from "../../../components/admin/BarRow";
import { IconBadge, type IconTone } from "../../../components/IconBadge";
import type { IconName } from "../../../components/icons";
import { getSupabaseAdminClient } from "../../../lib/supabaseAdmin";

type Stat = { icon: IconName; tone: IconTone; label: string; value: string };
type CategoryRow = { label: string; value: number };
type AchievementRow = { icon: IconName; tone: IconTone; label: string; meta: string };

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
  const [loading, setLoading] = useState(true);
  const [learningStats, setLearningStats] = useState<Stat[]>([]);
  const [supportStats, setSupportStats] = useState<Stat[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);
  const [subscriptionRows, setSubscriptionRows] = useState<CategoryRow[]>([]);
  const [topAchievements, setTopAchievements] = useState<AchievementRow[]>([]);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();

    async function load() {
      const [
        { data: progressRows },
        { data: categoryStats },
        { data: subRows },
        { count: openMessages },
        { count: recentReports },
        { data: achievementEarns },
        { data: achievements },
      ] = await Promise.all([
        supabase.from("child_progress").select("accuracy, total_questions_answered, total_correct_answers"),
        supabase.from("child_category_stats").select("category, questions_answered, correct_answers"),
        supabase.from("subscriptions").select("status"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase
          .from("error_reports")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("child_achievements").select("achievement_id"),
        supabase.from("achievements").select("id, slug, label"),
      ]);

      const totalQuestions = (progressRows ?? []).reduce((s, r) => s + r.total_questions_answered, 0);
      const totalCorrect = (progressRows ?? []).reduce((s, r) => s + r.total_correct_answers, 0);
      const avgAccuracy =
        (progressRows ?? []).length > 0
          ? Math.round((progressRows ?? []).reduce((s, r) => s + Number(r.accuracy), 0) / (progressRows ?? []).length)
          : 0;

      setLearningStats([
        { icon: "quiz", tone: "purple", label: "Cavablanan sual", value: totalQuestions.toLocaleString() },
        { icon: "check", tone: "green", label: "Doğru cavab", value: totalCorrect.toLocaleString() },
        { icon: "star", tone: "gold", label: "Orta dəqiqlik", value: `${avgAccuracy}%` },
      ]);

      setSupportStats([
        { icon: "megaphone" as IconName, tone: "orange", label: "Açıq mesajlar", value: (openMessages ?? 0).toLocaleString() },
        { icon: "shield" as IconName, tone: "pink" as IconTone, label: "Son 7 gün xəta hesabatı", value: (recentReports ?? 0).toLocaleString() },
      ]);

      const byCategory = new Map<string, { q: number; c: number }>();
      (categoryStats ?? []).forEach((row) => {
        const cur = byCategory.get(row.category) ?? { q: 0, c: 0 };
        cur.q += row.questions_answered;
        cur.c += row.correct_answers;
        byCategory.set(row.category, cur);
      });
      setCategoryRows(
        Array.from(byCategory.entries())
          .map(([label, { q, c }]) => ({ label, value: q > 0 ? Math.round((c / q) * 100) : 0 }))
          .sort((a, b) => b.value - a.value),
      );

      const subCounts = { active: 0, trial: 0, cancelled: 0, expired: 0 };
      (subRows ?? []).forEach((s) => {
        if (s.status in subCounts) subCounts[s.status as keyof typeof subCounts] += 1;
      });
      const totalSubs = Object.values(subCounts).reduce((a, b) => a + b, 0) || 1;
      setSubscriptionRows([
        { label: "Aktiv", value: Math.round((subCounts.active / totalSubs) * 100) },
        { label: "Sınaq", value: Math.round((subCounts.trial / totalSubs) * 100) },
        { label: "Ləğv edilib", value: Math.round((subCounts.cancelled / totalSubs) * 100) },
        { label: "Bitib", value: Math.round((subCounts.expired / totalSubs) * 100) },
      ]);

      const earnCounts = new Map<string, number>();
      (achievementEarns ?? []).forEach((e) => {
        earnCounts.set(e.achievement_id, (earnCounts.get(e.achievement_id) ?? 0) + 1);
      });
      const topFive = (achievements ?? [])
        .map((a) => ({ label: a.label, count: earnCounts.get(a.id) ?? 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);
      setTopAchievements(
        topFive.map((a) => ({
          icon: "star" as IconName,
          tone: "gold" as IconTone,
          label: a.label,
          meta: `${a.count.toLocaleString()} uşaq qazanıb`,
        })),
      );

      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <AdminTopbar
        title="Statistika"
        subtitle="Real, ölçülə bilən göstəricilər — event/session izləmə infrastrukturu olmadığı üçün DAU/WAU/MAU və retention burada göstərilmir."
      />

      <div className="space-y-10 px-8 pb-10">
        {loading ? (
          <p className="text-sm text-inkMuted">Yüklənir...</p>
        ) : (
          <>
            <div>
              <h2 className="mb-4 text-lg font-bold text-ink">Öyrənmə</h2>
              <StatRow stats={learningStats} />
            </div>

            <div>
              <h2 className="mb-4 text-lg font-bold text-ink">Dəstək</h2>
              <StatRow stats={supportStats} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-ink">Kateqoriya üzrə dəqiqlik</h2>
                {categoryRows.length === 0 ? (
                  <p className="text-sm text-inkMuted">Hələ məlumat yoxdur.</p>
                ) : (
                  categoryRows.map((r) => <BarRow key={r.label} label={r.label} value={r.value} />)
                )}
              </div>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-ink">Abunəlik statusları</h2>
                {subscriptionRows.map((r) => (
                  <BarRow key={r.label} label={r.label} value={r.value} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-bold text-ink">Ən çox qazanılan nailiyyətlər</h2>
              {topAchievements.length === 0 ? (
                <p className="text-sm text-inkMuted">Hələ heç bir nailiyyət qazanılmayıb.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {topAchievements.map((m) => (
                    <div key={m.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                      <IconBadge icon={m.icon} tone={m.tone} size={40} />
                      <p className="mt-3 text-sm font-semibold text-ink">{m.label}</p>
                      <p className="mt-1 text-xs text-inkMuted">{m.meta}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
