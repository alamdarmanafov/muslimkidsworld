import { VenueSection } from "../../../components/admin/VenueSection";
import { restaurantVenues } from "../../../lib/adminMock";

export default function AdminRestaurants() {
  return (
    <VenueSection
      title="Yemək yerləri"
      subtitle="Kupon tərəfdaşı restoranları idarə edin."
      initialVenues={restaurantVenues}
      category="Restoran"
    />
  );
}
