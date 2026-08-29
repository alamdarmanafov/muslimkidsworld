import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { supportTickets } from "../../../lib/adminMock";

export default function AdminSupport() {
  return (
    <>
      <AdminTopbar
        title="Dəstək"
        subtitle="İstifadəçi dəstək müraciətlərini idarə edin."
      />

      <div className="px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="px-5 py-4 font-medium">Mövzu</th>
                  <th className="px-5 py-4 font-medium">İstifadəçi</th>
                  <th className="px-5 py-4 font-medium">Prioritet</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Yenilənmə</th>
                </tr>
              </thead>
              <tbody>
                {supportTickets.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 font-medium text-ink">{t.subject}</td>
                    <td className="px-5 py-4 text-inkMuted">{t.user}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={t.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge label={t.status} />
                    </td>
                    <td className="px-5 py-4 text-inkMuted">{t.updatedAt}</td>
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
