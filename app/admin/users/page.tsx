import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { Icon } from "../../../components/icons";
import { parents } from "../../../lib/adminMock";

export default function AdminUsers() {
  return (
    <>
      <AdminTopbar
        title="İstifadəçilər"
        subtitle="Valideyn hesablarını axtarın və idarə edin."
      />

      <div className="px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="px-5 py-4 font-medium">Valideyn</th>
                  <th className="px-5 py-4 font-medium">Ölkə</th>
                  <th className="px-5 py-4 font-medium">Plan</th>
                  <th className="px-5 py-4 font-medium">Uşaqlar</th>
                  <th className="px-5 py-4 font-medium">Cihazlar</th>
                  <th className="px-5 py-4 font-medium">Qeydiyyat</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {parents.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-inkMuted">{p.email}</p>
                    </td>
                    <td className="px-5 py-4 text-ink">{p.country}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                        {p.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink">{p.children}</td>
                    <td className="px-5 py-4 text-ink">{p.devices}</td>
                    <td className="px-5 py-4 text-inkMuted">{p.joined}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={p.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-inkMuted">
                        <button aria-label="Bax" className="hover:text-primary">
                          <Icon name="eye" style={{ width: 18, height: 18 }} />
                        </button>
                        <button aria-label="Dayandır" className="hover:text-amber-600">
                          <Icon name="ban" style={{ width: 18, height: 18 }} />
                        </button>
                        <button aria-label="Sil" className="hover:text-red-600">
                          <Icon name="trash" style={{ width: 18, height: 18 }} />
                        </button>
                      </div>
                    </td>
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
