import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { adminRoles, languages } from "../../../lib/adminMock";

const ageGroups = ["3-4", "5-7", "8-10", "11-13", "14-16"];

export default function AdminSettings() {
  return (
    <>
      <AdminTopbar
        title="Tənzimləmələr"
        subtitle="Dillər, yaş qrupları və admin rolları."
      />

      <div className="space-y-8 px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">Dəstəklənən dillər</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="py-3 font-medium">Dil</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Suallar</th>
                  <th className="py-3 font-medium">Dərslər</th>
                </tr>
              </thead>
              <tbody>
                {languages.map((l) => (
                  <tr key={l.name} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-ink">
                      {l.flag} {l.name}
                    </td>
                    <td className="py-3">{l.status}</td>
                    <td className="py-3 text-inkMuted">{l.questions.toLocaleString()}</td>
                    <td className="py-3 text-inkMuted">{l.lessons.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">Yaş qrupları</h2>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((g) => (
              <span key={g} className="rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700">
                {g} yaş
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">Admin rolları</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="py-3 font-medium">Rol</th>
                  <th className="py-3 font-medium">Giriş</th>
                </tr>
              </thead>
              <tbody>
                {adminRoles.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-ink">{r.name}</td>
                    <td className="py-3 text-inkMuted">{r.access}</td>
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
