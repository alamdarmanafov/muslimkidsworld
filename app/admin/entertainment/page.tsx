import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { VenueTable } from "../../../components/admin/VenueTable";
import { entertainmentVenues } from "../../../lib/adminMock";

export default function AdminEntertainment() {
  return (
    <>
      <AdminTopbar
        title="Əyləncə yerləri"
        subtitle="Kupon tərəfdaşı əyləncə məkanlarını idarə edin."
        action={
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md">
            + Yeni tərəfdaş
          </button>
        }
      />
      <div className="px-8 pb-10">
        <VenueTable venues={entertainmentVenues} />
      </div>
    </>
  );
}
