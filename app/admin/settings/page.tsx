"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { getSupabaseAdminClient } from "../../../lib/supabaseAdmin";

const languages = [
  { code: "az", flag: "🇦🇿", name: "Azərbaycanca" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "ru", flag: "🇷🇺", name: "Русский" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe" },
] as const;

type LangRow = {
  code: string;
  flag: string;
  name: string;
  quranVerses: number;
  duas: number;
  stories: number;
};

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<LangRow[]>([]);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();

    async function load() {
      const perLang = await Promise.all(
        languages.map(async (l) => {
          const [{ count: quranVerses }, { count: duas }, { count: stories }] = await Promise.all([
            supabase
              .from("quran_translations")
              .select("*", { count: "exact", head: true })
              .eq("lang", l.code),
            supabase.from("dua_translations").select("*", { count: "exact", head: true }).eq("lang", l.code),
            supabase
              .from("story_translations")
              .select("*", { count: "exact", head: true })
              .eq("lang", l.code),
          ]);
          return {
            code: l.code,
            flag: l.flag,
            name: l.name,
            quranVerses: quranVerses ?? 0,
            duas: duas ?? 0,
            stories: stories ?? 0,
          };
        }),
      );
      setRows(perLang);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <AdminTopbar title="Tənzimləmələr" subtitle="Dəstəklənən dillər üzrə real məzmun sayları." />

      <div className="space-y-8 px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">Dəstəklənən dillər</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="py-3 font-medium">Dil</th>
                  <th className="py-3 font-medium">Quran tərcümələri</th>
                  <th className="py-3 font-medium">Dualar</th>
                  <th className="py-3 font-medium">Hekayələr</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-inkMuted">
                      Yüklənir...
                    </td>
                  </tr>
                ) : (
                  rows.map((l) => (
                    <tr key={l.code} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-ink">
                        {l.flag} {l.name}
                      </td>
                      <td className="py-3 text-inkMuted">{l.quranVerses.toLocaleString()}</td>
                      <td className="py-3 text-inkMuted">{l.duas.toLocaleString()}</td>
                      <td className="py-3 text-inkMuted">{l.stories.toLocaleString()}</td>
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
