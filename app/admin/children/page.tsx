"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { ProgressCell } from "../../../components/admin/ProgressCell";
import { getSupabaseAdminClient } from "../../../lib/supabaseAdmin";

type ChildRow = {
  id: string;
  name: string;
  age: string;
  parent: string;
  xp: number;
  level: number;
  streak: number;
  accuracy: number;
  lastActive: string;
};

function formatLastActive(iso: string | null) {
  if (!iso) return "Heç vaxt";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Bu gün";
  if (days === 1) return "Dünən";
  return `${days} gün əvvəl`;
}

export default function AdminChildren() {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ChildRow[]>([]);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();

    async function load() {
      const [{ data: childRows }, { data: progressRows }, { data: parentRows }] = await Promise.all([
        supabase.from("children").select("id, family_id, name, age"),
        supabase
          .from("child_progress")
          .select("child_id, level, xp, streak, accuracy, last_activity_at"),
        supabase.from("parents").select("family_id, full_name"),
      ]);

      const progressByChild = new Map((progressRows ?? []).map((p) => [p.child_id, p]));
      const parentNameByFamily = new Map<string, string>();
      (parentRows ?? []).forEach((p) => {
        if (!parentNameByFamily.has(p.family_id)) {
          parentNameByFamily.set(p.family_id, p.full_name || "—");
        }
      });

      const rows: ChildRow[] = (childRows ?? []).map((c) => {
        const progress = progressByChild.get(c.id);
        return {
          id: c.id,
          name: c.name,
          age: c.age != null ? `${c.age} yaş` : "—",
          parent: parentNameByFamily.get(c.family_id) ?? "—",
          xp: progress?.xp ?? 0,
          level: progress?.level ?? 1,
          streak: progress?.streak ?? 0,
          accuracy: Math.round(progress?.accuracy ?? 0),
          lastActive: formatLastActive(progress?.last_activity_at ?? null),
        };
      });

      setChildren(rows);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <AdminTopbar
        title="Uşaqlar"
        subtitle="Uşaq profillərinə və performansına baxın. Həssas məlumatlar minimum saxlanılır."
      />

      <div className="px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="px-5 py-4 font-medium">Uşaq</th>
                  <th className="px-5 py-4 font-medium">Yaş</th>
                  <th className="px-5 py-4 font-medium">Valideyn</th>
                  <th className="px-5 py-4 font-medium">Səviyyə / XP</th>
                  <th className="px-5 py-4 font-medium">Streak</th>
                  <th className="px-5 py-4 font-medium">Dəqiqlik</th>
                  <th className="px-5 py-4 font-medium">Son aktivlik</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-inkMuted">
                      Yüklənir...
                    </td>
                  </tr>
                ) : children.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-inkMuted">
                      Heç bir uşaq tapılmadı.
                    </td>
                  </tr>
                ) : (
                  children.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 font-semibold text-ink">{c.name}</td>
                      <td className="px-5 py-4 text-ink">{c.age}</td>
                      <td className="px-5 py-4 text-inkMuted">{c.parent}</td>
                      <td className="px-5 py-4 text-ink">
                        Lvl {c.level} · {c.xp} XP
                      </td>
                      <td className="px-5 py-4 text-ink">🔥 {c.streak}</td>
                      <td className="px-5 py-4">
                        <ProgressCell percent={c.accuracy} />
                      </td>
                      <td className="px-5 py-4 text-inkMuted">{c.lastActive}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
