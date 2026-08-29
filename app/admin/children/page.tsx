import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { ProgressCell } from "../../../components/admin/ProgressCell";
import { adminChildren } from "../../../lib/adminMock";

export default function AdminChildren() {
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
                  <th className="px-5 py-4 font-medium">Yaş qrupu</th>
                  <th className="px-5 py-4 font-medium">Valideyn</th>
                  <th className="px-5 py-4 font-medium">Səviyyə / XP</th>
                  <th className="px-5 py-4 font-medium">Streak</th>
                  <th className="px-5 py-4 font-medium">Dəqiqlik</th>
                  <th className="px-5 py-4 font-medium">Son aktivlik</th>
                </tr>
              </thead>
              <tbody>
                {adminChildren.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 font-semibold text-ink">{c.name}</td>
                    <td className="px-5 py-4 text-ink">{c.ageGroup}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
