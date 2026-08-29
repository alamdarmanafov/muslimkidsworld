import { StatusBadge } from "./StatusBadge";
import type { Venue } from "../../lib/adminMock";

export function VenueTable({ venues }: { venues: Venue[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-inkMuted">
              <th className="px-5 py-4 font-medium">Tərəfdaş</th>
              <th className="px-5 py-4 font-medium">Kateqoriya</th>
              <th className="px-5 py-4 font-medium">Şəhər</th>
              <th className="px-5 py-4 font-medium">Aktiv kuponlar</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="px-5 py-4 font-semibold text-ink">{v.name}</td>
                <td className="px-5 py-4 text-inkMuted">{v.category}</td>
                <td className="px-5 py-4 text-inkMuted">{v.city}</td>
                <td className="px-5 py-4 text-ink">{v.activeCoupons}</td>
                <td className="px-5 py-4">
                  <StatusBadge label={v.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
