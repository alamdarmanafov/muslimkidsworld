"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { IconBadge, type IconTone } from "../../../components/IconBadge";
import type { IconName } from "../../../components/icons";
import { getSupabaseAdminClient } from "../../../lib/supabaseAdmin";

type ContentStat = { icon: IconName; tone: IconTone; label: string; value: string };

export default function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ContentStat[]>([]);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();

    async function load() {
      const [
        { count: surahs },
        { count: verses },
        { count: duas },
        { count: stories },
        { count: achievements },
      ] = await Promise.all([
        supabase.from("quran_surahs").select("*", { count: "exact", head: true }),
        supabase.from("quran_verses").select("*", { count: "exact", head: true }),
        supabase.from("duas").select("*", { count: "exact", head: true }),
        supabase.from("stories").select("*", { count: "exact", head: true }),
        supabase.from("achievements").select("*", { count: "exact", head: true }),
      ]);

      setStats([
        { icon: "book", tone: "teal", label: "Quran surələri", value: (surahs ?? 0).toLocaleString() },
        { icon: "book", tone: "blue", label: "Quran ayələri", value: (verses ?? 0).toLocaleString() },
        { icon: "heart", tone: "purple", label: "Dualar", value: (duas ?? 0).toLocaleString() },
        { icon: "star", tone: "gold", label: "Hekayələr", value: (stories ?? 0).toLocaleString() },
        { icon: "crown", tone: "orange", label: "Nailiyyətlər", value: (achievements ?? 0).toLocaleString() },
      ]);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <AdminTopbar
        title="Məzmun idarəsi"
        subtitle="Verilənlər bazasındakı real məzmun sayları."
      />

      <div className="px-8 pb-10">
        {loading ? (
          <p className="text-sm text-inkMuted">Yüklənir...</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-white p-5 text-center shadow-sm">
                <IconBadge icon={s.icon} tone={s.tone} size={44} />
                <p className="mt-3 text-xl font-extrabold text-ink">{s.value}</p>
                <p className="text-xs text-inkMuted">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Məzmunu necə redaktə edim?</h2>
          <p className="mt-2 text-sm text-inkMuted">
            Quran tərcümələri, Dua və Hekayə mətnləri <code className="rounded bg-surface px-1">admin/index.html</code> —
            ayrıca, asılılıqsız statik alətdən redaktə olunur (bax:{" "}
            <code className="rounded bg-surface px-1">supabase/README.md</code>, &quot;Admin panel&quot; bölməsi). Bu
            səhifə yalnız real say göstərir; &quot;Sual&quot;, &quot;Dərs&quot; və &quot;Dünya elementi&quot; kimi
            köhnə template konsepsiyalarının verilənlər bazasında qarşılığı yoxdur, ona görə silinib.
          </p>
        </div>
      </div>
    </>
  );
}
