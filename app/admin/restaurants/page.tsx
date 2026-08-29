import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { VenueTable } from "../../../components/admin/VenueTable";
import { restaurantVenues } from "../../../lib/adminMock";

export default function AdminRestaurants() {
  return (
    <>
      <AdminTopbar
        title="Yemək yerləri"
        subtitle="Kupon tərəfdaşı restoranları idarə edin."
        action={
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md">
            + Yeni tərəfdaş
          </button>
        }
      />
      <div className="px-8 pb-10">
        <VenueTable venues={restaurantVenues} />
      </div>
    </>
  );
}
